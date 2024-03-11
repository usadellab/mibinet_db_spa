import {
	ToggleButton,
	ToggleButtonGroup,
	FormControl,
	FormLabel,
	Typography,
} from "@mui/material";

/**
 * BoolField component allows users to select between True, False, or Null.
 * It renders a group of toggle buttons based on the provided value.
 *
 * @param {string} label - Label for the field.
 * @param {boolean|null} value - Current value of the field (true, false, or null).
 * @param {Function} onChange - Callback function to be called when the value changes.
 * @param {boolean} [readOnly=false] - If true, the field will be read-only and cannot be changed by the user.
 *
 * @returns {JSX.Element} The BoolField component.
 */
const BoolField = ({ label, value, onChange, readOnly }) => {
	const handleOnChange = (event, newValue) => {
		if (newValue === "null") {
			onChange(null);
		} else {
			onChange(newValue);
		}
	};
	const valueProp = value === null ? "null" : value;
	return (
		<FormControl component="fieldset">
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<FormLabel component="legend">
					<Typography
						variant="h7"
						style={{ marginLeft: "5px", marginRight: "10px" }}
					>
						{label}
					</Typography>
				</FormLabel>
				<ToggleButtonGroup
					value={valueProp}
					exclusive
					onChange={handleOnChange}
					aria-label={label}
				>
					<ToggleButton
						value={true}
						aria-label="Enabled"
						disabled={readOnly}
					>
						True
					</ToggleButton>
					<ToggleButton
						value={false}
						aria-label="Disabled"
						disabled={readOnly}
					>
						False
					</ToggleButton>
					<ToggleButton
						value={"null"}
						aria-label="Not set"
						disabled={readOnly}
					>
						Null
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
		</FormControl>
	);
};

export default BoolField;
