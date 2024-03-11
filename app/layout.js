import "./globals.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import ClientProvider from "@/layout/client-provider";

export const metadata = {
	title: "MibiNet DB",
	// description: "",
};

export default async function RootLayout({ children }) {
	const session = await getServerSession(authOptions);
	return (
		<html lang="en">
			<body>
				<ClientProvider session={session}>{children}</ClientProvider>
			</body>
		</html>
	);
}
