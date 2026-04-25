import "./ShipUpgrade.css"
import { useEffect, useState } from 'react'
import Upgrade from '../menu-components/Upgrade.jsx'
import Unlock from "../menu-components/Unlock.jsx"
import Select from "../menu-components/Select.jsx"
import { useEventContext } from "../MainDiv.jsx"

export default function ShipUpgrade(props) {

    const [ships, setShips] = useState([])
    const { triggerEvent } = useEventContext()

    useEffect(() => {
        let runLoop = true
        const updateLoop = () => {
            if (runLoop) {
                setShips(props.gameInterface.getShipData())
                setTimeout(updateLoop, 500)
            }
        }
        updateLoop()

        return () => {
            runLoop = false
        }
    }, [props])


    const handleUnlock = (index) => {
        props.gameInterface.unlockShip(index)
        triggerEvent("ships")
        setShips(props.gameInterface.getShipData())
    }

    const handleAgilityUpgrade = (index) => {
        props.gameInterface.upgradeShipAgility(index)
        triggerEvent("ships")
        setShips(props.gameInterface.getShipData())
    }

    const handleShieldUpgrade = (index) => {
        props.gameInterface.upgradeShipShield(index)
        triggerEvent("ships")
        setShips(props.gameInterface.getShipData())
    }

    const handleSetAgility = (index, level) => {
        props.gameInterface.setShipAgility(index, level)
        setShips(props.gameInterface.getShipData())
    }

    const handleSetShield = (index, level) => {
        props.gameInterface.setShipShield(index, level)
        setShips(props.gameInterface.getShipData())
    }

    const handleSelect = (index) => {
        props.closeMenu()
        props.gameInterface.selectShip(index)
        setShips(props.gameInterface.getShipData())
    }


    return (
        <div className="upgrade-menu-container">
            Ships
            {ships.map((ship, index) => (
                <div key={index} className="upgrade-panel">
                    <div className="upgrade-header">
                        {ship.name}
                        {ship.unlocked && ship.selected &&
                            <div className="description">
                                {ship.description}
                            </div>
                        }
                    </div>
                    <div className="upgrade-spacer" />
                    <div className="upgrade-item-container">
                        <div className="upgrade-item-image">
                            <img className="upgrade-image" src={ship.imagePath} alt={`Img ${index}`} />
                        </div>
                        {ship.isSwitching || ship.inWarp ? (
                            ship.inWarp ? (
                                <div className="upgrade-item">In Warp</div>
                            ) : (
                                <div className="upgrade-item">Switching Ships</div>
                            )
                        ) : (
                            ship.unlocked ? (
                                ship.selected ? (
                                    <div className="upgrade-item">
                                        <Upgrade
                                            upgradeModel={ship.agilityUpgrade}
                                            index={index}
                                            upgrade={handleAgilityUpgrade}
                                            set={handleSetAgility}
                                        />
                                        <div className="upgrade-spacer" />
                                        <Upgrade
                                            upgradeModel={ship.shieldUpgrade}
                                            index={index}
                                            upgrade={handleShieldUpgrade}
                                            set={handleSetShield}
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
                                        unlockCost={ship.unlockCost}
                                        unlockClick={() => handleUnlock(index)}
                                        canAfford={ship.canAffordUnlock}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </div>
            ))
            }
        </div >
    )


}