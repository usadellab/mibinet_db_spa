"use client";

import { useState, useEffect } from "react";
import MainHeader from "./main-header";
import { usePathname, useRouter } from "next/navigation";
import MibiSensSidebar from "./mibisens-sidebar";
import MibiGroSidebar from "./mibigro-sidebar";
import Footer from "./footer";
import { Divider } from "@mui/material";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { axios_mibisens } from "@/utils/helper";
import { useSnackbar } from "notistack";

/**
 * Layout component that wraps the main content of the application, providing a consistent structure.
 * It dynamically includes sidebars based on the current route and manages authentication state.
 *
 * @param {React.ReactNode} children - Children elements to be rendered inside the main content area.
 * @returns {JSX.Element} The layout structure of the application.
 */
const Layout = ({ children }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const { data: session, status } = useSession();
	const router = useRouter();
	const currentRoute = usePathname();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const includeSidebar =
		currentRoute.includes("/mibisens") || currentRoute.includes("/mibigro");
	const icon = currentRoute.includes("/mibisens")
		? "/MibiNet_Icon.ico"
		: currentRoute.includes("mibigro")
		? "/MibiGro_Favicon.png"
		: "/MibiDB.png";

	// Redirects to login page if the user is unauthenticated and tries to access a protected route
	useEffect(() => {
		if (status === "unauthenticated" && includeSidebar) {
			enqueueSnackbar("Please sign in...", { variant: "info" });
			router.push("/login");
		}
	}, [status, includeSidebar]);

	const appBarHeight = 64;

	const mainContentStyle = {
		marginTop: `${appBarHeight}px`,
		flex: 1,
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// Handles session expiration and sets the authorization header for outgoing requests
	useEffect(() => {
		if (session?.error === "RefreshTokenExpired") {
			enqueueSnackbar("Token Expired. Please sign in.", { variant: "info" });
			signOut();
		} else {
			const axiosInterceptor = axios_mibisens.interceptors.request.use(
				(config) => {
					const token = session?.accessToken;
					if (token) {
						config.headers.Authorization = `Bearer ${token}`;
					}
					return config;
				},
				(error) => Promise.reject(error)
			);

			return () => {
				axios_mibisens.interceptors.request.eject(axiosInterceptor);
			};
		}
	}, [session]);

	return (
		<>
			{includeSidebar ? (
				<div>
					<MainHeader
						icon={icon}
						toggleSidebar={toggleSidebar}
					/>
					<div style={{ display: "flex", flexDirection: "row" }}>
						{isSidebarOpen ? (
							<div>
								{currentRoute.includes("/mibisens") ? (
									<MibiSensSidebar />
								) : currentRoute.includes("/mibigro") ? (
									<MibiGroSidebar />
								) : null}
							</div>
						) : null}

						<main style={{ ...mainContentStyle, width: "55%" }}>
							{children}
						</main>
					</div>
				</div>
			) : (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					<MainHeader />
					<main style={{ ...mainContentStyle }}>{children}</main>
					<Divider />
					<Footer />
				</div>
			)}
		</>
	);
};

export default Layout;
