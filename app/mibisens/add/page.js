"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Container, Box, Paper, IconButton, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import Form from "@/components/form";
import { axios_mibisens } from "@/utils/helper";
import { useSession } from "next-auth/react";
import initial_record from "./record";

/**
 * Add component for creating a new record.
 * Utilizes a form component to collect information and saves it to the database.
 */
const Add = () => {
	const router = useRouter();
	const search = useSearchParams();

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const { data: session } = useSession();
	const [hasAccess, setHasAccess] = useState(false);
	useEffect(() => {
		if (session?.user?.roles) {
			let access = false;
			access = session.user.roles.some(
				(role) => role === "mibisens_editor" || role === "mibisens_admin"
			);
			setHasAccess(access);
			if (!access) {
				enqueueSnackbar("You don't have access to this page.", {
					variant: "error",
				});
				return;
			}
		}
	}, [session]);

	const [files, setFiles] = useState({});
	const [record, setRecord] = useState(initial_record);
	if (!hasAccess) {
		return null;
	}
	const handleFileSelect = (event, key) => {
		setFiles({
			...files,
			[key]: event.target.files[0],
		});
	};

	const uploadFiles = async (field) => {
		const file = files[field];
		if (file) {
			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await axios_mibisens.post(
					`/upload_structure?id=${record.id}&type=${field}&update_record=true`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				enqueueSnackbar(`Update file ${file.name}  successfully`, {
					variant: "success",
				});
			} catch (error) {
				console.error("Error uploading file:", error);
				enqueueSnackbar("Error uploading file", { variant: "error" });
				return false;
			}
		}

		return true;
	};

	const handleOnSave = async (event) => {
		event.preventDefault();
		try {
			const response = await axios_mibisens.post("/sensors/", record);
			setRecord((prev) => ({ ...prev, id: response.data.id }));
			enqueueSnackbar("Save record successfully", { variant: "success" });

			const uploaded = await uploadFiles("structural_model_af2");
			router.push(`/mibisens/read?id=${response.data.id}&` + search.toString());
		} catch (error) {
			console.log("error:");
			console.error(error);
			enqueueSnackbar("Error in adding new record", { variant: "error" });
		}
	};
	const handleOnChange = (e, key) => {
		const newValue = e.target.value === "" ? null : e.target.value;
		setRecord({
			...record,
			[key]: newValue,
		});
	};

	const handleClearFileSelection = (field) => {
		setFiles({
			...files,
			[field]: null,
		});

		const fileInput = document.getElementById(field);
		if (fileInput) {
			fileInput.value = "";
		}
	};
	return (
		<Container maxWidth="md">
			<Paper elevation={24}>
				{record ? (
					<Form
						data={record}
						mode="add"
						handleOnChange={handleOnChange}
						handleOnSave={handleOnSave}
						handleFileSelect={handleFileSelect}
						handleClearFileSelection={handleClearFileSelection}
					/>
				) : null}
			</Paper>
		</Container>
	);
};

export default Add;
