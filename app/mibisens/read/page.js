"use client";

import { useSearchParams } from "next/navigation";
import { Container, Box, Paper, Typography } from "@mui/material";
import Form from "@/components/form";
import { axios_mibisens } from "@/utils/helper";
import { useEffect, useState } from "react";
import ThreeDmolViewer from "@/components/threeDmol-viewer";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";

/**
 * The Read component is responsible for fetching and displaying the details of a specific
 * sensor record including its PDB structure using the 3DmolViewer component.
 */
const Read = () => {
	const search = useSearchParams();
	const record_id = search.get("id") ?? null;
	const [recordData, setRecordData] = useState(null);
	const [pdbData, setPdbData] = useState({ apo: null, bound: null });
	const { data: session } = useSession();
	const [hasAccess, setHasAccess] = useState(false);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	// Check user roles to determine access rights
	useEffect(() => {
		if (session?.user?.roles) {
			let access = false;
			access = session.user.roles.some((role) =>
				["mibisens_editor", "mibisens_admin", "mibisens_reader"].includes(role)
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

	// Fetch sensor record data and PDB files
	useEffect(() => {
		const fetchData = async () => {
			if (record_id && hasAccess) {
				try {
					const response = await axios_mibisens.get(`/sensors/${record_id}/`);
					setRecordData(response.data);

					const loadPdbFile = async (fileName, type) => {
						if (fileName) {
							try {
								const fileResponse = await axios_mibisens.get(
									`/get_structure?file_name=${fileName}`
								);
								setPdbData((prevData) => ({
									...prevData,
									[type]: fileResponse.data,
								}));
							} catch (error) {
								console.error(`Error fetching ${type} PDB file:`, error);
							}
						}
					};

					loadPdbFile(
						response.data.structural_model_af2,
						"structural_model_af2"
					);
				} catch (error) {
					console.error("Error fetching record data:", error);
				}
			}
		};

		fetchData();
	}, [record_id, hasAccess]);
	if (!hasAccess) {
		return null;
	}
	if (!recordData) {
		return <div>Loading...</div>;
	}

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "row",
			}}
		>
			<Container maxWidth="md">
				<Paper elevation={24}>
					{recordData ? (
						<Form
							data={recordData}
							mode="read"
						/>
					) : null}
				</Paper>
			</Container>
			{pdbData.structural_model_af2 && hasAccess && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						mr: "100px",
					}}
				>
					{
						<>
							<Typography variant="h5">
								Structure Viewer: structural_model_af2
							</Typography>
							<ThreeDmolViewer
								pdbData={pdbData.structural_model_af2}
								id="structural_model_af2"
							/>
						</>
					}
				</Box>
			)}
		</Box>
	);
};

export default Read;
