import { type Configuration } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_MSAL_CLIENT_ID || "";
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID || "";

export const msalConfig: Configuration = {
	auth: {
		clientId,
		authority: `https://login.microsoftonline.com/${tenantId}`,
		redirectUri: window.location.origin,
		postLogoutRedirectUri: window.location.origin,
	},
	cache: {
		cacheLocation: "sessionStorage",
		storeAuthStateInCookie: false,
	},
};

export const loginRequest = {
	scopes: ["openid", "profile", "email", import.meta.env.VITE_API_SCOPE || ""],
};