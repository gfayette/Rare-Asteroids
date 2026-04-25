import StateStorage from "../storage/StateStorage"
import "./TitlePage.css"
import { useState } from 'react'


export default function TitlePage(props) {
    const [update, setUpdate] = useState(false)

    const resetGame = (gameIndex) => {
        props.resetGame(gameIndex)
        setUpdate(prev => !prev)
    }

    const selectGame = (gameIndex) => {
        props.selectGame(gameIndex)
    }

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
        <div className="title-container"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
            onTouchMove={handleTouch}
            onTouchStart={handleTouch}
            onTouchEnd={handleTouch}>
            {StateStorage.gameStates.states.map((gameState, index) => (
                <div key={index}>
                    <div className="title-row">
                        <div className="title-game">
                            Game {index + 1}:
                        </div>

                        <button className="title-button" onClick={() => selectGame(index)}>
                            {gameState.started ? "Select" : "Start"}
                        </button>
                        <button className="title-button" onClick={() => resetGame(index)}>
                            Reset
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}