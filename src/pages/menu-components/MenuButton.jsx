import "./MenuButton.css"

export default function MenuButton({ onClick, icon, menuName, currentMenu, upgrade }) {

    return (
        <button
            className={`menu-button ${currentMenu === menuName ? "menu-button-current" : ""}`}
            onClick={() => onClick(menuName)}
        >
            {upgrade &&
                <span className="menu-button-upgrade" >
                    <svg
                        fill="#000000"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        id="up-arrow-circle"
                        data-name="Flat Color"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon flat-color"
                    >
                        <circle
                            id="primary"
                            cx="12"
                            cy="12"
                            r="10"
                            style={{ fill: "rgba(0, 0, 0, 0.7)" }}
                        />
                        <path
                            id="secondary"
                            d="M14.83,9.5,12.69,6.38a.82.82,0,0,0-1.38,0L9.17,9.5A1,1,0,0,0,9.86,11H11v6a1,1,0,0,0,2,0V11h1.14A1,1,0,0,0,14.83,9.5Z"
                            style={{ fill: "rgb(242, 242, 242)" }}
                        />
                    </svg>
                </span >
            }
            {
                typeof icon === "string" ? (
                    <img src={icon} alt="menu-icon" />
                ) : (
                    <span className="icon-container">{icon}</span>
                )
            }
        </button >
    )
}
