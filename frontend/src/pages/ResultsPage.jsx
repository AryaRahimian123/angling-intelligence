import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import NearbyWatersGrid from '../components/NearbyWatersGrid.jsx'
import WeatherBanner from '../components/WeatherBanner.jsx'
import { fetchNearbyWaters } from '../services/api.js'

const LOCATION_NOT_FOUND_MESSAGE = 'Location not found. Try another Ontario city or town.'

export default function ResultsPage() {
  const routerLocation = useLocation()
  const [searchParams] = useSearchParams()
  const requestedLocation = routerLocation.state?.location || searchParams.get('location') || 'Guelph, ON'
  const preloadedResults = routerLocation.state?.nearbyResults

  const [location, setLocation] = useState(preloadedResults?.location || requestedLocation)
  const [weather, setWeather] = useState(preloadedResults?.weather || null)
  const [waters, setWaters] = useState(preloadedResults?.waters || [])
  const [loadingWaters, setLoadingWaters] = useState(!preloadedResults)
  const [resultsError, setResultsError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true

    async function loadResults() {
      if (preloadedResults && retryCount === 0) {
        setLocation(preloadedResults.location)
        setWeather(preloadedResults.weather)
        setWaters(preloadedResults.waters)
        setResultsError('')
        setLoadingWaters(false)
        return
      }

      setLoadingWaters(true)
      setResultsError('')

      try {
        const response = await fetchNearbyWaters(requestedLocation)

        if (!active) return

        setLocation(response.location)
        setWeather(response.weather)
        setWaters(response.waters)
      } catch (error) {
        if (!active) return

        setWeather(null)
        setWaters([])
        setResultsError(error.message === 'Location not found'
          ? LOCATION_NOT_FOUND_MESSAGE
          : error.message || 'Could not load nearby waters.')
      } finally {
        if (active) {
          setLoadingWaters(false)
        }
      }
    }

    loadResults()

    return () => {
      active = false
    }
  }, [preloadedResults, requestedLocation, retryCount])

  const hasResults = useMemo(() => waters.length > 0 && weather, [waters, weather])

  return (
    <main className="relative min-h-screen overflow-hidden bg-midnight pb-20 text-mist">
      <div className="pointer-events-none absolute inset-0 bg-[#183222]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,#0d2416_0%,#183222_24%,#23412a_48%,#6a9451_72%,#2f3f24_100%)] opacity-88" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] bg-[repeating-linear-gradient(92deg,rgba(244,239,228,0.22)_0,rgba(244,239,228,0.22)_1px,transparent_1px,transparent_7px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#b8aa7a]/32" />
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-32">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/72 transition-colors hover:border-cyan-100/30 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          New search
        </Link>

        <motion.div
          className="mt-9 max-w-3xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Waters near <span className="text-[#e7dcc1]">{location}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#c9c0aa]/78 sm:text-lg">
            Choose a water below to view <span className="text-[#d8c994]">species forecasts</span> and fishing details.
          </p>
        </motion.div>
      </section>

      {loadingWaters ? (
        <section className="relative mx-auto mt-14 grid max-w-6xl place-items-center px-5 sm:px-8">
          <div className="flex items-center gap-3 rounded-[2rem] border border-white/10 bg-white/[0.07] px-6 py-5 text-white/72 shadow-sm backdrop-blur-sm">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-100" />
            Reading nearby water conditions
          </div>
        </section>
      ) : null}

      {!loadingWaters && resultsError ? (
        <section className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8">
          <div className="rounded-[2rem] border border-rose-200/15 bg-rose-400/[0.07] p-8 text-center">
            <p className="text-lg font-bold text-white">Could not load nearby waters</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/62">{resultsError}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 rounded-full bg-cyan-100 px-5 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-white"
            >
              Try again
            </button>
          </div>
        </section>
      ) : null}

      {hasResults ? (
        <>
          <WeatherBanner weather={weather} location={location} />
          <NearbyWatersGrid waters={waters} weather={weather} location={location} />
        </>
      ) : null}

      {!loadingWaters && !resultsError && !hasResults ? (
        <section className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center">
            <p className="text-lg font-bold text-white">No nearby waters found</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/58">
              Try a different Ontario city or nearby landmark.
            </p>
          </div>
        </section>
      ) : null}
    </main>
  )
}
