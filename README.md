# Angling Intelligence

Angling Intelligence is a full-stack web app for discovering fishing waters across Ontario. Users can enter an Ontario city or town, find nearby lakes and rivers, view current weather conditions, and explore species-level fishing recommendations designed to support better first casts.

## Live Demo

Live Demo: https://angling-intelligence.vercel.app/



## Features

- Search by Ontario city or town
- Find nearby lakes, rivers, and fishing waters
- View distance, region, water type, accessibility, pressure level, and species count
- Explore water detail pages with weather and species recommendations
- Open species cards and dropdowns for more targeted fishing guidance
- Use a fish activity and scoring system based on conditions and species behavior
- Pull current weather data through Open-Meteo
- Generate optional fishing tips with Gemini through `@google/genai`
- Handle invalid or non-Ontario locations cleanly
- Responsive underwater-themed frontend with fish, weeds, bubbles, light rays, and a custom logo

## Tech Stack

### Frontend

- React
- Vite
- Tailwind-style utility classes
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express
- CORS
- dotenv
- Open-Meteo geocoding and weather APIs
- Gemini API through `@google/genai`

## Architecture Overview

The project is split into two deployable apps:

```txt
/frontend   React + Vite client deployed on Vercel
/backend    Node.js + Express API deployed on Render
```

The frontend calls the backend using `VITE_API_BASE_URL` in production. Local development can still use the Vite proxy for `/api` routes when configured for the development server.

The backend owns location validation, water lookup logic, weather integration, species scoring, and optional Gemini-generated fishing tips. Geocoding is intentionally Ontario-focused and rejects locations outside Ontario, Canada.

## API Overview

### `GET /`

Health check route for deployment testing.

Returns:

```txt
Angling Intelligence API is running
```

### `POST /api/nearby-waters`

Accepts an Ontario city or town and returns nearby fishing waters, location details, and current weather.

### `GET /api/water/:id`

Returns detail data for a specific waterbody, including species recommendations and current conditions.

### `POST /api/fish-tip`

Returns a short fishing tip using Gemini when available, with fallback tips when the API key is not configured or the AI request fails.

## Local Setup

Clone the repository:

```bash
git clone https://github.com/AryaRahimian123/angling-intelligence.git
cd Angling-Intelligence-Arya
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```


Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Default local URLs:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

## Deployment Notes

- Frontend is deployed separately on Vercel.
- Backend is deployed separately on Render.
- The frontend uses `VITE_API_BASE_URL` to call the deployed backend.
- The backend uses `process.env.PORT || 3000` for local and hosted environments.
- The backend health check route can be used to verify Render deployment status.
- API keys and environment-specific values should be configured through the hosting provider, not committed to the repository.

## Technical Highlights

- Full-stack production architecture with separate frontend and backend deployments
- Environment-based API configuration for local and production builds
- Ontario-only geocoding validation using Open-Meteo location metadata
- Weather-aware species scoring and recommendation logic
- Graceful fallback behavior when Gemini is unavailable
- User-focused error handling for invalid or unsupported locations
- Responsive, polished UI with a custom underwater visual direction
- Backend health check route for deployment testing

## Future Improvements

- Ontario fish stocking data integration
- Improved species seasonality logic
- More Ontario waterbody data
- Better fish image and illustration consistency
- Caching repeated weather and search requests
- More detailed mobile polish
- Optional saved waters or trip planning features

## Author

Built by Arya Rahimian.
