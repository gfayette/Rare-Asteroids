import "./Unlock.css"

export default function Unlock({ unlockCost, unlockClick, canAfford }) {

    return (
        <button
            className={canAfford ? "unlock-button-can-afford" : "unlock-button-cant-afford"}
            onClick={unlockClick}
            disabled={!canAfford}
        >
            Unlock {unlockCost}
        </button>
    )
}
