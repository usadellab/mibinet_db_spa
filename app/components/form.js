"use client";

import {
	Box,
	IconButton,
	TextField,
	Typography,
	Grid,
	Input,
	FormControlLabel,
	Switch,
	Link,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import { useRouter, useSearchParams } from "next/navigation";
import { styled } from "@mui/material/styles";
import BoolField from "@/components/bool-field";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useState } from "react";

const Root = styled("div")(({ theme }) => ({
	padding: theme.spacing(3),
}));

const BackButton = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	marginBottom: theme.spacing(2),
}));

const FormContainer = styled("div")(({ theme }) => ({
	padding: theme.spacing(3),
	maxHeight: "750px",
	overflowY: "auto",
}));

const FormField = styled("div")(({ theme }) => ({
	marginBottom: theme.spacing(2),
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
}));

/**
 * Form component for managing and displaying various form fields with state management and navigation logic.
 *
 * @param {Object} data - Data to populate the form fields.
 * @param {string} mode - The current mode of the form (e.g., "edit", "view").
 * @param {Function} handleOnSave - Callback function to handle save action.
 * @param {Function} handleOnChange - Callback function to handle changes in form fields.
 * @param {Function} handleFileSelect - Callback function to handle file selection.
 * @param {Function} handleClearFileSelection - Callback function to clear selected files.
 * @param {Function} onSwitchChange - Callback function to handle changes in switch components.
 *
 * @returns {JSX.Element} The JSX code for rendering the form with its fields and controls.
 */
const Form = ({
	data,
	mode,
	handleOnSave,
	handleOnChange,
	handleFileSelect,
	handleClearFileSelection,
	onSwitchChange,
}) => {
	const router = useRouter();
	const search = useSearchParams();
	const forward = () => {
		const params = new URLSearchParams(search.toString());
		const queryString = params.toString();
		router.push(`/mibisens/edit?` + queryString.toString());
	};
	const handleReturn = () => {
		const params = new URLSearchParams(search.toString());
		params.delete("id");
		const queryString = params.toString();
		router.push(`/mibisens?` + queryString.toString());
	};

	const [switchState, setSwitchState] = useState({
		structural_model_af2: false,
	});

	const handleSwitchChange = (key) => {
		const newState = !switchState[key];
		setSwitchState({ ...switchState, [key]: newState });
		onSwitchChange(key, newState);
	};

	return (
		<Box>
			<Root>
				<BackButton>
					<IconButton onClick={handleReturn}>
						<ArrowBackIcon />
					</IconButton>
					{mode === "add" ? (
						<Typography variant="h5">Add a new record</Typography>
					) : (
						<Typography variant="h5">Record ID: {data.id}</Typography>
					)}
					{mode === "read" ? (
						<IconButton onClick={forward}>
							<Typography
								variant="body2"
								style={{ fontSize: "20px" }}
							>
								Edit
							</Typography>
							<EditIcon />
						</IconButton>
					) : (
						<IconButton onClick={handleOnSave}>
							<Typography
								variant="body2"
								style={{ fontSize: "20px" }}
							>
								Save
							</Typography>
							<SaveIcon />
						</IconButton>
					)}
				</BackButton>
				<FormContainer>
					<form>
						{Object.entries(data).map(([key, value]) => (
							<FormField key={key}>
								{mode === "read" || (key === "id" && mode === "edit") ? (
									<LockIcon />
								) : null}
								{key === "purification" ? (
									<BoolField
										value={value}
										onChange={(newValue) =>
											handleOnChange({ target: { value: newValue } }, key)
										}
										readOnly={mode === "read"}
										label="purification"
									/>
								) : mode !== "read" && "structural_model_af2" === key ? (
									<Grid
										container
										spacing={2}
										alignItems="center"
										marginY={2}
										key={key}
									>
										<Grid
											item
											xs={3}
										>
											<Typography
												variant="h7"
												style={{ marginLeft: "5px", marginRight: "10px" }}
											>
												{key}
											</Typography>
										</Grid>
										{mode === "edit" ? (
											<>
												{data[key] && (
													<>
														<Grid
															item
															xs={5}
														>
															<Typography variant="h7">{data[key]}</Typography>
														</Grid>
														<Grid
															item
															xs={4}
														>
															<FormControlLabel
																control={
																	<Switch
																		checked={switchState[key]}
																		onChange={() => handleSwitchChange(key)}
																		name={key + "_delete"}
																	/>
																}
																label="Delete Old File"
															/>
														</Grid>
														<Grid
															item
															xs={3}
														></Grid>
													</>
												)}

												<Grid
													item
													xs={5}
												>
													<Input
														id={key}
														type="file"
														onChange={(e) => handleFileSelect(e, key)}
														fullWidth
														disableUnderline
													/>
												</Grid>
											</>
										) : (
											<Grid
												item
												xs={8}
											>
												<Input
													id={key}
													type="file"
													onChange={(e) => handleFileSelect(e, key)}
													fullWidth
													disableUnderline
												/>
											</Grid>
										)}

										<Grid
											item
											xs={1}
										>
											<IconButton onClick={() => handleClearFileSelection(key)}>
												<CancelOutlinedIcon />
											</IconButton>
										</Grid>
									</Grid>
								) : mode === "read" &&
								  key === "reference" &&
								  value &&
								  value !== "Z01" ? (
									value.includes("Z01") ? (
										<Typography>
											{key + ":  "}
											<Link
												href={`https://doi.org/${value.split(" and ")[0]}`}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													color: "blue",
													textDecoration: "underline",
												}}
											>
												{value.split(" and ")[0]}
											</Link>
											{" and " + value.split(" and ")[1]}
										</Typography>
									) : (
										<Typography>
											{key + ":  "}
											<Link
												href={`https://doi.org/${value}`}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													color: "blue",
													textDecoration: "underline",
												}}
											>
												{value}
											</Link>
										</Typography>
									)
								) : (
									<TextField
										label={key}
										value={value ?? ""}
										fullWidth
										InputProps={
											mode === "read"
												? {
														readOnly: true,
												  }
												: mode === "edit"
												? {
														readOnly: key === "id",
												  }
												: undefined
										}
										onChange={
											mode === "read"
												? undefined
												: (e) => handleOnChange(e, key)
										}
										multiline={key === "remarks" ? true : false}
										rows={key === "remarks" ? 5 : undefined}
									/>
								)}
							</FormField>
						))}
					</form>
				</FormContainer>
			</Root>
		</Box>
	);
};

export default Form;
