import { useState } from "react";
import "./input-text-area.css";

const InputTextArea = ({ label, name, onChange, initialValue, ...props }) => {
    const [value, setValue] = useState(initialValue);

    function handleTextAreaChange(e) {
        setValue(e.target.value);
        onChange(e.target.value, name);
    }

    return (
			<div className='cmp-input-text-area'>
				<label>{label}</label>
				<textarea
						value={value}
						onChange={handleTextAreaChange}
						{...props} />
			</div>
    );
}

export default InputTextArea;