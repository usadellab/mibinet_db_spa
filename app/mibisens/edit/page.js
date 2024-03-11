"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Paper } from "@mui/material";
import { useSnackbar } from "notistack";
import Form from "@/components/form";
import { axios_mibisens } from "@/utils/helper";
import { useSession } from "next-auth/react";

/**
 * Edit page component for modifying sensor records.
 * Checks user's roles to grant access, fetches the record's initial data, and allows file management.
 *
 * @returns {JSX.Element|null} Returns the JSX of the Edit page or null if the user has no access.
 */
const Edit = () => {
	const router = useRouter();
	const search = useSearchParams();
	const record_id = search.get("id") ?? null;
	const [record, setRecord] = useState(null);
	const [files, setFiles] = useState({});
	const [deleteFlags, setDeleteFlags] = useState({
		structural_model_af2: false,
	});
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const { data: session } = useSession();
	const [hasAccess, setHasAccess] = useState(false);
	// Effect to check user roles for access permission.
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

	// Effect to fetch the record data if the user has access and a record ID is provided.
	useEffect(() => {
		const fetchData = async () => {
			if (record_id && hasAccess) {
				try {
					const response = await axios_mibisens.get(`/sensors/${record_id}/`);
					const data = response.data;
					setRecord(data);
				} catch (error) {
					console.error(error);
				}
			}
		};
		fetchData();
	}, [record_id, hasAccess]);
	if (!hasAccess) {
		return null;
	}
	const handleFileSelect = (event, field) => {
		setFiles({
			...files,
			[field]: event.target.files[0],
		});
	};

	const deleteOldFile = async (field) => {
		console.log("deleteOldFile");
		const fileName = record[field];
		try {
			const response = await axios_mibisens.delete(
				`/delete_structure?file_name=${fileName}`
			);
			if (response.status === 200) {
				enqueueSnackbar(`File ${fileName} deleted successfully`, {
					variant: "success",
				});
			}
		} catch (error) {
			console.error(`Failed to delete file  ${fileName}`, error);
			enqueueSnackbar(`Failed to delete file  ${fileName}`, {
				variant: "error",
			});
		}
	};

	const handleSwitchChange = (key, newState) => {
		setDeleteFlags({ ...deleteFlags, [key]: newState });
	};
	const uploadFile = async (field) => {
		const newFile = files[field];
		if (!newFile) {
			return null;
		}

		const formData = new FormData();
		formData.append("file", newFile);
		try {
			const response = await axios_mibisens.post(
				`/upload_structure?id=${record.id}&type=${field}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			enqueueSnackbar(`Update file ${newFile.name}  successfully`, {
				variant: "success",
			});
			return newFile.name;
		} catch (error) {
			console.error(`Error uploading new file (${newFile.name}):`, error);
			enqueueSnackbar(`Error uploading new file (${newFile.name})`, {
				variant: "error",
			});
			return null;
		}
	};

	const handleOnSave = async (event) => {
		event.preventDefault();
		let updatedFields = {};
		const field = "structural_model_af2";
		if (deleteFlags[field]) {
			await deleteOldFile(field);
			updatedFields[field] = null;
		}
		const updatedFileName = await uploadFile(field);
		if (updatedFileName) {
			updatedFields[field] = updatedFileName;
		}

		const updatedRecord = {
			...record,
			...updatedFields,
		};

		try {
			const response = await axios_mibisens.put(
				`/sensors/${record.id}/`,
				updatedRecord
			);
			enqueueSnackbar("Record updated successfully", { variant: "success" });
			router.push(`/mibisens/read?id=${response.data.id}`);
		} catch (error) {
			console.log("error:", error);
			enqueueSnackbar("Error in updating record", { variant: "error" });
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
						mode="edit"
						handleOnChange={handleOnChange}
						handleOnSave={handleOnSave}
						handleFileSelect={handleFileSelect}
						handleClearFileSelection={handleClearFileSelection}
						onSwitchChange={handleSwitchChange}
					/>
				) : null}
			</Paper>
		</Container>
	);
};

export default Edit;
