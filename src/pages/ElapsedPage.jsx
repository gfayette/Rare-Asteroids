import "./ElapsedPage.css"
import { useEffect, useState } from 'react'
import ScoreKeeper from '../game/ScoreKeeper'
import SelectTitle from "./menu-components/SelectTitle"

export default function ElapsedPage({ elapsedData, close }) {

    const [data, setData] = useState([0, 0, 0, 0, 0, 0])

    useEffect(() => {
        let lastTimestamp = performance.now()
        let runLoop = true
        let elapsed = 0
        let timeout = 1.2

        let progress = 0
        const updateLoop = () => {
            if (runLoop) {
                let newTime = performance.now()
                let dt = (newTime - lastTimestamp) / 1000
                lastTimestamp = newTime
                elapsed += dt
                progress = elapsed / timeout

                if (progress > 1) {
                    progress = 1
                    runLoop = true
                }

                let data = {
                    tDiff: ScoreKeeper.formatNum(elapsedData.tDiff * progress),
                    pps: ScoreKeeper.formatNum(elapsedData.pps * progress),
                    diff: ScoreKeeper.formatNum(elapsedData.diff * progress),
                    oldScore: ScoreKeeper.formatNum(elapsedData.oldScore),
                    newScore: ScoreKeeper.formatNum(elapsedData.oldScore + elapsedData.diff * progress),
                    timeAway: elapsedData.timeAway
                }

                setData(data)
                setTimeout(updateLoop, 120)
            }
        }
        updateLoop()

        return () => {
            runLoop = false
        }
    }, [elapsedData])

    return (
        <div onClick={close} className="elapsed-background" >
            <div onClick={(e) => e.stopPropagation()} className="elapsed-window">

                <div className="elapsed-outer">

                    <div>
                        You got some more points!
                    </div>

                    <div className="elapsed-text">
                        Offline time:
                    </div>
                    <div className="elapsed-time">
                        {data["timeAway"]}
                    </div>



                    <div className="elapsed-container">
                        <div className="elapsed-key">
                            <div className="elapsed-key">
                                Points Added:
                            </div>
                            <div className="elapsed-key">
                                Old Score:
                            </div>
                            <div className="elapsed-key">
                                New Score:
                            </div>
                        </div>

                        <div className="elapsed-value">
                            <div>
                                {data["diff"]}
                            </div>
                            <div>
                                {data["oldScore"]}
                            </div>
                            <div>
                                {data["newScore"]}
                            </div>
                        </div>
                    </div>

                    <SelectTitle
                        text={"Continue"}
                        selectClick={close}
                    />

                </div>
            </div>
        </div>
    )
}
