"use client";

import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

/**
 * Renders a password input field with visibility toggle.
 *
 * @param {string} label Label for the password field.
 * @param {string} value Current value of the password field.
 * @param {Function} onChange Handler for change events on the password field.
 * @param {string} [helperText] Optional helper text displayed below the password field.
 * @param {string} [autoComplete] Specifies if the field should have autocomplete.
 *
 * @returns {JSX.Element} A Material-UI TextField component configured for password input.
 */
const PasswordField = ({
	label,
	value,
	onChange,
	helperText,
	autoComplete,
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const handleTogglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<TextField
			variant="outlined"
			margin="normal"
			required
			fullWidth
			label={label}
			type={showPassword ? "text" : "password"}
			autoComplete={autoComplete}
			value={value}
			onChange={onChange}
			helperText={helperText}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={handleTogglePasswordVisibility}
							edge="end"
						>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);
};

export default PasswordField;
