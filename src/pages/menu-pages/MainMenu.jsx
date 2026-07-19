import "./MainMenu.css"
import SelectTitle from "../menu-components/SelectTitle.jsx"
import StateStorage from "../../storage/StateStorage"

export default function MainMenu(props) {

    const handleClear = () => {
        StateStorage.clearStorage()
    }

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    const isFullscreenSupported = () => {
        return 'requestFullscreen' in document.documentElement
    }

    return (
        <div className="main-container">
            <div className="main-text">
                Rare
            </div>
            <div className="main-text">
                Asteroids
            </div>

            <div className="gap" />

            <SelectTitle
                text={"Title Page"}
                selectClick={() => props.showTitlePage()}
            />

            {isFullscreenSupported() &&
                <SelectTitle
                    text={"Fullscreen"}
                    selectClick={() => handleFullscreen()}
                />}

            <SelectTitle
                text={"About"}
                selectClick={() => props.handleMenuClick("about")}
            />
        </div>
    )
}