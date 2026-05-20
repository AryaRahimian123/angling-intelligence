import { memo } from 'react'

const bubbles = [
  { layer: 'back', left: '8%', size: 10, duration: 40, delay: -20, drift: -14, opacity: 0.24 },
  { layer: 'back', left: '16%', size: 7, duration: 36, delay: -12, drift: 10, opacity: 0.2 },
  { layer: 'back', left: '24%', size: 15, duration: 44, delay: -28, drift: -18, opacity: 0.22 },
  { layer: 'back', left: '44%', size: 9, duration: 42, delay: -32, drift: -10, opacity: 0.24 },
  { layer: 'back', left: '68%', size: 16, duration: 46, delay: -41, drift: 22, opacity: 0.22 },
  { layer: 'back', left: '88%', size: 12, duration: 45, delay: -34, drift: -24, opacity: 0.22 },
  { layer: 'mid', left: '6%', size: 26, duration: 28, delay: -2, drift: 26, opacity: 0.36 },
  { layer: 'mid', left: '21%', size: 20, duration: 25, delay: -9, drift: 18, opacity: 0.38 },
  { layer: 'mid', left: '38%', size: 30, duration: 31, delay: -14, drift: 22, opacity: 0.34 },
  { layer: 'mid', left: '53%', size: 18, duration: 27, delay: -17, drift: -18, opacity: 0.3 },
  { layer: 'mid', left: '71%', size: 22, duration: 29, delay: -24, drift: 16, opacity: 0.34 },
  { layer: 'mid', left: '63%', size: 26, duration: 27, delay: -3, drift: -30, opacity: 0.38 },
  { layer: 'mid', left: '82%', size: 34, duration: 34, delay: -21, drift: -28, opacity: 0.32 },
  { layer: 'front', left: '7%', size: 72, duration: 36, delay: -18, drift: 62, opacity: 0.24 },
  { layer: 'front', left: '36%', size: 58, duration: 30, delay: -13, drift: -54, opacity: 0.3 },
  { layer: 'front', left: '58%', size: 92, duration: 42, delay: -34, drift: 70, opacity: 0.2 },
  { layer: 'front', left: '79%', size: 68, duration: 35, delay: -20, drift: -64, opacity: 0.26 },
]

const fish = [
  { layer: 'back', top: '17%', size: 66, duration: 48, delay: -16, direction: 'right', opacity: 0.26 },
  { layer: 'mid', top: '31%', size: 98, duration: 34, delay: -9, direction: 'right', opacity: 0.36 },
  { layer: 'mid', top: '54%', size: 82, duration: 32, delay: -22, direction: 'left', opacity: 0.34 },
  { layer: 'front', top: '68%', size: 158, duration: 41, delay: -30, direction: 'right', opacity: 0.32 },
  { layer: 'front', top: '27%', size: 126, duration: 36, delay: -5, direction: 'left', opacity: 0.36 },
]

const schools = [
  { top: '21%', size: 34, count: 5, duration: 34, delay: -8, direction: 'right', opacity: 0.34 },
  { top: '42%', size: 30, count: 6, duration: 31, delay: -18, direction: 'left', opacity: 0.3 },
  { top: '62%', size: 40, count: 5, duration: 37, delay: -25, direction: 'right', opacity: 0.28 },
  { top: '73%', size: 28, count: 4, duration: 39, delay: -14, direction: 'left', opacity: 0.24 },
]

const weeds = [
  { left: '2%', height: 42, width: 20, delay: -3, duration: 10, opacity: 0.56 },
  { left: '10%', height: 31, width: 15, delay: -6, duration: 9, opacity: 0.42 },
  { left: '16%', height: 56, width: 24, delay: -11, duration: 13, opacity: 0.48 },
  { left: '25%', height: 37, width: 17, delay: -8, duration: 10, opacity: 0.4 },
  { left: '73%', height: 40, width: 19, delay: -7, duration: 10, opacity: 0.5 },
  { left: '86%', height: 60, width: 26, delay: -6, duration: 14, opacity: 0.5 },
  { left: '96%', height: 34, width: 15, delay: -2, duration: 9, opacity: 0.44 },
]

function BubbleBackground() {
  return (
    <div className="bubble-field" aria-hidden="true">
      <span className="underwater-light underwater-light-a" />
      <span className="underwater-light underwater-light-b" />
      <span className="underwater-light underwater-light-c" />
      <div className="fish-layer">
        {schools.map((school, index) => (
          <span
            className={`fish-school fish-${school.direction}`}
            key={`${school.top}-${school.count}-${index}`}
            style={{
              '--school-top': school.top,
              '--school-size': `${school.size}px`,
              '--school-duration': `${school.duration}s`,
              '--school-delay': `${school.delay}s`,
              '--school-opacity': school.opacity,
            }}
          >
            {Array.from({ length: school.count }).map((_, fishIndex) => (
              <span
                className="school-fish"
                key={fishIndex}
                style={{
                  '--school-x': `${fishIndex * 34}px`,
                  '--school-y': `${(fishIndex % 3) * 12}px`,
                  '--school-scale': 0.78 + (fishIndex % 4) * 0.08,
                }}
              />
            ))}
          </span>
        ))}
        {fish.map((item, index) => (
          <span
            className={`fish-silhouette fish-${item.layer} fish-${item.direction}`}
            key={`${item.top}-${item.size}-${index}`}
            style={{
              '--fish-top': item.top,
              '--fish-size': `${item.size}px`,
              '--fish-duration': `${item.duration}s`,
              '--fish-delay': `${item.delay}s`,
              '--fish-opacity': item.opacity,
            }}
          >
            <span />
          </span>
        ))}
      </div>
      {bubbles.map((bubble, index) => (
        <span
          className={`bubble bubble-${bubble.layer}`}
          key={`${bubble.left}-${bubble.size}-${index}`}
          style={{
            '--bubble-left': bubble.left,
            '--bubble-size': `${bubble.size}px`,
            '--bubble-duration': `${bubble.duration}s`,
            '--bubble-delay': `${bubble.delay}s`,
            '--bubble-drift': `${bubble.drift}px`,
            '--bubble-drift-soft': `${bubble.drift * -0.28}px`,
            '--bubble-drift-end': `${bubble.drift * -0.62}px`,
            '--bubble-opacity': bubble.opacity,
          }}
        />
      ))}
      <div className="weed-bed">
        {weeds.map((weed, index) => (
          <span
            className="underwater-weed"
            key={`${weed.left}-${weed.height}-${index}`}
            style={{
              '--weed-left': weed.left,
              '--weed-height': `${weed.height}vh`,
              '--weed-width': `${weed.width}px`,
              '--weed-duration': `${weed.duration}s`,
              '--weed-delay': `${weed.delay}s`,
              '--weed-opacity': weed.opacity,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(BubbleBackground)
