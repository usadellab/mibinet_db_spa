"use client";

import { useState } from "react";
import { Button, TextField, Box, Container } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSnackbar } from "notistack";
import PasswordField from "@/components/password-field";

/**
 * Login component to authenticate users.
 * Redirects authenticated users to the home page and provides a form for login.
 */
const Login = () => {
	const { status } = useSession();
	// Redirect authenticated users to the homepage
	if (status === "authenticated") {
		redirect("/");
	}
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await signIn("credentials", {
			username,
			password,
			redirect: false,
		});
		if (response.ok) {
			enqueueSnackbar("Login Successfully", { variant: "success" });
		} else {
			console.error("Login failed", response);
			enqueueSnackbar("Login failed! Please check!", { variant: "error" });
			setUsername("");
			setPassword("");
		}
	};

	return (
		<Container
			component="main"
			maxWidth="xs"
		>
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<form
					onSubmit={handleSubmit}
					noValidate
				>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						label="Username"
						autoComplete="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<PasswordField
						label="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						helperText="Password must contain at least 8 characters."
						autoComplete="current-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 10 }}
					>
						Sign In
					</Button>
				</form>
			</Box>
		</Container>
	);
};

export default Login;
