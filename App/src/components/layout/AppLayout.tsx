import { Outlet, useLocation, Navigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";
import AuthenticationContext from "../../context/AuthenticationContext";
import { useEmployee } from "../../hooks/useEmployee";
import { loginRequest } from "../../authConfig";

export function AppLayout() {
	const location = useLocation();
	const { account, initialised, getAccessToken } = useContext(AuthenticationContext);
	const { getMe } = useEmployee();
	const [hasProfile, setHasProfile] = useState<boolean | null>(null);

	useEffect(() => {
		if (!initialised || !account) return;

		getMe()
			.then(async (profile) => {
				if (profile.requiresTenantSwitch) {
					console.log("AppLayout: Switching to tenant context...");
					const tenantId = import.meta.env.VITE_AZURE_TENANT_ID || "";
					const targetAuthority = `https://login.microsoftonline.com/${tenantId}`;
					try {
						await getAccessToken(loginRequest.scopes, undefined, targetAuthority);
					} catch (err) {
						console.error("AppLayout: Failed to acquire tenant-specific token", err);
					}
				}
				setHasProfile(true);
			})
			.catch((error: any) => {
				const status = error.problemDetails?.status || error.status;
				if (status === 404) {``
					setHasProfile(false);
				} else {
					setHasProfile(true);
				}
			});
	}, [account, initialised, getMe, getAccessToken]);

	if (!initialised) {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-500 font-semibold text-sm">
				Loading authentication...
			</div>
		);
	}

	if (!account) {
		return <Navigate to="/auth/login" replace />;
	}

	if (hasProfile === false) {
		return <Navigate to="/auth/register" replace />;
	}

	if (hasProfile === null) {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-500 font-semibold text-sm">
				Verifying user profile...
			</div>
		);
	}

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
			<Sidebar />

			<div className="flex flex-col flex-1 h-full overflow-hidden">
				<TopNavbar />
				<main
					id="app-main-content"
					aria-label="Page content"
					className="flex-1 h-full overflow-y-auto relative flex flex-col"
				>
					<div key={location.pathname} className="animate-fade-in-up w-full min-h-full flex flex-col flex-1">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
