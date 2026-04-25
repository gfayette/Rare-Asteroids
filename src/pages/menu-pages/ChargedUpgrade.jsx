import "./ChargedUpgrade.css"
import { useEffect, useState } from 'react'
import Upgrade from '../menu-components/Upgrade.jsx'
import Unlock from "../menu-components/Unlock.jsx"
import { useEventContext } from "../MainDiv.jsx"

export default function ChargedUpgrade(props) {

    const [chargedWeapon, setChargedWeapon] = useState(null)
    const { triggerEvent } = useEventContext()

    useEffect(() => {
        let runLoop = true
        const updateLoop = () => {
            if (runLoop) {
                setChargedWeapon(props.gameInterface.getChargedData())
                setTimeout(updateLoop, 500)
            }
        }
        updateLoop()

        return () => {
            runLoop = false
        }
    }, [props])

    const handleUnlock = () => {
        props.gameInterface.unlockCharged()
        triggerEvent("charged")
        setChargedWeapon(props.gameInterface.getChargedData())
    }

    const handleDamageUpgrade = () => {
        props.gameInterface.upgradeChargedDamage()
        triggerEvent("charged")
        setChargedWeapon(props.gameInterface.getChargedData())
    }

    const handleIntervalUpgrade = () => {
        props.gameInterface.upgradeChargedInterval()
        triggerEvent("charged")
        setChargedWeapon(props.gameInterface.getChargedData())
    }

    const handleSetDamage = (index, level) => {
        props.gameInterface.setChargedDamage(level)
        setChargedWeapon(props.gameInterface.getChargedData())
    }

    const handleSetInterval = (index, level) => {
        props.gameInterface.setChargedInterval(level)
        setChargedWeapon(props.gameInterface.getChargedData())
    }

    return (
        <div className="upgrade-menu-container">
            Primary Weapon
            {chargedWeapon != null &&
                <div className="upgrade-panel">
                    <div className="upgrade-header">
                        {chargedWeapon.name}
                        {chargedWeapon.unlocked &&
                            <div className="description">
                                {chargedWeapon.description}
                            </div>
                        }
                    </div>
                    <div className="upgrade-spacer" />
                    <div className="upgrade-item-container">
                        <div className="upgrade-item-image">
                            <img className="upgrade-image" src={chargedWeapon.imagePath} alt={`Img 0`} />
                        </div>
                        {chargedWeapon.isSwitching || chargedWeapon.inWarp ? (
                            chargedWeapon.inWarp ? (
                                <div className="upgrade-item">In Warp</div>
                            ) : (
                                <div className="upgrade-item">Switching Ships</div>
                            )
                        ) : (
                            chargedWeapon.unlocked ? (
                                <div className="upgrade-item">
                                    <Upgrade
                                        upgradeModel={chargedWeapon.damageUpgrade}
                                        upgrade={handleDamageUpgrade}
                                        set={handleSetDamage}
                                    />
                                    <div className="upgrade-spacer" />
                                    <Upgrade
                                        upgradeModel={chargedWeapon.intervalUpgrade}
                                        upgrade={handleIntervalUpgrade}
                                        set={handleSetInterval} />
                                </div>
                            ) : (
                                <div className="upgrade-item">
                                    <Unlock
                                        unlockCost={chargedWeapon.unlockCost}
                                        unlockClick={() => handleUnlock()}
                                        canAfford={chargedWeapon.canAffordUnlock}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </div>
            }
        </div >
    )

}