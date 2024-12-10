import { useState } from "react";
import "./input-text.css";

const InputText = ({ label, placeholder, name, onChange, initialValue = '' }) => {
	const [value, setValue] = useState(initialValue);
	const [showError, setShowError] = useState(false);

	function handleChange(e) {
		const {value} = e.target;
		setValue(value);
		onChange(value, name);
		setShowError(value.length < 3 && value.length > 0);
	}
	
	return (
		<div className='cmp-input-text'>
			<label>{label}</label>
			<input type='text'
				name={name}
				placeholder={placeholder}
				onChange={handleChange}
				value={value} />
			{showError && <span className="cmp-input-text__error">Type at least 3 characters</span>}
		</div>
	);
}

export default InputText;