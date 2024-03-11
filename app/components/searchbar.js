"use client";

import { useState } from "react";
import { Input, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRouter } from "next/navigation";

/**
 * Renders a search bar with search, refresh, and conditional add functionality.
 *
 * @param {string} searchQuery Initial search query to populate the search input.
 * @param {Function} onSearch Callback function invoked with the search query when the search is executed.
 * @param {boolean} hasWritePermission Flag indicating whether the user has permission to add new items.
 * @param {string} url URL or path to navigate to when the add button is clicked.
 *
 * @returns {JSX.Element} The search bar component with input, search, refresh, and optionally add button.
 */
const SearchBar = ({ searchQuery, onSearch, hasWritePermission, url }) => {
	const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
	const router = useRouter();

	const handleOnSearch = () => {
		onSearch(localSearchQuery);
	};
	const handleOnInputChange = (e) => {
		setLocalSearchQuery(e.target.value);
	};

	const handleOnAdd = () => {
		router.push(`/mibisens/add?` + url);
	};
	const handleOnRefresh = () => {
		setLocalSearchQuery("");
		onSearch("");
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				ml: 2,
				mr: 6,
				mt: 2,
			}}
		>
			<Box
				display="flex"
				alignItems="center"
			>
				<Input
					sx={{ mr: 2 }}
					type="text"
					placeholder="Search..."
					value={localSearchQuery}
					onChange={handleOnInputChange}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={handleOnSearch}
				>
					<SearchIcon />
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={handleOnRefresh}
					sx={{ ml: 1 }}
				>
					<RefreshIcon />
				</Button>
			</Box>
			{hasWritePermission && (
				<Button
					variant="contained"
					onClick={handleOnAdd}
					sx={{ ml: 2 }}
				>
					<AddCircleOutlineIcon />
				</Button>
			)}
		</Box>
	);
};

export default SearchBar;
