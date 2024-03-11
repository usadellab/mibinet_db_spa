"use client";

import { useState } from "react";
import { axios_auth } from "@/utils/helper";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import PasswordField from "@/components/password-field";

/**
 * A registration form component that allows new users to sign up.
 */
const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [communityCode, setCommunityCode] = useState("");
	const correctCommunityCode = "mibisens&mibigro";
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (communityCode !== correctCommunityCode) {
			enqueueSnackbar("Incorrect community code.", {
				variant: "error",
			});
			return;
		}
		if (password !== confirmPassword) {
			enqueueSnackbar("Passwords don't match.", {
				variant: "error",
			});
			return;
		}

		try {
			const response = await axios_auth.post("/registration/", {
				username,
				email,
				password1: password,
				password2: confirmPassword,
			});

			console.log(response.data);

			if (response.status === 201) {
				console.log("Registration successful");
				enqueueSnackbar("Registration successful!", {
					variant: "success",
				});

				// login automatically
				const response = await signIn("credentials", {
					username,
					password,
					redirect: false,
				});
				if (response.ok) {
					enqueueSnackbar("Login Successfully", { variant: "success" });
					router.push("/");
				} else {
					console.error("Login failed", response);
					enqueueSnackbar("Login failed! Please try again!", {
						variant: "error",
					});
					router.push("/login");
				}
			} else {
				console.error("Registration failed");
				console.log(response);
				enqueueSnackbar(`Registration failed! Please check!`, {
					variant: "error",
				});
			}
		} catch (error) {
			console.error("There was an error registering");
			console.log(error);
			enqueueSnackbar("Registration error!", {
				variant: "error",
			});
		}
	};

	return (
		<Container maxWidth="xs">
			<Box
				sx={{
					marginTop: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography
					component="h1"
					variant="h5"
				>
					Registration Form
				</Typography>
				<Box
					component="form"
					onSubmit={handleSubmit}
					noValidate
					sx={{ mt: 1 }}
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
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						label="Email Address"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<PasswordField
						label="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						helperText="Password must contain at least 8 characters."
						autoComplete="new-password"
					/>
					<PasswordField
						label="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						helperText="Please confirm your password."
						autoComplete="new-password"
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						label="Community Code"
						value={communityCode}
						onChange={(e) => setCommunityCode(e.target.value)}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 5 }}
					>
						Register
					</Button>
				</Box>
			</Box>
		</Container>
	);
};

export default Register;
