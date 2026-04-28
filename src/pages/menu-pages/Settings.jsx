import "./Settings.css"
import { useEffect, useState } from 'react'
import PerformanceStats from '../../web-gl/PerformanceStats'
import SelectTitle from "../menu-components/SelectTitle"

class Stats {
    fps = 0
    maxTick = 0
    maxGpuTick = 0
    maxDelay = 0
    maxTimeBetweenDraws = 0
    totalGameObjects = 0
    gc = 0
    hLimit = 0
    hSize = 0
    hUsed = 0
}

export default function Settings(props) {

    let settings = props.gameInterface.getSettings()

    const [fieldOfView, setFieldOfView] = useState(settings[0])
    const [timeWarp, setTimeWarp] = useState(settings[1])
    const [difficulty, setDifficulty] = useState(settings[2])
    const [pace, setPace] = useState(settings[3])
    const [autoUpgrade, setAutoUpgrade] = useState(settings[4])
    const [autoUnlock, setAutoUnlock] = useState(settings[5])
    const [stats, setStats] = useState(new Stats())

    const [showWarning, setShowWarning] = useState(props.slow)

    useEffect(() => {
        let runLoop = true

        const updateLoop = () => {
            if (runLoop) {
                let model = new Stats()
                model.fps = PerformanceStats.renderFps
                model.maxTick = PerformanceStats.maxCombined
                model.maxGpuTick = PerformanceStats.maxGpuTick
                model.maxDelay = PerformanceStats.maxRenderGap
                model.maxTimeBetweenDraws = PerformanceStats.maxTimeBetweenDraws
                model.totalGameObjects = PerformanceStats.totalObjects
                model.gc = PerformanceStats.removedPerSec
                model.hLimit = PerformanceStats.heapLimit
                model.hSize = PerformanceStats.heapSize
                model.hUsed = PerformanceStats.heapUsed
                setStats(model)
                setTimeout(updateLoop, 500)
            }
        }

        updateLoop()

        return () => {
            runLoop = false
        }
    }, [])

    const handleFieldOfViewChange = (event) => {
        const value = parseFloat(event.target.value)
        setFieldOfView(value)
        props.gameInterface.setZoom(value)
    }

    const handleTimeWarpChange = (event) => {
        const value = parseFloat(event.target.value)
        setTimeWarp(value)
        props.gameInterface.setBaseTimeWarp(value)
    }

    const handleDifficultyChange = (event) => {
        const value = parseFloat(event.target.value)
        setDifficulty(value)
        props.gameInterface.setDifficulty(value)
    }

    const handlePaceChange = (event) => {
        const value = parseFloat(event.target.value)
        setPace(value)
        props.gameInterface.setPace(value)
    }

    const handleAutoUpgradeChange = (event) => {
        const value = event.target.checked
        setAutoUpgrade(value)
        props.gameInterface.setAutoUpgrade(value)
    }

    const handleAutoUnlockChange = (event) => {
        const value = event.target.checked
        setAutoUnlock(value)
        props.gameInterface.setAutoUnlock(value)
    }

    const dismissClicked = (e) => {
        props.dismissSlow()
        setShowWarning(false)
    }

    return (
        <div>
            Settings
            <div className="settings-panel">
                {showWarning &&
                    <div className="performance-container">
                        <svg className="performance-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
                            <g id="SVGRepo_bgCarrier" strokeWidth="10"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    stroke="#FF0000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15.12 4.623a1 1 0 011.76 0l11.32 20.9A1 1 0 0127.321 27H4.679a1 1 0 01-.88-1.476l11.322-20.9zM16 18v-6"
                                />
                                <path
                                    fill="#FF0000"
                                    d="M17.5 22.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                                />
                            </g>
                        </svg>
                        <div className="performance-text">
                            Ope! It looks like this game isn't running well on your device!
                            I'd recommend a different device as it's meant to be played at 60 fps.
                        </div>
                        <div className="performance-button">
                            <SelectTitle
                                text={"Hide Warning"}
                                selectClick={dismissClicked}
                            />
                        </div>
                    </div>}
                <div className="settings-title"></div>
                <div className="settings-container">
                    <div>
                        Zoom {(fieldOfView / 1.6).toFixed(2)}x
                    </div>
                    <input
                        type="range"
                        className="settings-range"
                        min="1.2"
                        max="2.4"
                        step="0.01"
                        value={fieldOfView}
                        onChange={handleFieldOfViewChange}
                    />
                </div>
                <div className="settings-container">
                    <div>
                        Speed {timeWarp.toFixed(2)}x
                    </div>
                    <input
                        type="range"
                        className="settings-range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={timeWarp}
                        onChange={handleTimeWarpChange}
                    />
                </div>
                <div className="settings-container">
                    <div>
                        Difficulty {(difficulty).toFixed(2)}x
                    </div>
                    <input
                        type="range"
                        className="settings-range"
                        min="1"
                        max="4"
                        step="0.01"
                        value={difficulty}
                        onChange={handleDifficultyChange}
                    />
                </div>
                <div className="settings-container">
                    <div>
                        Pace {pace.toFixed(2)}x
                    </div>
                    <input
                        type="range"
                        className="settings-range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={pace}
                        onChange={handlePaceChange}
                    />
                </div>
                <div className="settings-container" >
                    <div>
                        Auto upgrade
                    </div>
                    <input
                        className="settings-check"
                        type="checkbox"
                        checked={autoUpgrade}
                        onChange={handleAutoUpgradeChange}
                    />
                </div>
                <div className="settings-container">
                    <div>
                        Auto unlock
                    </div>
                    <input
                        className="settings-check"
                        type="checkbox"
                        checked={autoUnlock}
                        onChange={handleAutoUnlockChange}
                    />
                </div>
                <div className="settings-title">Performance Stats</div>
                <div className="settings-stats-container">
                    {PerformanceStats.heapUsed != null ? (
                        <div className="settings-stats-name">
                            <div >- FPS</div>
                            <div >- Max CPU tick</div>
                            <div >- Max GPU tick</div>
                            <div >- Max interval</div>
                            <div >- Game objects</div>
                            <div >- GC/sec</div>
                            <div >- Heap Limit</div>
                            <div >- Heap Size</div>
                            <div >- Heap Used</div>
                        </div>
                    ) : (
                        <div className="settings-stats-name">
                            <div >- FPS</div>
                            <div >- Max CPU tick</div>
                            <div >- Max GPU tick</div>
                            <div >- Max interval</div>
                            <div >- Game objects</div>
                            <div >- GC/sec</div>
                        </div>
                    )}

                    {PerformanceStats.heapUsed != null ? (
                        <div className="settings-stats-value">
                            <div >{stats.fps} -</div>
                            <div >{stats.maxTick} ms -</div>
                            {PerformanceStats.maxGpuTick != null ? (
                                <div >{stats.maxGpuTick} ms -</div>
                            ) : (
                                <div >Not Supported -</div>
                            )}
                            <div >{stats.maxTimeBetweenDraws} ms -</div>
                            <div >{stats.totalGameObjects} -</div>
                            <div >{stats.gc} -</div>
                            <div >{stats.hLimit} -</div>
                            <div >{stats.hSize} -</div>
                            <div >{stats.hUsed} -</div>
                        </div>
                    ) : (
                        <div className="settings-stats-value">
                            <div >{stats.fps} -</div>
                            <div >{stats.maxTick} ms -</div>
                            {PerformanceStats.maxGpuTick != null ? (
                                <div >{stats.maxGpuTick} ms -</div>
                            ) : (
                                <div >Not Supported -</div>
                            )}
                            <div >{stats.maxTimeBetweenDraws} ms -</div>
                            <div >{stats.totalGameObjects} -</div>
                            <div >{stats.gc} -</div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )

}