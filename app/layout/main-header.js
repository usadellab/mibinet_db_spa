"use client";

import { useState } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Image from "next/image";
import { Login as LoginIcon } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { signOut, useSession } from "next-auth/react";
import ConfirmationDialog from "@/components/dialog";
import { useSnackbar } from "notistack";
import { axios_auth } from "@/utils/helper";

/**
 * Renders the main navigation header of the application.
 *
 * @param {string} icon - The logo URL to display in the header. Defaults to "/MibiDB.png".
 * @param {Function} toggleSidebar - Function to toggle the sidebar visibility.
 */
const MainHeader = ({ icon, toggleSidebar }) => {
	const { data: session, status } = useSession();
	icon = icon || "/MibiDB.png";

	const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const handleLogoutClick = () => {
		setOpenLogoutDialog(true);
	};
	const handleLogoutCancel = () => {
		setOpenLogoutDialog(false);
	};

	const handleLogoutConfirm = async () => {
		try {
			setOpenLogoutDialog(false);

			const response = await axios_auth.post(
				"/logout/",
				{
					refresh: session.refreshToken,
				},
				{
					headers: {
						Authorization: `Bearer ${session.accessToken}`,
					},
				}
			);
			await signOut();
			enqueueSnackbar("Logout Successfully", { variant: "success" });
		} catch (error) {
			console.error("Error in logout:", error);
			enqueueSnackbar("Logout Failed", { variant: "error" });
		}
	};

	return (
		<AppBar
			position="fixed"
			sx={{
				backgroundColor: "orange",
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
		>
			<Toolbar>
				{toggleSidebar ? (
					<IconButton onClick={toggleSidebar}>
						<MenuIcon />
					</IconButton>
				) : null}
				<Link
					href="/"
					passHref
				>
					<Button
						style={{
							textDecoration: "none",
							color: "inherit",
							display: "flex",
							alignItems: "center",
						}}
					>
						<Image
							src={icon}
							alt="Logo"
							width="40"
							height="50"
						/>
						<Typography
							variant="h6"
							component="div"
							sx={{ ml: 2, textTransform: "none" }}
						>
							MibiDB
						</Typography>
					</Button>
				</Link>
				<Box sx={{ flexGrow: 1 }} />
				{status === "authenticated" ? (
					<div>
						<Button
							color="inherit"
							onClick={handleLogoutClick}
						>
							<Typography
								variant="h6"
								component="div"
								sx={{ ml: 2, textTransform: "none" }}
							>
								Logout
							</Typography>
							<LogoutIcon />
						</Button>
						<ConfirmationDialog
							open={openLogoutDialog}
							onClose={handleLogoutCancel}
							onConfirm={handleLogoutConfirm}
							title="Are you sure you want to logout?"
							content={`Username: ${session?.user?.username}`}
						/>
					</div>
				) : (
					<Link
						href="/login"
						passHref
					>
						<Button color="inherit">
							<Typography
								variant="h6"
								component="div"
								sx={{ ml: 2, textTransform: "none" }}
							>
								Login
							</Typography>
							<LoginIcon />
						</Button>
					</Link>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default MainHeader;
