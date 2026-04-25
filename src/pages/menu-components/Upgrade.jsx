import "./Upgrade.css"

export default function Upgrade({ upgradeModel, index = 0, upgrade, set }) {

    return (
        <div className="upgrade-container">
            <div className="upgrade-name">
                {upgradeModel.name}
            </div>

            <div className="upgrade-select">
                <div className="caret" onClick={() => set(index, upgradeModel.selectedLevel - 1)} alt="left caret" >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                    </svg>
                </div>

                <div className="upgrade-level">
                    {upgradeModel.selectedLevel}/{upgradeModel.currentLevel}
                </div>

                <div className="caret" onClick={() => set(index, upgradeModel.selectedLevel + 1)} alt="right caret" >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                </div>
            </div>

            {upgradeModel.currentLevel !== upgradeModel.maxLevel && (
                <button
                    className={upgradeModel.canAffordUpgrade ? "upgrade-button" : "upgrade-button-cant-afford"}
                    onClick={() => upgrade(index)}
                    disabled={!upgradeModel.canAffordUpgrade}

                >
                    <div className="upgrade-button-content">
                        Upgrade {upgradeModel.upgradeCost}
                    </div>
                </button>
            )}
        </div >
    )
}
