"use client";

import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import Layout from "./layout";

/**
 * Wraps the application with various providers for session, theming, notifications, and external scripts.
 *
 * @param {Object} session - The session object provided by next-auth.
 * @param {React.ReactNode} children - The child components wrapped by ClientProvider.
 *
 * @returns {JSX.Element} A component that wraps the application with session, theme, and notification providers.
 */
const ClientProvider = ({ children, session }) => {
	const theme = createTheme();
	return (
		<>
			{/* Load the 3Dmol.js library before the application becomes interactive */}
			<Script
				src="https://3Dmol.org/build/3Dmol-min.js"
				strategy="beforeInteractive"
			/>
			{/* Provide session management across the application */}
			<SessionProvider
				session={session}
				refetchInterval={60}
				refetchOnWindowFocus={true}
			>
				<ThemeProvider theme={theme}>
					{/* Provide a context for managing snackbars (toasts) */}
					<SnackbarProvider
						maxSnack={1}
						anchorOrigin={{
							vertical: "top",
							horizontal: "center",
						}}
					>
						{/* The main layout wrapper for the application */}
						<Layout>{children}</Layout>
					</SnackbarProvider>
				</ThemeProvider>
			</SessionProvider>
		</>
	);
};
export default ClientProvider;
