"use client";

import React from "react";
import { Container, Box, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { useSession } from "next-auth/react";

/**
 * Home component - serves as the landing page for the application.
 * Displays logos for different sections of the app and links to login and register pages
 * if the user is not authenticated.
 *
 * @returns {JSX.Element} The Home component UI.
 */
const Home = () => {
	const { status } = useSession();
	return (
		<>
			<Container
				maxWidth={false}
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "55vh",
					background: "white",
				}}
			>
				<Box
					sx={{ marginBottom: "30px", display: "flex", flexDirection: "row" }}
				>
					<Box
						sx={{
							marginRight: "40px",
						}}
					>
						<Link
							href="/mibisens"
							passHref
						>
							<Image
								src="/MibiSens_Logo.png"
								width={440}
								height={420}
								alt="Logo"
							/>
						</Link>
					</Box>
					{status === "authenticated" ? null : (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								marginRight: "40px",
							}}
						>
							<Link href="/login">
								<Paper
									sx={{
										backgroundColor: "orange",
										color: "black",
										borderRadius: "10px",
										padding: "10px 20px",
										fontSize: "20px",
										fontWeight: "bold",
										display: "flex",
										alignItems: "center",
										boxShadow: "0 0 0 rgba(0, 0, 0, 1)",
										marginBottom: "20px",
									}}
									variant="variant"
								>
									<LockOpenIcon />
									Login
								</Paper>
							</Link>
							<Link href="/register">
								<Paper
									sx={{
										backgroundColor: "orange",
										color: "black",
										borderRadius: "10px",
										padding: "10px 20px",
										fontSize: "20px",
										fontWeight: "bold",
										display: "flex",
										alignItems: "center",
										boxShadow: "0 0 0 rgba(0, 0, 0, 1)",
									}}
									variant="variant"
								>
									<PersonAddAltOutlinedIcon />
									Register
								</Paper>
							</Link>
						</Box>
					)}
					<Link
						href="/mibigro"
						passHref
					>
						<Image
							src="/MibiGro_Logo.png"
							width={450}
							height={420}
							alt="Logo"
						/>
					</Link>
				</Box>
			</Container>
		</>
	);
};

export default Home;
