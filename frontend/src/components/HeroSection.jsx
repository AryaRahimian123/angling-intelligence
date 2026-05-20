import { motion } from 'framer-motion'
import { memo } from 'react'
import BubbleBackground from './BubbleBackground.jsx'
import SearchBar from './SearchBar.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

function HeroSection({ onSearch, isLoading, searchError }) {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-midnight px-5 py-28 sm:px-8"
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center opacity-60 saturate-150"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1755870344289-00ac1db1b144?auto=format&fit=crop&fm=webp&q=58&w=1600')",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_13%,rgba(254,240,138,0.22),transparent_18%),radial-gradient(circle_at_50%_18%,rgba(224,242,254,0.30),transparent_26%),radial-gradient(circle_at_50%_54%,rgba(16,185,129,0.18),transparent_40%),linear-gradient(180deg,rgba(7,89,133,0.48)_0%,rgba(13,148,136,0.25)_32%,rgba(6,78,59,0.28)_48%,rgba(8,28,43,0.82)_72%,#020814_100%)]" />
      <div className="water-sheen absolute inset-x-0 bottom-0 h-[38vh] opacity-65" />
      <div className="mist-layer absolute inset-x-0 top-16 h-52 opacity-70" />
      <BubbleBackground />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-midnight" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl text-center"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.055 }}
      >
        <motion.p
          className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-cyan-50/90 drop-shadow-sm"
          variants={fadeUp}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          Ontario fishing intelligence
        </motion.p>
        <motion.h1
          className="mx-auto max-w-5xl text-balance text-5xl font-black leading-[0.92] tracking-normal text-stone-50 drop-shadow-[0_5px_26px_rgba(2,8,23,0.55)] sm:text-7xl lg:text-8xl"
          variants={fadeUp}
          transition={{ duration: 0.38, ease: 'easeOut' }}
        >
          Angling Intelligence
        </motion.h1>
        <motion.p
          className="mx-auto mt-7 max-w-2xl text-xl font-semibold text-stone-50/88 drop-shadow-sm sm:text-2xl"
          variants={fadeUp}
          transition={{ duration: 0.34, ease: 'easeOut' }}
        >
          Where are we fishing today?
        </motion.p>
        <motion.div
          className="mx-auto mt-7 h-px w-80 bg-gradient-to-r from-transparent via-amber-100/65 to-cyan-100/0"
          variants={{
            hidden: { opacity: 0, scaleX: 0.7 },
            show: { opacity: 1, scaleX: 1 },
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <SearchBar onSearch={onSearch} isLoading={isLoading} error={searchError} />
        <p className="mx-auto mt-5 max-w-xl text-sm font-semibold text-cyan-50/68 drop-shadow-sm">
          Built for nearby Ontario waters, shifting weather, and better first casts.
        </p>
      </motion.div>
    </section>
  )
}

export default memo(HeroSection)
