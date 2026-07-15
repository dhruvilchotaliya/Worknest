import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError, type AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

type AuthenticationContextState = {

	/**
	 * If the authentication provider is currently in the process of loading the current user
	 */
	initialised: boolean;

	/**
	 * Provides the current account information if the user is signed in.
	 */
	account?: AccountInfo;

    /**
     * Acquires an access token for a specific set of scopes.
     * Handles silent acquisition, redirects for consent, and claim challenges automatically.
     * @param scopes - The array of scopes for the target API.
     * @param claims - Optional claims string for handling CAE challenges.
     * @param authority - Optional authority string to target a specific tenant.
     */
    getAccessToken: (scopes: string[], claims?: string, authority?: string) => Promise<string>;

	/**
	 * Signs the user in and
	 */
	signIn: () => Promise<void>;

	/**
	 * Signs the user out and clears the session.
	 */
	signOut: () => Promise<void>;

	/**
	 * Sets the current account information.
	 * @param account - The account information to set.
	 */
	setAccount: (account: AccountInfo) => void;

	registerFlushRoute: (fn: (reason: "interval" | "logout") => Promise<void>) => void;
}

const AuthenticationContext = createContext<AuthenticationContextState>({
    initialised: false,
    getAccessToken: () => Promise.resolve(''),
    signIn: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
    setAccount: () => {},
	registerFlushRoute: (_fn: (reason: "interval" | "logout") => Promise<void>) => {}
});

export const AuthenticationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { instance, accounts, inProgress } = useMsal();
	const [account, setAccountState] = useState<AccountInfo | undefined>(() => {
		return instance.getActiveAccount() || accounts[0];
	});

	// Sync account state with MSAL instance's active account or the first available account
	useEffect(() => {
		const active = instance.getActiveAccount() || accounts[0];
		setAccountState(active);
	}, [accounts, instance]);

	const initialised = inProgress === InteractionStatus.None;

	const flushRoutesRef = useRef<Array<(reason: "interval" | "logout") => Promise<void>>>([]);

	const registerFlushRoute = useCallback((fn: (reason: "interval" | "logout") => Promise<void>) => {
		flushRoutesRef.current.push(fn);
	}, []);

	const flushRegisteredRoutes = useCallback(async (reason: "interval" | "logout") => {
		const promises = flushRoutesRef.current.map(async (fn) => {
			try {
				await fn(reason);
			} catch (error) {
				console.error(`Error executing registered flush route for reason: ${reason}`, error);
			}
		});
		await Promise.all(promises);
	}, []);

	// Background interval to flush routes with reason "interval" every 5 minutes
	useEffect(() => {
		const active = instance.getActiveAccount() || accounts[0];
		if (!active) return;

		const intervalId = setInterval(() => {
			flushRegisteredRoutes("interval");
		}, 5 * 60 * 1000);

		return () => clearInterval(intervalId);
	}, [instance, accounts, flushRegisteredRoutes]);

	const getAccessToken = useCallback(
		async (scopes: string[], claims?: string, authority?: string): Promise<string> => {
			const currentAccount = instance.getActiveAccount() || accounts[0];
			if (!currentAccount) {
				throw new Error("No active account found. Please sign in.");
			}

			try {
				const response = await instance.acquireTokenSilent({
					scopes,
					claims,
					account: currentAccount,
					authority,
				});
				return response.accessToken;
			} catch (error) {
				if (error instanceof InteractionRequiredAuthError) {
					// Fallback to interaction if silent acquisition fails
					await instance.acquireTokenRedirect({
						scopes,
						claims,
						account: currentAccount,
						authority,
					});
				}
				throw error;
			}
		},
		[instance, accounts]
	);

	const signIn = useCallback(async () => {
		await instance.loginRedirect(loginRequest);
	}, [instance]);

	const signOut = useCallback(async () => {
		await flushRegisteredRoutes("logout");
		await instance.logoutRedirect();
	}, [instance, flushRegisteredRoutes]);

	const setAccount = useCallback((newAccount: AccountInfo) => {
		instance.setActiveAccount(newAccount);
		setAccountState(newAccount);
	}, [instance]);

	return (
		<AuthenticationContext.Provider
			value={{
				initialised,
				account,
				getAccessToken,
				signIn,
				signOut,
				setAccount,
				registerFlushRoute,
			}}
		>
			{children}
		</AuthenticationContext.Provider>
	);
};

export default AuthenticationContext;

