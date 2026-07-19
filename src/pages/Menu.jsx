import "./Menu.css"
import { useEffect, useState, useRef } from 'react'
import MainMenu from './menu-pages/MainMenu.jsx'
import AsteroidUpgrade from './menu-pages/AsteroidUpgrade.jsx'
import ShipUpgrade from './menu-pages/ShipUpgrade.jsx'
import WeaponsUpgrade from "./menu-pages/WeaponsUpgrade.jsx"
import Settings from "./menu-pages/Settings.jsx"
import ScorePage from "./ScorePage.jsx"
import ChargedUpgrade from "./menu-pages/ChargedUpgrade.jsx"
import About from "./menu-pages/About.jsx"
import MenuButton from "./menu-components/MenuButton.jsx"
import PerformanceStats from "../web-gl/PerformanceStats.js"
import SlowIndicator from "./SlowIndicator.jsx"
import { useEventContext } from "./MainDiv.jsx"

export default function Menu(props) {

    const scrollRef = useRef(null)
    const currentMenuRef = useRef('none')
    const [menuOpen, setMenuOpen] = useState(false)
    const [currentMenu, setCurrentMenu] = useState('none')
    const [slow, setSlow] = useState(false)
    const timerId = useRef(null)
    const { eventTrigger, eventType } = useEventContext()

    const [asteroidUpgrade, setAsteroidUpgrade] = useState(false)
    const [shipUpgrade, setShipUpgrade] = useState(false)
    const [gunUpgrade, setGunUpgrade] = useState(false)
    const [chargedUpgrade, setChargedUpgrade] = useState(false)

    const [asteroidIcon, setAsteroidIcon] = useState(props.gameInterface.getAsteroidImageUrl())
    const [shipIcon, setShipIcon] = useState(props.gameInterface.getShipImageUrl())
    const [projectileIcon, setProjectileIcon] = useState(props.gameInterface.getProjectileImageUrl())
    const [chargedIcon, setChargedIcon] = useState(props.gameInterface.getChargedImageUrl())

    const checkUpgradeAvailable = () => {
        setAsteroidUpgrade(props.gameInterface.getAsteroidUpgrade())
        setShipUpgrade(props.gameInterface.getShipUpgrade())
        setGunUpgrade(props.gameInterface.getProjectileUpgrade())
        setChargedUpgrade(props.gameInterface.getChargedUpgrade())
    }

    const setUrls = () => {
        setAsteroidIcon(props.gameInterface.getAsteroidImageUrl())
        setShipIcon(props.gameInterface.getShipImageUrl())
        setProjectileIcon(props.gameInterface.getProjectileImageUrl())
        setChargedIcon(props.gameInterface.getChargedImageUrl())
    }

    useEffect(() => {
        checkUpgradeAvailable()
    }, [eventTrigger, eventType])

    useEffect(() => {
        let runLoop = true
        const updateLoop = () => {
            if (runLoop) {
                checkUpgradeAvailable()
                setUrls()
                props.gameInterface.checkEndGame()
                setTimeout(updateLoop, 2000)
            }
        }
        setTimeout(updateLoop, 2000)
        setUrls()

        const clearScrollPositions = () => {
            const menuList = ["main", "asteroids", "ships", "guns", "charged", "settings", "about"]
            menuList.forEach((menu) => {
                localStorage.setItem(`${menu}-scroll`, 0)
            })
        }

        const handleResize = () => {
            clearScrollPositions()
        }

        window.addEventListener('resize', handleResize)
        props.gameInterface.setMenuOpen(false)

        const scrollElement = scrollRef.current
        if (scrollElement) {
            scrollElement.addEventListener('scroll', saveScrollPosition)
        }

        timerId.current = setInterval(() => {
            setSlow(PerformanceStats.slow)
        }, 500)

        return () => {
            runLoop = false
            clearInterval(timerId.current)
            window.removeEventListener('resize', handleResize)
            clearScrollPositions()
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', saveScrollPosition)
            }
        }
    }, [])

    useEffect(() => {
        currentMenuRef.current = currentMenu
    }, [currentMenu])

    useEffect(() => {
        if (menuOpen && currentMenu !== "none") {
            const scrollElement = scrollRef.current
            const savedScrollPosition = localStorage.getItem(currentMenu + "-scroll")
            if (scrollElement && savedScrollPosition) {
                const scrollPosition = parseInt(savedScrollPosition, 10)
                scrollElement.scrollTop = scrollPosition
                setTimeout((scrollPosition) => {
                    scrollElement.scrollTop = scrollPosition
                }, 0, scrollPosition)
                setTimeout((scrollPosition) => {
                    scrollElement.scrollTop = scrollPosition
                }, 5, scrollPosition)
                setTimeout((scrollPosition) => {
                    scrollElement.scrollTop = scrollPosition
                }, 20, scrollPosition)
                setTimeout((scrollPosition) => {
                    scrollElement.scrollTop = scrollPosition
                }, 70, scrollPosition)
            }
        }
    }, [currentMenu, menuOpen])

    const saveScrollPosition = () => {
        const scrollElement = scrollRef.current
        if (scrollElement) {
            localStorage.setItem(currentMenuRef.current + "-scroll", scrollElement.scrollTop)
        }
    }

    const handleMenuClick = (menu) => {
        saveScrollPosition()
        if (currentMenu === menu || menu === 'none') {
            closeMenu()
        } else {
            props.gameInterface.setTimeWarpTarget(0.03)
            setCurrentMenu(menu)
            setMenuOpen(true)
            props.gameInterface.setMenuOpen(true)
        }
    }

    const closeMenu = () => {
        props.gameInterface.setTimeWarpTarget(1)
        setCurrentMenu('none')
        setMenuOpen(false)
        props.gameInterface.setMenuOpen(false)
    }

    const dismissSlow = () => {
        clearInterval(timerId.current)
        setSlow(false)
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
        <div>
            {slow && !menuOpen && <SlowIndicator onClick={handleMenuClick} />}
            {!menuOpen && <ScorePage
                gameInterface={props.gameInterface} />}
            <div className={menuOpen ? "menu-window-background" : "menu-closed"} onClick={() => handleMenuClick('none')} >
                <div className="menu-window" onClick={(e) => e.stopPropagation()}>
                    <div className="menu-window-header">
                        <div className="menu-header-spacer" />
                        <div />
                        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => handleMenuClick('none')}></button>
                    </div>
                    <div
                        className="menu-scroll"
                        ref={scrollRef}
                    >
                        {currentMenu === 'main' && <MainMenu showTitlePage={props.showTitlePage} handleMenuClick={handleMenuClick} />}
                        {currentMenu === 'asteroids' && <AsteroidUpgrade gameInterface={props.gameInterface} closeMenu={closeMenu} />}
                        {currentMenu === 'ships' && <ShipUpgrade gameInterface={props.gameInterface} closeMenu={closeMenu} />}
                        {currentMenu === 'guns' && <WeaponsUpgrade gameInterface={props.gameInterface} />}
                        {currentMenu === 'charged' && <ChargedUpgrade gameInterface={props.gameInterface} />}
                        {currentMenu === 'settings' && <Settings gameInterface={props.gameInterface} dismissSlow={dismissSlow} slow={slow} />}
                        {currentMenu === 'about' && <About gameInterface={props.gameInterface} />}
                    </div>
                </div>
            </div >
            <div className="menu-panel-outer"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseOut={handleMouseOut}
                onTouchMove={handleTouch}
                onTouchStart={handleTouch}
                onTouchEnd={handleTouch}>
                <div
                    className="menu-panel"
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseOut={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                >
                    <MenuButton
                        onClick={handleMenuClick}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                        </svg>}
                        currentMenu={currentMenu}
                        menuName="main" />
                    <MenuButton
                        onClick={handleMenuClick}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
                        </svg>}
                        currentMenu={currentMenu}
                        menuName="about" />
                    <MenuButton
                        onClick={handleMenuClick}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z" />
                        </svg>}
                        currentMenu={currentMenu}
                        menuName="settings" />
                    <MenuButton onClick={handleMenuClick} icon={asteroidIcon} currentMenu={currentMenu} menuName="asteroids" upgrade={asteroidUpgrade} />
                    <MenuButton onClick={handleMenuClick} icon={shipIcon} currentMenu={currentMenu} menuName="ships" upgrade={shipUpgrade} />
                    <MenuButton onClick={handleMenuClick} icon={projectileIcon} currentMenu={currentMenu} menuName="guns" upgrade={gunUpgrade} />
                    <MenuButton onClick={handleMenuClick} icon={chargedIcon} currentMenu={currentMenu} menuName="charged" upgrade={chargedUpgrade} />
                </div>
            </div>
        </div>
    )
}