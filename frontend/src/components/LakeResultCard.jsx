import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { memo } from 'react'

function titleCase(value) {
  if (!value) return 'Medium'

  return value.charAt(0).toUpperCase() + value.slice(1)
}

function LakeResultCard({ water, weather, location }) {
  const pressure = `${titleCase(water.pressureLevel)} fishing pressure`
  const waterType = water.type || 'Water'
  const region = water.region || location
  const speciesCount = water.speciesCount ?? 0

  return (
    <motion.article
      layout
      className="group relative overflow-hidden rounded-md border border-black bg-[#263322] shadow-[0_14px_28px_rgba(2,10,6,0.28)] transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-black hover:bg-[#2d3a27] hover:shadow-[0_16px_34px_rgba(2,10,6,0.34)]"
      whileTap={{ scale: 0.992 }}
    >
      <Link
        to={`/water/${encodeURIComponent(water.id)}`}
        state={{ water, weather, location }}
        className="relative block px-4 py-4 text-left sm:px-5"
      >
        <span className="absolute inset-y-4 left-0 w-0.5 rounded-full bg-[#b8aa7a]/65 transition-colors group-hover:bg-[#c8ba8a]" />
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0">
            <h3 className="text-xl font-extrabold leading-tight text-[#f4efe4] sm:text-2xl">{water.name}</h3>
            <p className="mt-1.5 text-sm font-medium leading-5 text-[#c8c0aa]/76">
              {waterType} in {region}
            </p>
            <p className="mt-2 text-sm font-semibold leading-5 text-[#ddd4bd]/82">
              {speciesCount} target species <span className="text-[#9f967b]">•</span> {pressure}
            </p>
          </div>

          <div className="flex md:justify-end">
            <div className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d8c994]/70 bg-[#c9bb86] px-4 py-2.5 text-sm font-extrabold text-[#172214] transition-[background-color,border-color] group-hover:border-[#eadca8]/80 group-hover:bg-[#d4c693]">
              <span className="whitespace-nowrap">View species forecast</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default memo(LakeResultCard)
