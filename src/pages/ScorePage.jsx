import "./ScorePage.css"
import { useEffect, useState } from 'react'


export default function ScorePage(props) {

    const [dashboard, setDashboard] = useState(null)

    useEffect(() => {
        let runLoop = true
        const updateLoop = () => {
            if (runLoop) {
                setDashboard(props.gameInterface.getDashboardData())
                setTimeout(updateLoop, 100)
            }
        }
        updateLoop()

        return () => {
            runLoop = false
        }
    }, [props])

    const handleMouseDown = (e) => {
        let x = e.pageX / window.innerHeight
        let y = e.pageY / window.innerHeight
        props.gameInterface.handleMouse(x, y, 'd')
    }

    const handleMouseUp = (e) => {
        let x = e.pageX / window.innerHeight
        let y = e.pageY / window.innerHeight
        props.gameInterface.handleMouse(x, y, 'u')
    }

    const handleMouseMove = (e) => {
        let x = e.pageX / window.innerHeight
        let y = e.pageY / window.innerHeight
        props.gameInterface.handleMouse(x, y, 'm')
    }

    const handleMouseOut = (e) => {
        props.gameInterface.handleMouse(0, 0, 'm')
    }

    const handleTouch = (e) => {
        props.gameInterface.handleTouch(e, window.innerHeight)
    }


    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
            onTouchMove={handleTouch}
            onTouchStart={handleTouch}
            onTouchEnd={handleTouch}>
            {dashboard != null &&
                <div className="dashboard">
                    <div className="dashboard-details">
                        <div >
                            Points
                        </div>
                        <div >
                            Points/sec
                        </div>
                        <div >
                            Max/sec
                        </div>
                    </div>
                    <div >
                        {dashboard.points}
                    </div>
                    <div >
                        {dashboard.pointsSec}
                    </div>
                    <div >
                        {dashboard.maxPointsSec}
                    </div>
                </div>
            }
        </div >
    )
}