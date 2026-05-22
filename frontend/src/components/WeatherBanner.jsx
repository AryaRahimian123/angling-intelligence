import { CloudSun, Wind } from 'lucide-react'
import { motion } from 'framer-motion'
import { memo } from 'react'

function WeatherBanner({ weather }) {
  const condition = weather?.condition || 'Current conditions'
  const tempC = weather?.tempC ?? '--'
  const windKph = weather?.windKph ?? '--'

  return (
    <motion.section
      className="mx-auto mt-7 max-w-6xl px-5 sm:px-8"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white/78 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-semibold text-white">
          <CloudSun className="h-4 w-4 text-cyan-100" />
          <span>Current conditions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>{condition}</span>
          <span>{tempC}°C</span>
          <span className="inline-flex items-center gap-2">
            <Wind className="h-4 w-4 text-cyan-100" />
            {windKph} km/h wind
          </span>
        </div>
      </div>
    </motion.section>
  )
}

export default memo(WeatherBanner)
