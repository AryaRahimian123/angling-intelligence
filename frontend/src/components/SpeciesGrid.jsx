import { motion } from 'framer-motion'
import { memo, useCallback, useState } from 'react'
import ExpandableSpeciesCard from './ExpandableSpeciesCard.jsx'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.045 },
  },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' } },
}

function SpeciesGrid({ species, weather }) {
  const [expandedSpecies, setExpandedSpecies] = useState(null)

  const handleToggle = useCallback((name) => {
    setExpandedSpecies((current) => (current === name ? null : name))
  }, [])

  const handleClose = useCallback(() => {
    setExpandedSpecies(null)
  }, [])

  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Target species</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#c9c0aa]/78">
          Expand a card for the conditions behind each recommendation.
        </p>
      </div>

      <div className="relative">
        {expandedSpecies ? (
          <motion.div
            className="pointer-events-none absolute inset-0 -m-4 rounded-md bg-black/12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        ) : null}

        <motion.div
          className="relative grid gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {species.map((fish) => (
            <motion.div
              key={fish.species}
              variants={item}
              className={expandedSpecies === fish.species ? 'min-[520px]:col-span-2 lg:col-span-3' : ''}
            >
              <ExpandableSpeciesCard
                fish={fish}
                weather={weather}
                expanded={expandedSpecies === fish.species}
                dimmed={Boolean(expandedSpecies) && expandedSpecies !== fish.species}
                onToggle={() => handleToggle(fish.species)}
                onClose={handleClose}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default memo(SpeciesGrid)
