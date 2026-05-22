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
      className="mt-7 w-full max-w-[42rem]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.34, ease: 'easeOut' }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 rounded-lg border border-cyan-50/22 bg-slate-950/64 p-3 transition-colors focus-within:border-amber-100/55 sm:flex-row sm:items-center"
      >
        <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-md bg-emerald-400/14 text-cyan-50 ring-1 ring-cyan-50/14 sm:grid">
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
          className="min-h-11 min-w-0 flex-1 rounded-md bg-slate-950/32 px-3 text-base font-semibold text-stone-50 outline-none placeholder:text-cyan-50/52 sm:bg-transparent sm:px-0"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber-100 px-5 text-sm font-extrabold text-emerald-950 transition hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100 disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:px-6"
        >
          <Search className="h-4 w-4" />
          <span>{isLoading ? 'Searching' : 'Check conditions'}</span>
        </button>
      </form>
      <p className="mt-3 text-sm font-medium text-cyan-50/72 drop-shadow-sm">
        Try: Guelph, Barrie, Muskoka, Kingston
      </p>
      {displayError ? (
        <p
          id="location-search-error"
          className="mt-3 rounded-md border border-rose-100/20 bg-rose-500/[0.10] px-4 py-3 text-sm font-semibold text-rose-50/90"
        >
          {displayError}
        </p>
      ) : null}
    </motion.div>
  )
}

export default memo(SearchBar)
