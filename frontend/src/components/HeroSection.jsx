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
      className="relative flex min-h-screen items-center overflow-hidden bg-midnight px-5 pb-20 pt-28 sm:px-8 sm:pt-32"
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
        className="relative z-10 mx-auto flex w-full max-w-5xl justify-center"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.055 }}
      >
        <div className="w-full max-w-[42rem]">
          <motion.h1
            className="max-w-[40rem] text-balance text-4xl font-extrabold leading-tight tracking-normal text-stone-50 drop-shadow-[0_3px_18px_rgba(2,8,23,0.55)] sm:text-5xl lg:text-[3.35rem]"
            variants={fadeUp}
            transition={{ duration: 0.38, ease: 'easeOut' }}
          >
            Search Ontario fishing conditions
          </motion.h1>
          <motion.p
            className="mt-4 max-w-[37rem] text-base font-medium leading-7 text-stone-50/86 drop-shadow-sm sm:text-lg"
            variants={fadeUp}
            transition={{ duration: 0.34, ease: 'easeOut' }}
          >
            Find nearby lakes and rivers, check today’s weather, and see which species are worth targeting.
          </motion.p>
          <SearchBar onSearch={onSearch} isLoading={isLoading} error={searchError} />
        </div>
      </motion.div>
    </section>
  )
}

export default memo(HeroSection)
