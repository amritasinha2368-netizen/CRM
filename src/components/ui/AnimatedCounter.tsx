import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

function formatIndianNumber(num: number): string {
  if (num === 0) return '0'
  const isNegative = num < 0
  const absNum = Math.abs(num)
  const numStr = Math.floor(absNum).toString()
  let result = ''
  let count = 0

  for (let i = numStr.length - 1; i >= 0; i--) {
    count++
    result = numStr[i] + result
    if (count === 3 && i > 0) {
      result = ',' + result
      count = 0
    } else if (count === 2 && i > 0 && numStr.length > 5) {
      result = ',' + result
      count = 0
    }
  }

  return isNegative ? '-' + result : result
}

export default function AnimatedCounter({
  value,
  duration = 1500,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<number | null>(null)
  const startTime = useRef<number | null>(null)
  const startValue = useRef(0)

  useEffect(() => {
    startTime.current = null
    startValue.current = displayValue

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)

      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue.current + (value - startValue.current) * eased)

      setDisplayValue(current)

      if (progress < 1) {
        ref.current = requestAnimationFrame(animate)
      }
    }

    ref.current = requestAnimationFrame(animate)

    return () => {
      if (ref.current) cancelAnimationFrame(ref.current)
    }
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}{formatIndianNumber(displayValue)}{suffix}
    </span>
  )
}
