import './MainDiv.css'
import { useEffect, useState, useRef, useContext, createContext } from 'react'
import WebGLCanvas from '../web-gl/WebGLCanvas.jsx'
import ElapsedPage from './ElapsedPage.jsx'
import Menu from './Menu.jsx'
import LoadingPage from './LoadingPage.jsx'
import TitlePage from './TitlePage.jsx'
import GameInterface from '../game/GameInterface.js'
import StateStorage from '../storage/StateStorage.js'
import GameState from '../storage/GameState.js'
import PerformanceStats from '../web-gl/PerformanceStats.js'

const EventContext = createContext(null)

export const useEventContext = () => {
    const context = useContext(EventContext)
    if (!context) {
        throw new Error("useEventContext must be used within EventProvider")
    }
    return context
}

export const EventProvider = ({ children }) => {
    const [eventTrigger, setEventTrigger] = useState(0)
    const [eventType, setEventType] = useState("")

    const triggerEvent = (event) => {
        setEventTrigger(prev => prev + 1)
        setEventType(event)
    }

    return (
        <EventContext.Provider value={{ triggerEvent, eventTrigger, eventType }}>
            {children}
        </EventContext.Provider>
    )
}

export default function MainDiv() {
    const [titlePage, setTitlePage] = useState(true)
    const [stateLoaded, setStateLoaded] = useState(false)
    const [gameReady, setGameReady] = useState(false)
    const [showElapsed, setShowElapsed] = useState(false)
    const [gameInterface, setGameInterface] = useState(new GameInterface())
    const [elapsedData, setElapsedData] = useState([0, 0, 0, 0, 0])
    const [isActive, setIsActive] = useState(null)
    const elapsedAppliedRef = useRef(true)

    useEffect(() => {
        loadSavedState()
        return () => {
            document.removeEventListener('focus', handleVisibilityChange)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    const loadSavedState = async () => {
        StateStorage.loadState()
        let gameState = StateStorage.getGameState()
        gameInterface.setState(gameState)
        gameInterface.reset(false)
        handleElapsed()
        setTitlePage(gameState.type === "title")
        setStateLoaded(true)
    }

    const handleVisibilityChange = () => {
        const isCurrentlyActive = document.visibilityState === 'visible'
        if (isCurrentlyActive !== isActive) {
            gameInterface.setTimeWarp(1)
            gameInterface.setMenuOpen(false)
            setIsActive(isCurrentlyActive)

            if (isCurrentlyActive) {
                gameInterface.reset()
                PerformanceStats.reset()
                handleElapsed()
            } else {
                if (elapsedAppliedRef.current) {
                    saveState()
                }
                elapsedAppliedRef.current = true
            }
        }
    }

    const handleElapsed = () => {
        let elapsed = gameInterface.getElapsedData()
        if (elapsed.showElapsed) {
            gameInterface.setTimeWarp(0.03)
            gameInterface.setMenuOpen(true)
        }
        setElapsedData(elapsed)
        setShowElapsed(elapsed.showElapsed)
        elapsedAppliedRef.current = !elapsed.showElapsed
    }

    const closeElapsed = () => {
        gameInterface.setTimeWarpTarget(1)
        gameInterface.setMenuOpen(false)
        gameInterface.addElapsed()
        elapsedAppliedRef.current = true
        setShowElapsed(false)
    }

    const saveState = async () => {
        StateStorage.saveGameState()
    }

    const showTitlePage = async () => {
        saveState()
        StateStorage.selectGame(-1)
        gameInterface.setTimeWarp(1)
        gameInterface.setState(StateStorage.getGameState())
        setTitlePage(true)
    }

    const resetGame = (index) => {
        StateStorage.gameStates.states[index] = new GameState()
    }

    const selectGame = (gameIndex) => {
        let gameState = StateStorage.selectGame(gameIndex)
        gameState.started = true
        gameInterface.setState(gameState)
        handleElapsed()
        setTitlePage(false)
    }

    const setupFinished = async () => {
        gameInterface.reset(false)
        document.addEventListener('focus', handleVisibilityChange)
        document.addEventListener('visibilitychange', handleVisibilityChange)
        setGameReady(true)
    }

    return (
        <div className="all">
            {!gameReady && <LoadingPage />}

            {gameReady && (
                <div>
                    {!showElapsed && !titlePage && (
                        <EventProvider>
                            <Menu
                                gameInterface={gameInterface}
                                showTitlePage={showTitlePage}
                            />
                        </EventProvider>
                    )}

                    {titlePage && (
                        <TitlePage
                            gameInterface={gameInterface}
                            selectGame={selectGame}
                            resetGame={resetGame}
                        />
                    )}

                    {showElapsed && (
                        <ElapsedPage close={closeElapsed} elapsedData={elapsedData} />
                    )}
                </div>
            )}

            {stateLoaded && (
                <WebGLCanvas
                    gameInterface={gameInterface}
                    isActive={isActive}
                    setupFinished={setupFinished}
                />
            )}
        </div>
    )
}
