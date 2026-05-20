import { useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { memo } from 'react'

const EMPTY_LOCATION_MESSAGE = 'Please enter an Ontario city or town.'

function SearchBar({ onSearch, isLoading, error }) {
  const [location, setLocation] = useState('')
  const [validationError, setValidationError] = useState('')
  const displayError = validationError || error

  function handleSubmit(event) {
    event.preventDefault()

    const nextLocation = location.trim()

    if (!nextLocation) {
      setValidationError(EMPTY_LOCATION_MESSAGE)
      return
    }

    setValidationError('')
    onSearch(nextLocation)
  }

  return (
    <motion.div
      className="mx-auto mt-10 w-full max-w-2xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.34, ease: 'easeOut' }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-3 rounded-[2rem] border border-cyan-50/25 bg-slate-950/34 p-2 shadow-2xl shadow-slate-950/30 backdrop-blur-md transition-colors focus-within:border-amber-100/55 focus-within:bg-slate-950/42"
      >
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-400/18 text-cyan-50 ring-1 ring-cyan-50/16 sm:h-14 sm:w-14">
          <MapPin className="h-5 w-5" />
        </div>
        <input
          value={location}
          onChange={(event) => {
            setLocation(event.target.value)
            setValidationError('')
          }}
          aria-describedby={displayError ? 'location-search-error' : undefined}
          aria-invalid={Boolean(displayError)}
          aria-label="Ontario location"
          placeholder="Enter any Ontario city or town"
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-stone-50 outline-none placeholder:text-cyan-50/56 sm:text-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-100 px-5 text-sm font-black text-emerald-950 shadow-lg shadow-cyan-950/25 transition hover:scale-[1.015] hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:px-7"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">{isLoading ? 'Searching' : 'Find water'}</span>
        </button>
      </form>
      {displayError ? (
        <p
          id="location-search-error"
          className="mt-3 rounded-2xl border border-rose-100/20 bg-rose-500/[0.10] px-4 py-3 text-sm font-semibold text-rose-50/90 backdrop-blur-sm"
        >
          {displayError}
        </p>
      ) : null}
    </motion.div>
  )
}

export default memo(SearchBar)
