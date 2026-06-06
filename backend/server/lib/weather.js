const GEOCODING_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
const CURRENT_WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const KPH_PER_MPS = 3.6;
const WEATHER_CACHE_DURATION_MS = 30 * 60 * 1000;
const weatherCache = new Map();

export async function geocodeLocation(location) {
  const cleanLocation = normalizeLocationText(location);
  const searchLocation = getOntarioFocusedLocation(cleanLocation);
  let data = await fetchGeocodingResults(searchLocation);

  if (!data || data.length === 0) {
    data = await fetchGeocodingResults(getBaseLocation(cleanLocation));
  }

  if (!data || data.length === 0) {
    throw new Error(`No location found for "${location}".`);
  }

  const result = getBestOntarioResult(data);

  return {
    name: result.name,
    country: "Canada",
    region: result.state || null,
    lat: result.lat,
    lon: result.lon,
  };
}

function getOntarioFocusedLocation(location) {
  return `${getBaseLocation(location)},Ontario,CA`;
}

async function fetchGeocodingResults(location, limit = 10) {
  const url = new URL(GEOCODING_API_URL);
  url.searchParams.set("q", location);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("appid", getOpenWeatherApiKey());

  return fetchOpenWeatherJson(url, "OpenWeather geocoding", "Could not geocode location.");
}

function getOpenWeatherApiKey() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY is not configured.");
  }

  return apiKey;
}

function getBestOntarioResult(results) {
  const ontarioResults = results.filter((result) => {
    return result.country === "CA" && result.state === "Ontario";
  });

  if (ontarioResults.length === 0) {
    throw new Error("No Ontario location found.");
  }

  return ontarioResults[0];
}

function getBaseLocation(location) {
  const baseLocation = location
    .replace(/\bOntario\b/gi, "")
    .replace(/\bCanada\b/gi, "")
    .replace(/\bCA\b/g, "")
    .replace(/\bON\b/g, "")
    .replace(/\s*,\s*/g, ",")
    .replace(/^,+|,+$/g, "");

  return normalizeLocationText(baseLocation) || location;
}

function normalizeLocationText(location) {
  return location.trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",");
}

export async function getCurrentWeather(lat, lon) {
  const cacheKey = getWeatherCacheKey(lat, lon);
  const cachedEntry = weatherCache.get(cacheKey);
  const cachedWeather = getFreshCachedWeather(cacheKey, cachedEntry);

  if (cachedWeather) {
    console.info("Weather cache hit", cacheKey);
    return cachedWeather;
  }

  console.info("Weather cache miss", cacheKey);

  const url = new URL(CURRENT_WEATHER_API_URL);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", getOpenWeatherApiKey());

  try {
    const data = await fetchOpenWeatherJson(
      url,
      "OpenWeather current weather",
      "Could not get current weather."
    );

    const weather = mapOpenWeatherToCurrentWeather(data);

    weatherCache.set(cacheKey, {
      weather,
      cachedAt: Date.now(),
    });

    return weather;
  } catch (error) {
    if (cachedEntry) {
      console.error("OpenWeather failed; returning expired cached weather:", error);
      return cachedEntry.weather;
    }

    throw error;
  }
}

function getWeatherCacheKey(lat, lon) {
  // Weather cache keys round coordinates to 3 decimals so nearby repeated searches reuse one entry.
  return `${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}`;
}

function getFreshCachedWeather(cacheKey, cachedEntry) {
  // Cache retrieval flow: read the entry first, then validate age before returning weather data.
  if (!cachedEntry) {
    return null;
  }

  const cacheAgeMs = Date.now() - cachedEntry.cachedAt;

  // Cache expiration is time based; weather older than 30 minutes is kept only as a fallback.
  if (cacheAgeMs >= WEATHER_CACHE_DURATION_MS) {
    return null;
  }

  return cachedEntry.weather;
}

async function fetchOpenWeatherJson(url, label, genericErrorMessage) {
  console.info(`${label} URL:`, getSafeUrl(url));

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    console.error(`${label} fetch network error:`, error);
    console.error(`${label} fetch network error message:`, error.message);

    throw new Error(genericErrorMessage);
  }

  if (!response.ok) {
    const errorText = await response.text();

    console.error(`${label} API error:`);
    console.error("Status:", response.status);
    console.error("Status text:", response.statusText);
    console.error("Response body:", errorText);

    if (response.status === 401) {
      throw new Error("Invalid OpenWeather API key.");
    }

    throw new Error(genericErrorMessage);
  }

  return response.json();
}

function getSafeUrl(url) {
  const safeUrl = new URL(url);
  safeUrl.searchParams.set("appid", "[redacted]");

  return safeUrl.toString();
}

function mapOpenWeatherToCurrentWeather(data) {
  if (!data || !data.main) {
    throw new Error("No current weather data was returned.");
  }

  const weather = data.weather && data.weather[0] ? data.weather[0] : {};
  const tempC = data.main.temp;
  const feelsLikeC = data.main.feels_like;
  const humidityPct = data.main.humidity;
  const pressureHpa = data.main.pressure;
  const cloudCoverPct = data.clouds?.all;
  const windKph = convertMpsToKph(data.wind?.speed);
  const windGustKph = convertMpsToKph(data.wind?.gust);
  const rainMm = data.rain?.["1h"] || data.rain?.["3h"] || 0;
  const snowMm = data.snow?.["1h"] || data.snow?.["3h"] || 0;
  const description = weather.description || weather.main || "Unknown";
  const condition = weather.main || description;

  return {
    time: getOpenWeatherTime(data),
    tempC,
    humidityPct,
    pressureHpa,
    cloudCoverPct,
    windKph,
    condition,
    temperature: {
      value: tempC,
      unit: "°C",
    },
    feelsLike: {
      value: feelsLikeC,
      unit: "°C",
    },
    humidity: {
      value: humidityPct,
      unit: "%",
    },
    precipitation: {
      value: rainMm + snowMm,
      unit: "mm",
    },
    rain: {
      value: rainMm,
      unit: "mm",
    },
    showers: {
      value: 0,
      unit: "mm",
    },
    snowfall: {
      value: snowMm,
      unit: "mm",
    },
    cloudCover: {
      value: cloudCoverPct,
      unit: "%",
    },
    pressure: {
      meanSeaLevel: {
        value: data.main.sea_level || pressureHpa,
        unit: "hPa",
      },
      surface: {
        value: data.main.grnd_level || pressureHpa,
        unit: "hPa",
      },
    },
    wind: {
      speed: {
        value: windKph,
        unit: "km/h",
      },
      direction: {
        value: data.wind?.deg,
        unit: "°",
      },
      gusts: {
        value: windGustKph,
        unit: "km/h",
      },
    },
    weatherCode: weather.id,
    description,
  };
}

function convertMpsToKph(speedMps) {
  if (typeof speedMps !== "number") {
    return undefined;
  }

  return Number((speedMps * KPH_PER_MPS).toFixed(1));
}

function getOpenWeatherTime(data) {
  if (typeof data.dt !== "number") {
    return new Date().toISOString();
  }

  return new Date(data.dt * 1000).toISOString();
}

export function getSeason(date = new Date()) {
  const month = date.getMonth() + 1;

  if (month === 12 || month === 1 || month === 2) {
    return "winter";
  }

  if (month >= 3 && month <= 5) {
    return "spring";
  }

  if (month >= 6 && month <= 8) {
    return "summer";
  }

  return "fall";
}
