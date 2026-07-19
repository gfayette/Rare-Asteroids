import "./WeaponsUpgrade.css"
import { useEffect, useState } from 'react'
import Upgrade from '../menu-components/Upgrade.jsx'
import Select from "../menu-components/Select.jsx"
import Unlock from "../menu-components/Unlock.jsx"
import { useEventContext } from "../MainDiv.jsx"

export default function WeaponsUpgrade(props) {

    const [guns, setGuns] = useState([])
    const { triggerEvent } = useEventContext()

    useEffect(() => {
        let runLoop = true
        const updateLoop = () => {
            if (runLoop) {
                setGuns(props.gameInterface.getProjectileData())
                setTimeout(updateLoop, 500)
            }
        }
        updateLoop()

        return () => {
            runLoop = false
        }
    }, [props])

    const handleUnlock = (index) => {
        props.gameInterface.unlockProjectile(index)
        triggerEvent("guns")
        setGuns(props.gameInterface.getProjectileData())
    }

    const handleDamageUpgrade = (index) => {
        props.gameInterface.upgradeProjectileDamage(index)
        triggerEvent("guns")
        setGuns(props.gameInterface.getProjectileData())
    }

    const handleIntervalUpgrade = (index) => {
        props.gameInterface.upgradeProjectileInterval(index)
        triggerEvent("guns")
        setGuns(props.gameInterface.getProjectileData())
    }

    const handleVelocityUpgrade = (index) => {
        props.gameInterface.upgradeProjectileVelocity(index)
        triggerEvent("guns")
        setGuns(props.gameInterface.getProjectileData())
    }

    const handleSetDamage = (index, level) => {
        props.gameInterface.setProjectileDamage(index, level)
        setGuns(props.gameInterface.getProjectileData())
    }

    const handleSetInterval = (index, level) => {
        props.gameInterface.setProjectileInterval(index, level)
        setGuns(props.gameInterface.getProjectileData())
    }

    const handleSetVelocity = (index, level) => {
        props.gameInterface.setProjectileVelocity(index, level)
        setGuns(props.gameInterface.getProjectileData())
    }

    const handleActivate = (index) => {
        props.gameInterface.activateProjectile(index, true)
        setGuns(props.gameInterface.getProjectileData())
    }

    const handleDeactivate = (index) => {
        props.gameInterface.activateProjectile(index, false)
        setGuns(props.gameInterface.getProjectileData())
    }

    return (
        <div className="upgrade-menu-container">
            Guns
            {guns.map((gun, index) => (
                <div key={index} className="upgrade-panel">
                    <div className="upgrade-header">
                        {gun.name}
                        {gun.unlocked && gun.active &&
                            <div className="description">
                                {gun.description}
                            </div>
                        }
                    </div>
                    <div className="upgrade-spacer" />
                    <div className="upgrade-item-container">
                        <div className="upgrade-item-image">
                            <img className="upgrade-image" src={gun.imagePath} alt={`Img ${index}`} />
                        </div>
                        {gun.isSwitching || gun.inWarp ? (
                            gun.inWarp ? (
                                <div className="upgrade-item">In Warp</div>
                            ) : (
                                <div className="upgrade-item">Switching Ships</div>
                            )
                        ) : (
                            gun.unlocked ? (
                                gun.active ? (
                                    <div className="upgrade-item">
                                        <Upgrade
                                            upgradeModel={gun.damageUpgrade}
                                            index={index}
                                            upgrade={handleDamageUpgrade}
                                            set={handleSetDamage}
                                        />
                                        <div className="upgrade-spacer" />
                                        <Upgrade
                                            upgradeModel={gun.intervalUpgrade}
                                            index={index}
                                            upgrade={handleIntervalUpgrade}
                                            set={handleSetInterval}
                                        />
                                        <div className="upgrade-spacer" />
                                        <Upgrade
                                            upgradeModel={gun.velocityUpgrade}
                                            index={index}
                                            upgrade={handleVelocityUpgrade}
                                            set={handleSetVelocity}
                                        />
                                        <div className="upgrade-spacer" />
                                        <div className="upgrade-item">
                                            <Select
                                                text={"Deactivate"}
                                                selectClick={() => handleDeactivate(index)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="upgrade-item">
                                        <Select
                                            text={"Activate"}
                                            selectClick={() => handleActivate(index)}
                                        />
                                    </div>
                                )
                            ) : (
                                <div className="upgrade-item">
                                    <Unlock
                                        unlockCost={gun.unlockCost}
                                        unlockClick={() => handleUnlock(index)}
                                        canAfford={gun.canAffordUnlock}
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