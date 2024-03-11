import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { axios_auth } from "@/utils/helper";
const NEXTAUTH_SECRET = String(process.env.NEXTAUTH_SECRET ?? "");

export const authOptions = {
	secret: NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24,
	},
	pages: {
		signIn: "/login",
	},
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Username and Password",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				const res = await axios_auth.post("/login/", credentials);
				if (
					res?.data?.user &&
					res?.data?.access &&
					res?.data?.refresh &&
					res?.data?.access_expiration &&
					res?.data?.refresh_expiration
				) {
					return {
						...res.data.user,
						access: res.data.access,
						refresh: res.data.refresh,
						accessTokenExpiry: res.data.access_expiration,
						refreshTokenExpiry: res.data.refresh_expiration,
					};
				}
				// Return null if user data could not be retrieved
				return null;
			},
		}),
	],
	callbacks: {
		// This callback updates the token with custom user details after successful authentication
		async jwt({ token, user, account, trigger }) {
			if (account && user) {
				token.accessToken = user.access;
				token.refreshToken = user.refresh;
				token.username = user.username;
				token.roles = user.roles;
				token.accessTokenExpiry = new Date(user.accessTokenExpiry).getTime();
				token.refreshTokenExpiry = new Date(user.refreshTokenExpiry).getTime();
			}
			// Handle token expiration and attempt to refresh if possible
			const now = Date.now();
			if (token.accessTokenExpiry && now > token.accessTokenExpiry) {
				if (token.refreshTokenExpiry && now < token.refreshTokenExpiry) {
					// refresh token
					const response = await axios_auth.post("/token/refresh/", {
						refresh: token.refreshToken,
					});
					if (response.data?.access) {
						token.accessToken = response.data.access;
						token.refreshToken = response.data.refresh;
						token.accessTokenExpiry = new Date(
							response.data.access_expiration
						).getTime();
						token.refreshTokenExpiry = new Date(
							response.data.refresh_expiration
						).getTime();
					}
				} else {
					console.log("RefreshTokenExpired");
					return { ...token, error: "RefreshTokenExpired" };
				}
			}
			return token;
		},

		// This callback updates the session object with custom user details and token information
		async session({ session, token }) {
			if (token && token.accessToken) {
				session.accessToken = token.accessToken;
				session.refreshToken = token.refreshToken;
				session.expires = new Date(token.accessTokenExpiry);

				if (token.error) {
					session.error = token.error;
				}
				if (token.username) {
					session.user.username = token.username;
					delete session.user.name;
				}
				if (token.roles) {
					session.user.roles = token.roles;
				}
				delete session.user?.image;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
