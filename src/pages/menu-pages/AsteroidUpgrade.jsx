import "./AsteroidUpgrade.css"
import { useEffect, useState } from 'react'
import Upgrade from '../menu-components/Upgrade.jsx'
import Unlock from "../menu-components/Unlock.jsx"
import Select from "../menu-components/Select.jsx"
import { useEventContext } from "../MainDiv.jsx"

export default function AsteroidUpgrade(props) {

    const [asteroids, setAsteroids] = useState([])
    const { triggerEvent } = useEventContext()

    useEffect(() => {
        let runLoop = true
        const updateLoop = () => {
            if (runLoop) {
                setAsteroids(props.gameInterface.getAsteroidData())
                setTimeout(updateLoop, 500)
            }
        }
        updateLoop()

        return () => {
            runLoop = false
        }
    }, [props])

    const handleUnlock = (index) => {
        props.gameInterface.unlockAsteroid(index)
        triggerEvent("asteroids")
        setAsteroids(props.gameInterface.getAsteroidData())
    }

    const handleNumberUpgrade = (index) => {
        triggerEvent("asteroids")
        props.gameInterface.upgradeAsteroidNumber(index)
        setAsteroids(props.gameInterface.getAsteroidData())
    }

    const handlePointsUpgrade = (index) => {
        triggerEvent("asteroids")
        props.gameInterface.upgradeAsteroidPoints(index)
        setAsteroids(props.gameInterface.getAsteroidData())
    }

    const handleSetNumber = (index, level) => {
        props.gameInterface.setAsteroidNumber(index, level)
        setAsteroids(props.gameInterface.getAsteroidData())
    }

    const handleSetPoints = (index, level) => {
        props.gameInterface.setAsteroidPoints(index, level)
        setAsteroids(props.gameInterface.getAsteroidData())
    }

    const handleSelect = (index) => {
        props.closeMenu()
        props.gameInterface.selectAsteroid(index)
        setAsteroids(props.gameInterface.getAsteroidData())
    }

    return (
        <div className="upgrade-menu-container">
            Asteroids
            {asteroids.map((asteroid, index) => (
                <div key={index} className="upgrade-panel">
                    <div className="upgrade-header">
                        {asteroid.name} Level
                        {asteroid.unlocked && asteroid.selected &&
                            <div className="description">
                                {asteroid.description}
                            </div>
                        }
                    </div>
                    <div className="upgrade-spacer" />
                    <div className="upgrade-item-container">
                        <div className="upgrade-item-image">
                            <img className="upgrade-image" src={asteroid.imagePath} alt={`Img ${index}`} />
                        </div>
                        {asteroid.isSwitching || asteroid.inWarp ? (
                            asteroid.inWarp ? (
                                <div className="upgrade-item">In Warp</div>
                            ) : (
                                <div className="upgrade-item">Switching Ships</div>
                            )
                        ) : (
                            asteroid.unlocked ? (
                                asteroid.selected ? (
                                    <div className="upgrade-item">
                                        <Upgrade
                                            upgradeModel={asteroid.numberUpgrade}
                                            index={index} upgrade={handleNumberUpgrade}
                                            set={handleSetNumber}
                                        />
                                        <div className="upgrade-spacer" />
                                        <Upgrade
                                            upgradeModel={asteroid.pointsUpgrade}
                                            index={index} upgrade={handlePointsUpgrade}
                                            set={handleSetPoints}
                                        />
                                    </div>
                                ) : (
                                    <div className="upgrade-item">
                                        <Select
                                            selectClick={() => handleSelect(index)}
                                        />
                                    </div>
                                )
                            ) : (
                                <div className="upgrade-item">
                                    <Unlock
                                        unlockCost={asteroid.unlockCost}
                                        unlockClick={() => handleUnlock(index)}
                                        canAfford={asteroid.canAffordUnlock}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </div>
            ))}
        </div>
    )

}