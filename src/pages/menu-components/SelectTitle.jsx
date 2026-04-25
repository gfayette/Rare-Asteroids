import "./SelectTitle.css"

export default function SelectTitle({ text = "Select", selectClick }) {

    return (
        <button className="select-title-button" onClick={selectClick} >
            {text}
        </button>
    )
}
