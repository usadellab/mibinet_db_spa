import { useState } from "react";
import Link from "next/link";
import {
	Table,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
	TablePagination,
	Box,
	IconButton,
	TableSortLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const TablePaginationActions = (props) => {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (event) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (event) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (event) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	);
};

const tableStyle = {
	boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
	width: "100%",
	overflowX: "auto",
	overflowY: "auto",
	maxHeight: "760px",
};

const cellStyle = {
	borderBottom: "1px solid #ccc",
};
const actionCellStyle = {
	width: "100px",
};

const tableHeadStyle = {
	background: "#DC143C",
	color: "white",
	fontWeight: "bold",
	borderRight: "1px solid #ccc",
};
const tableSortLabelStyles = {
	color: "white",
	"&.MuiTableSortLabelActive": {
		color: "white",
	},
	"& .MuiTableSortLabelIcon": {
		color: "white",
	},
};

/**
 * Renders a table with sortable columns and pagination, and provide options to read, edit and delete rows.
 *
 * @param {Array} columns - Fields in the table
 * @param {Array} rows - Data rows to display in the table
 * @param {number} count - Total number of rows, used for pagination
 * @param {number} page - Current page number
 * @param {number} rowsPerPage - Number of rows to display per page
 * @param {string} searchQuery - Current search query for filtering rows (optional)
 * @param {Array} sort - Sorting configuration for the table
 * @param {Function} handleChangePage - Callback to handle page changes
 * @param {Function} handleChangeRowsPerPage - Callback to handle changes in rows per page
 * @param {Function} handleDeleteClick - Callback to handle row deletion (optional)
 * @param {Function} handleSortRequest - Callback to handle sorting requests
 * @param {boolean} hasWritePermission - Flag to indicate if the user has permission to edit or delete rows
 *
 * @returns {JSX.Element} The TableWithPagination component
 */
const TableWithPagination = (props) => {
	const {
		columns,
		rows,
		count,
		page,
		rowsPerPage,
		searchQuery,
		sort,
		handleChangePage,
		handleChangeRowsPerPage,
		handleDeleteClick,
		handleSortRequest,
		hasWritePermission,
	} = props;

	const getSortDirection = (columnName) => {
		const sortObject = sort.find((s) => s.field === columnName);
		return sortObject ? sortObject.direction : false;
	};
	const sortParam = `ordering=${sort
		.map(({ field, direction }) => (direction === "desc" ? `-${field}` : field))
		.join(",")}`;
	return (
		<div
			style={{
				padding: "10px",
			}}
		>
			<TableContainer
				component={Paper}
				style={tableStyle}
			>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell
								style={{
									...actionCellStyle,
									...tableHeadStyle,
								}}
							>
								Actions
							</TableCell>
							{columns.map((column, index) => (
								<TableCell
									key={index}
									style={tableHeadStyle}
									sortDirection={
										getSortDirection(column) ? getSortDirection(column) : false
									}
								>
									<TableSortLabel
										active={!!getSortDirection(column)}
										direction={
											getSortDirection(column)
												? getSortDirection(column)
												: "asc"
										}
										onClick={() => handleSortRequest(column)}
										style={tableSortLabelStyles}
									>
										{column}
									</TableSortLabel>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows?.map((row, row_id) => (
							<TableRow key={row_id}>
								<TableCell style={actionCellStyle}>
									<div style={{ display: "flex", alignItems: "center" }}>
										<IconButton
											component={Link}
											href={`/mibisens/read?id=${row.id}&page=${
												page + 1
											}&page_size=${rowsPerPage}&search=${encodeURIComponent(
												searchQuery
											)}&${sortParam}`}
											aria-label="read"
										>
											<VisibilityIcon />
										</IconButton>
										{hasWritePermission && (
											<div style={{ display: "flex", flexDirection: "row" }}>
												<IconButton
													component={Link}
													href={`/mibisens/edit?id=${row.id}&page=${
														page + 1
													}&page_size=${rowsPerPage}&search=${encodeURIComponent(
														searchQuery
													)}&${sortParam}`}
													aria-label="edit"
												>
													<EditIcon />
												</IconButton>
												<IconButton
													onClick={() => handleDeleteClick(row.id)}
													aria-label="delete"
												>
													<DeleteOutlineIcon />
												</IconButton>
											</div>
										)}
									</div>
								</TableCell>
								{columns.map((column, index) => (
									<TableCell
										key={"row-" + row_id + "-" + index}
										style={cellStyle}
									>
										{row[column] ? (
											column === "reference" ? (
												row[column] === "Z01" ? (
													row[column].toString()
												) : row[column].includes("Z01") ? (
													<>
														<Link
															href={`https://doi.org/${
																row[column].split(" and ")[0]
															}`}
															target="_blank"
															rel="noopener noreferrer"
															style={{
																color: "blue",
																textDecoration: "underline",
															}}
														>
															{row[column].split(" and ")[0]}
														</Link>
														<div>and {row[column].split(" and ")[1]}</div>
													</>
												) : (
													<Link
														href={`https://doi.org/${row[column]}`}
														target="_blank"
														rel="noopener noreferrer"
														style={{
															color: "blue",
															textDecoration: "underline",
														}}
													>
														{row[column].toString()}
													</Link>
												)
											) : (
												row[column].toString()
											)
										) : null}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={count}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				ActionsComponent={TablePaginationActions}
			/>
		</div>
	);
};

export default TableWithPagination;
