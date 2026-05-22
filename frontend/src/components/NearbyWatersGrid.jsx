import { motion } from 'framer-motion'
import { memo } from 'react'
import LakeResultCard from './LakeResultCard.jsx'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' } },
}

function NearbyWatersGrid({ waters, weather, location }) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-6 sm:px-8 sm:pt-8">
      <motion.div
        className="grid gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {waters.map((water) => (
          <motion.div key={water.id} variants={item}>
            <LakeResultCard water={water} weather={weather} location={location} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default memo(NearbyWatersGrid)
