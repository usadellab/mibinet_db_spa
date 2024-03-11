import axios from "axios";

const MIBISENS_URL = String(process.env.NEXT_PUBLIC_MIBISENS_URL ?? "");
const AUTH_URL = String(process.env.NEXT_PUBLIC_AUTH_URL ?? "");

// Creates an axios instance for the MibiSens API segment with a predefined base URL.
const axios_mibisens = axios.create({
	baseURL: MIBISENS_URL,
});

// Creates an axios instance for authentication-related API calls with a predefined base URL.
const axios_auth = axios.create({
	baseURL: AUTH_URL,
});

/**
 * A fetcher function that uses the axios_mibisens instance to make GET requests.
 * It's designed to be used with SWR for data fetching.
 *
 * @param {string} url - The URL path to append to the axios_mibisens baseURL for the GET request.
 * @returns {Promise<any>} - The data from the response.
 */
const fetcher = async (url) => {
	const response = await axios_mibisens.get(url);
	return response.data;
};
export { axios_mibisens, fetcher, axios_auth };
