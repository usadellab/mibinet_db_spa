"use client";

import TableWithPagination from "@/components/table";
import SearchBar from "@/components/searchbar";
import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { fetcher, axios_mibisens } from "@/utils/helper";
import ConfirmationDialog from "@/components/dialog";
import { useSnackbar } from "notistack";
import { Typography, Box, Paper } from "@mui/material";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import header from "./header";

/**
 * Displays a searchable, paginated, and sortable table of sensors with read, edit and delete capabilities
 * based on user permissions. It uses SWR for data fetching and optimistic UI updates.
 *
 * @returns {JSX.Element} The MibiSens component with search bar, table, and delete confirmation dialog.
 */
const MibiSens = () => {
	const { data: session } = useSession();
	const [hasAccess, setHasAccess] = useState(false);
	const [hasWritePermission, setHasWritePermission] = useState(false);

	const search = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(search.get("search") || "");
	const [page, setPage] = useState(parseInt(search.get("page") || 1) - 1);
	const [rowsPerPage, setRowsPerPage] = useState(
		parseInt(search.get("page_size") || 10)
	);
	const [sort, setSort] = useState(
		search.get("ordering")
			? search
					.get("ordering")
					.split(",")
					.map((s) => {
						const direction = s.startsWith("-") ? "desc" : "asc";
						const field = direction === "desc" ? s.slice(1) : s;
						return { field, direction };
					})
			: [{ field: "id", direction: "asc" }]
	);

	// Data fetching with SWR based on search parameters and pagination
	const url = useMemo(() => {
		const ordering = sort
			.map((s) => `${s.direction === "desc" ? "-" : ""}${s.field}`)
			.join(",");
		return `/sensors/?page=${
			page + 1
		}&page_size=${rowsPerPage}&search=${encodeURIComponent(
			searchQuery
		)}&ordering=${ordering}`;
	}, [page, rowsPerPage, searchQuery, sort]);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteItemId, setDeleteItemId] = useState(null);

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const columns = header;
	useEffect(() => {
		if (session?.user?.roles) {
			let access = false;
			access = session.user.roles.some((role) =>
				["mibisens_editor", "mibisens_admin", "mibisens_reader"].includes(role)
			);
			setHasAccess(access);
			let writePermission =
				session.user.roles.some(
					(role) => role === "mibisens_editor" || role === "mibisens_admin"
				) || false;
			setHasWritePermission(writePermission);
			if (!access) {
				enqueueSnackbar("You don't have access to this page.", {
					variant: "error",
				});
				return;
			}
		}
	}, [session]);

	const { data, error, mutate } = useSWR(hasAccess ? url : null, fetcher);

	if (error) {
		console.log("Error loading data");
		console.error(error);
	}
	if (!data) {
		console.log("Loading data...");
		return null;
	}

	const handleDeleteClick = (id) => {
		setDeleteItemId(id);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			await axios_mibisens.delete(`/sensors/${deleteItemId}/`);
			setOpenDeleteDialog(false);
			enqueueSnackbar("Delete Successfully", { variant: "success" });

			const newPage = (data.count - 1) % rowsPerPage === 0 ? page - 1 : page;
			setPage(newPage);
			const ordering = sort
				.map((s) => `${s.direction === "desc" ? "-" : ""}${s.field}`)
				.join(",");

			const newUrl = `/sensors/?page=${
				newPage + 1
			}&page_size=${rowsPerPage}&search=${encodeURIComponent(
				searchQuery
			)}&ordering=${ordering}`;
			mutate(newUrl);
		} catch (error) {
			console.error("Error deleting record:", error);
			enqueueSnackbar("Error deleting record", { variant: "error" });
		}
	};

	const handleDeleteCancel = () => {
		setOpenDeleteDialog(false);
	};

	const handleOnSearch = (query) => {
		setSearchQuery(query);
		setPage(0);
		setSort([{ field: "id", direction: "asc" }]);
		const ordering = sort
			.map((s) => `${s.direction === "desc" ? "-" : ""}${s.field}`)
			.join(",");

		const searchUrl = `/sensors/?page=1&page_size=${rowsPerPage}&search=${encodeURIComponent(
			searchQuery
		)}&ordering=${ordering}`;
		mutate(searchUrl);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleSortRequest = (column) => {
		const existingSort = sort.find((s) => s.field === column);
		if (existingSort) {
			if (existingSort.direction === "desc") {
				setSort(sort.filter((s) => s.field !== column));
			} else {
				setSort(
					sort.map((s) =>
						s.field === column ? { ...s, direction: "desc" } : s
					)
				);
			}
		} else {
			setSort([...sort, { field: column, direction: "asc" }]);
		}
	};

	return (
		<div>
			<SearchBar
				searchQuery={searchQuery}
				onSearch={handleOnSearch}
				hasWritePermission={hasWritePermission}
				url={url.split("?")[1]}
			/>
			<TableWithPagination
				columns={columns}
				rows={data.results}
				count={data.count}
				page={page}
				handleChangePage={handleChangePage}
				rowsPerPage={rowsPerPage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
				handleDeleteClick={handleDeleteClick}
				searchQuery={searchQuery}
				sort={sort}
				handleSortRequest={handleSortRequest}
				hasWritePermission={hasWritePermission}
			/>
			{data?.results?.length ? null : (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					height="50vh"
				>
					<Paper
						elevation={3}
						style={{ padding: "20px", borderRadius: "10px" }}
					>
						<Typography
							variant="h5"
							component="h2"
							align="center"
						>
							No results found
						</Typography>
					</Paper>
				</Box>
			)}

			<ConfirmationDialog
				open={openDeleteDialog}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title="Are you sure you want to delete this item?"
				content={`Record ID: ${deleteItemId}.`}
			/>
		</div>
	);
};

export default MibiSens;
