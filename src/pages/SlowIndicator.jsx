import './SlowIndicator.css'

export default function SlowIndicator({ onClick }) {

    return (
        <button className="slow-container"
            onClick={() => onClick('settings')}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
                <g id="SVGRepo_bgCarrier" strokeWidth="10"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path
                        stroke="#FF0000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.12 4.623a1 1 0 011.76 0l11.32 20.9A1 1 0 0127.321 27H4.679a1 1 0 01-.88-1.476l11.322-20.9zM16 18v-6"
                    />
                    <path
                        fill="#FF0000"
                        d="M17.5 22.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                </g>
            </svg>
        </button>
    )
}
