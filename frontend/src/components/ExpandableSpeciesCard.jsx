import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, CloudSun, Leaf, Thermometer, Timer, X } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { fallbackFishImage, fallbackFishImageBackup, fishImages } from '../data/fishImages'

function ratingLabel(score) {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Tough'
}

function conditionSummary(score) {
  const label = ratingLabel(score)

  if (label === 'Excellent') return 'Excellent conditions today'
  if (label === 'Good') return 'Good conditions today'
  if (label === 'Fair') return 'Fair bite conditions'
  return 'Tougher bite conditions'
}

function meterColor(score) {
  if (score >= 85) return '#87935b'
  if (score >= 70) return '#aa9b6e'
  if (score >= 50) return '#967f52'
  return '#6f634c'
}

function ExpandableSpeciesCard({
  fish,
  weather,
  expanded,
  dimmed,
  onToggle,
  onClose,
}) {
  const reduceMotion = useReducedMotion()
  const [imageSrc, setImageSrc] = useState(fishImages[fish.species] || fallbackFishImage)
  const methods = Array.isArray(fish.methods) ? fish.methods : []
  const reasons = Array.isArray(fish.reasons) ? fish.reasons : []
  const difficulty = fish.difficulty || 'Medium'
  const explanation = fish.shortExplanation || `${fish.species} have ${difficulty.toLowerCase()} difficulty today.`
  const score = Math.max(0, Math.min(100, fish.score || 0))
  const rating = ratingLabel(score)

  useEffect(() => {
    setImageSrc(fishImages[fish.species] || fallbackFishImage)
  }, [fish.species])

  useEffect(() => {
    if (!expanded) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expanded, onClose])

  return (
    <motion.article
      layout
      className={`relative overflow-hidden rounded-md border shadow-[0_14px_28px_rgba(2,10,6,0.28)] transition-[background-color,box-shadow,opacity,transform] duration-200 ${
        expanded
          ? 'z-10 border-black bg-[#263322]'
          : 'border-black/80 bg-[#263322] hover:bg-[#2d3a27] hover:shadow-[0_16px_34px_rgba(2,10,6,0.34)]'
      } ${dimmed ? 'opacity-45' : 'opacity-100'}`}
      transition={{ layout: { duration: reduceMotion ? 0.01 : 0.3, ease: 'easeOut' } }}
    >
      <span className="absolute inset-y-4 left-0 z-[1] w-0.5 rounded-full bg-[#b8aa7a]/55 transition-colors group-hover:bg-[#c8ba8a]/75" />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="group block w-full text-left"
      >
        <div className={`relative overflow-hidden bg-[#263322] ${expanded ? 'aspect-[16/5] sm:aspect-[21/5]' : 'aspect-[16/8]'}`}>
          <motion.img
            layout
            src={imageSrc}
            alt={fish.species}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 m-auto h-[42%] w-[58%] object-contain object-center mix-blend-multiply opacity-88 drop-shadow-[0_8px_12px_rgba(0,0,0,0.22)] ${
              expanded ? 'sm:h-[50%] sm:w-[48%]' : ''
            }`}
            animate={reduceMotion ? { opacity: 0.88 } : { opacity: 0.88, scale: expanded ? 1.005 : 1 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: 'easeOut' }}
            onError={() => {
              if (imageSrc !== fallbackFishImage) {
                setImageSrc(fallbackFishImage)
                return
              }

              if (fallbackFishImage !== fallbackFishImageBackup && imageSrc !== fallbackFishImageBackup) {
                setImageSrc(fallbackFishImageBackup)
              }
            }}
          />
        </div>

        <div className="px-4 py-3.5 sm:px-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-extrabold leading-tight text-[#f4efe4] sm:text-2xl">{fish.species}</h3>
              <p className="mt-1.5 text-sm font-semibold leading-5 text-[#c8c0aa]/80">
                {conditionSummary(score)}
              </p>
            </div>
            <div className="flex shrink-0 items-start gap-3">
              <div className="text-right">
                <p className="text-3xl font-extrabold leading-none text-[#f4efe4]">{score}</p>
                <p className="mt-1 text-xs font-bold text-[#c8c0aa]/70">{rating}</p>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/35 bg-[#1f2b1d] text-[#ddd4bd]/80">
                {expanded ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-[#ddd4bd]/82">
            <span>{rating} rating</span>
            <span className="text-[#9f967b]">•</span>
            <span>{difficulty} difficulty</span>
          </div>

          <div className="mt-2.5">
            <div className="h-0.5 overflow-hidden rounded-full bg-[#1f2b1d]">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{ width: `${score}%`, backgroundColor: meterColor(score) }}
              />
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.22, ease: 'easeOut' }}
            className="border-t border-[#6f7258]/16 px-4 pb-4 pt-4 sm:px-5"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
              <section>
                <p className="text-sm font-extrabold text-[#f4efe4]">
                  Why this species is active
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Condition icon={Thermometer} text={`${weather?.tempC ?? '--'}C`} />
                  <Condition icon={CloudSun} text={weather?.condition || 'Current weather'} />
                  <Condition icon={Timer} text="Active bite window" />
                  <Condition icon={Leaf} text={weather?.season || 'Current season'} />
                </div>
                {reasons.length > 0 ? (
                  <div className="mt-3 grid gap-2">
                    {reasons.map((reason, index) => {
                      const reasonText = typeof reason === 'string' ? reason : reason.text
                      const sentiment = typeof reason === 'object' ? reason?.sentiment : 'neutral'
                      const dotColor = {
                        positive: 'bg-[#8f9f5f]',
                        negative: 'bg-[#a06a5a]',
                        neutral: 'bg-[#9f967b]',
                      }[sentiment] || 'bg-[#9f967b]'

                      return (
                        <p key={`${reasonText}-${index}`} className="flex gap-2 text-sm leading-6 text-[#ddd4bd]/76">
                          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
                          {reasonText}
                        </p>
                      )
                    })}
                  </div>
                ) : null}
              </section>

              <section>
                <p className="text-sm font-extrabold text-[#f4efe4]">
                  Recommended tackle
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {methods.length > 0 ? methods.map((method) => (
                    <span
                      key={method}
                      className="rounded-md border border-[#6f7258]/28 bg-[#1f2b1d] px-3 py-1.5 text-sm font-bold text-[#ddd4bd]/84"
                    >
                      {method}
                    </span>
                  )) : (
                    <span className="rounded-md border border-[#6f7258]/28 bg-[#1f2b1d] px-3 py-1.5 text-sm font-bold text-[#c8c0aa]/72">
                      Match speed to structure
                    </span>
                  )}
                </div>
                <div className="mt-4 rounded-md border border-[#6f7258]/24 bg-[#1f2b1d] p-3.5">
                  <p className="text-sm font-extrabold text-[#f4efe4]">
                    Fishing note
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#ddd4bd]/78">{explanation}</p>
                </div>
              </section>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  )
}

function Condition({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-[#6f7258]/24 bg-[#1f2b1d] px-3 py-1.5 text-sm font-semibold text-[#ddd4bd]/76">
      <Icon className="h-4 w-4 text-[#b8aa7a]/82" />
      <span className="min-w-0 truncate">{text}</span>
    </div>
  )
}

export default memo(ExpandableSpeciesCard)
