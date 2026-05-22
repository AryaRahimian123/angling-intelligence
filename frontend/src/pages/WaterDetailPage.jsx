import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import SpeciesGrid from '../components/SpeciesGrid.jsx'
import { fetchWaterById } from '../services/api.js'

function compactWeatherLine(weather, speciesCount) {
  const parts = []

  if (weather?.condition) parts.push(weather.condition)
  if (weather?.tempC != null) parts.push(`${weather.tempC}°C`)
  if (weather?.windKph != null) parts.push(`${weather.windKph} km/h wind`)
  parts.push(`${speciesCount} target species`)

  return parts.join(' • ')
}

export default function WaterDetailPage() {
  const { id } = useParams()
  const routerLocation = useLocation()
  const stateWater = routerLocation.state?.water
  const stateWeather = routerLocation.state?.weather
  const previousLocation = routerLocation.state?.location

  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true

    async function loadWater() {
      setLoading(true)
      setError('')

      try {
        const response = await fetchWaterById(id)

        if (!active) return

        setDetail(response)
      } catch (loadError) {
        if (!active) return

        setDetail(null)
        setError(loadError.message || 'Could not load this water.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadWater()

    return () => {
      active = false
    }
  }, [id, retryCount])

  const water = detail?.water || stateWater
  const weather = detail?.weather || stateWeather
  const species = useMemo(() => detail?.speciesScores || [], [detail])
  const speciesCount = species.length || water?.speciesCount || 0
  const backTo = previousLocation
    ? `/results?location=${encodeURIComponent(previousLocation)}`
    : '/results'

  return (
    <main className="relative min-h-screen overflow-hidden bg-midnight text-mist">
      <div className="pointer-events-none absolute inset-0 bg-[#183222]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,#0d2416_0%,#183222_24%,#23412a_48%,#6a9451_72%,#2f3f24_100%)] opacity-88" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] bg-[repeating-linear-gradient(92deg,rgba(244,239,228,0.22)_0,rgba(244,239,228,0.22)_1px,transparent_1px,transparent_7px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#b8aa7a]/32" />
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-32">
        <Link
          to={backTo}
          state={previousLocation ? { location: previousLocation } : undefined}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/72 transition-colors hover:border-[#d8c994]/35 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to waters
        </Link>

        <motion.div
          className="mt-9 max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {water?.name || 'Loading water'}
          </h1>
          <p className="mt-3 text-base font-medium leading-7 text-[#c9c0aa]/78 sm:text-lg">
            {water?.type || 'Water'} in {water?.region || 'Ontario'}
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#ddd4bd]/86 sm:text-base">
            {compactWeatherLine(weather, speciesCount)}
          </p>
        </motion.div>
      </section>

      {loading ? (
        <section className="relative mx-auto mt-14 grid max-w-6xl place-items-center px-5 sm:px-8">
          <div className="flex items-center gap-3 rounded-md border border-black/30 bg-[#263322] px-6 py-5 text-[#ddd4bd]/78 shadow-[0_14px_28px_rgba(2,10,6,0.24)]">
            <Loader2 className="h-5 w-5 animate-spin text-[#c9bb86]" />
            Reading species conditions
          </div>
        </section>
      ) : null}

      {!loading && error ? (
        <section className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8">
          <div className="rounded-md border border-black/30 bg-[#263322] p-8 text-center shadow-[0_14px_28px_rgba(2,10,6,0.24)]">
            <p className="text-lg font-bold text-[#f4efe4]">Could not load water conditions</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#c8c0aa]/76">{error}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#d8c994]/70 bg-[#c9bb86] px-5 py-2 text-sm font-bold text-[#172214] transition-colors hover:bg-[#d4c693]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </section>
      ) : null}

      {!loading && !error && species.length > 0 ? (
        <SpeciesGrid species={species} water={water} weather={weather} />
      ) : null}

      {!loading && !error && species.length === 0 ? (
        <section className="relative mx-auto mt-14 max-w-6xl px-5 pb-20 sm:px-8">
          <div className="rounded-md border border-black/30 bg-[#263322] p-8 text-center shadow-[0_14px_28px_rgba(2,10,6,0.24)]">
            <p className="text-lg font-bold text-[#f4efe4]">No species conditions found</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#c8c0aa]/76">
              Try another nearby water from the results list.
            </p>
          </div>
        </section>
      ) : null}
    </main>
  )
}
