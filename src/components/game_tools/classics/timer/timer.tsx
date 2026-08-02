import { useEffect, useRef, useState } from "react"
import { FadeInTransition } from "../../../transition/transitions"
import styles from "./timer.module.css"

const timerPreset = [5, 10, 15, 30, 60]
const circleRadius = 42
const circleCircumference = 2 * Math.PI * circleRadius

function formatTime(totalSeconds: number) {
    const safeSeconds = Math.max(0, totalSeconds)
    const minutes = Math.floor(safeSeconds / 60)
    const seconds = safeSeconds % 60

    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function Timer() {
    const [duration, setDuration] = useState(60)
    const [inputValue, setInputValue] = useState("60")
    const [remainingTime, setRemainingTime] = useState(60)
    const [isRunning, setIsRunning] = useState(false)
    const intervalRef = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current)
            }
        }
    }, [])

    const clearTimerInterval = () => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const handleDurationChange = (value: string) => {
        setInputValue(value)

        if (value === "") {
            setDuration(0)
            if (!isRunning) {
                setRemainingTime(0)
            }
            return
        }

        const parsedValue = Number(value)

        if (Number.isNaN(parsedValue)) {
            return
        }

        const nextDuration = Math.max(0, Math.floor(parsedValue))
        setDuration(nextDuration)

        if (!isRunning) {
            setRemainingTime(nextDuration)
        }
    }

    const handlePresetSelection = (preset: number) => {
        clearTimerInterval()
        setIsRunning(false)
        setInputValue(String(preset))
        setDuration(preset)
        setRemainingTime(preset)
    }

    const handleStart = () => {
        if (isRunning) {
            clearTimerInterval()
            setIsRunning(false)
            return
        }

        if (duration <= 0) {
            return
        }
        setIsRunning(true)
        intervalRef.current = window.setInterval(() => {
            setRemainingTime((currentTime) => {
                if (currentTime <= 1) {
                    clearTimerInterval()
                    setIsRunning(false)
                    return 0
                }
                return currentTime - 1
            })
        }, 1000)
        setRemainingTime(duration)
    }

    const handleReset = () => {
        clearTimerInterval()
        setIsRunning(false)
        setRemainingTime(duration)
    }

    const progressRatio = duration > 0 ? Math.min(1, Math.max(0, remainingTime / duration)) : 0
    const strokeDashoffset = circleCircumference * (1 - progressRatio)

    return (
        <FadeInTransition>
            <div className={styles.timer}>

                <section className={styles.timeSetter}>
                    <h1>Timer duration</h1>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        value={inputValue}
                        onChange={(event) => handleDurationChange(event.target.value)}
                    />
                    <h1>Presets</h1>
                    <div className={styles.timePresets}>
                        {timerPreset.map((preset) => (
                            <button key={preset} onClick={() => handlePresetSelection(preset)}>
                                {preset}s
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.chrono}>
                    <div className={styles.timerVisual}>
                        <svg className={styles.progress} viewBox="0 0 100 100" aria-hidden="true">
                            <circle
                                className={styles.progressTrack}
                                cx="50"
                                cy="50"
                                r={circleRadius}
                            />
                            <circle
                                className={styles.progressBar}
                                cx="50"
                                cy="50"
                                r={circleRadius}
                                style={{ strokeDasharray: circleCircumference, strokeDashoffset: strokeDashoffset }}
                            />
                        </svg>

                        <span>{formatTime(remainingTime)}</span>
                    </div>

                    <button className={styles.action} onClick={handleStart} disabled={!isRunning && duration <= 0}>
                        {isRunning ? "Stop" : "Start"}
                    </button>

                    <button className={styles.action} onClick={handleReset} disabled={isRunning}>
                        Reset
                    </button>
                </section>

            </div>
        </FadeInTransition>
    )
}