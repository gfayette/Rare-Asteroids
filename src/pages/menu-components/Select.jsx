import "./Select.css"

export default function Select({ text = "Select", selectClick }) {

    return (
        <button className="select-button" onClick={selectClick} >
            {text}
        </button>
    )
}
