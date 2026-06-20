import { useMemo, useEffect } from "react";
import { Box, Button as MuiButton } from "@mui/material";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import heroImage from "../../assets/login_hero.png";
import Avatar from "../../components/common/display/Avatar";
import { Card, CardBody, CardHeader } from "../../components/common/display/Card";
import { useNavigate } from "react-router";

const LoginPage = () => {
	const { instance, accounts } = useMsal();
	const isAuthenticated = useIsAuthenticated();
	const navigate = useNavigate();

	useEffect(() => {
		console.log("authenticated !!!", isAuthenticated)

		if (isAuthenticated) {
			navigate("/app/home", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleLogin = () => {
		instance.loginRedirect(loginRequest).catch((error) => {
			console.error("MSAL Login Redirect failed:", error);
		});
	};

	const handleLogout = () => {
		instance.logoutRedirect().catch((error) => {
			console.error("MSAL Logout Redirect failed:", error);
		});
	};

	const handleEnterWorkspace = () => {
		window.location.assign("/app/home");
	};

	// Helper to extract initials for the user profile avatar
	const userInitials = useMemo(() => {
		if (accounts.length === 0) return "WN";
		const name = accounts[0].name ?? "";
		const email = accounts[0].username ?? "";
		
		const parts = name.trim().split(/\s+/);
		if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		if (parts[0]) {
			return parts[0].slice(0, 2).toUpperCase();
		}
		return email.slice(0, 2).toUpperCase();
	}, [accounts]);


	return (
		<Box className="min-h-screen bg-slate-950 text-slate-950 overflow-hidden">
			<section className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
				{/* Left Hero Section with modern glowing gradient background & illustrations */}
				<div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-slate-950 p-8 lg:min-h-screen lg:p-16">
					{/* Glowing mesh background */}
					<div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-indigo-600/30 blur-[120px] pointer-events-none" />
					<div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-violet-600/25 blur-[120px] pointer-events-none" />
					
					{/* Fine tech grid pattern */}
					<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] pointer-events-none" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(99,102,241,0.22),transparent_40%)] pointer-events-none" />

					{/* Top Logo / Brand mark */}
					<div className="relative z-10 flex items-center gap-2.5">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
							<span className="text-sm font-black text-white tracking-wider">WN</span>
						</div>
						<span className="text-sm font-semibold tracking-wider uppercase text-slate-200">
							WorkNest App
						</span>
					</div>

					{/* Hero Image Container */}
					<div className="relative my-auto flex items-center justify-center py-10 z-10">
						<div className="relative group">
							{/* Background ambient glow matching the image */}
							<div className="absolute -inset-4 rounded-full bg-indigo-500/10 blur-xl opacity-75 transition duration-1000 group-hover:opacity-100" />
							<img
								src={heroImage}
								alt="Modern workspace illustration"
								className="relative h-64 w-64 object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out hover:scale-105 sm:h-80 sm:w-80 lg:h-[400px] lg:w-[400px]"
							/>
						</div>
					</div>

					{/* Bottom text copy */}
					<div className="relative z-10 text-white">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/25">
							Enterprise Grade Authentication
						</span>
						<h1 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl text-slate-100">
							Connect to your seamless modern workspace.
						</h1>
						<p className="mt-3 max-w-sm text-sm text-slate-400">
							Collaborate, automate, and build within our secure single sign-on cloud environment.
						</p>
					</div>
				</div>

				{/* Right Sign-in/Authenticated Section */}
				<div className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(145deg,#f1f5f9_0%,#f8fafc_50%,#e2e8f0_100%)] px-4 py-12 sm:px-8">
					{/* Accent background glows */}
					<div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none" />
					<div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-indigo-100/50 blur-[100px] pointer-events-none" />

					<Card
						testId="login-card"
						variant="elevation"
						elevation={0}
						fullWidth
						className="w-full max-w-[440px] rounded-2xl border border-slate-200/60 bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(37,99,235,0.08)]"
					>
						<CardHeader
							testId="login-card-header"
							title={
								<span className="text-2xl font-bold tracking-tight text-slate-900 animate-fade-in">
									{isAuthenticated ? "Welcome back" : "Welcome back"}
								</span>
							}
							subheader={
								<span className="text-sm font-medium text-slate-500">
									{isAuthenticated 
										? "You have successfully signed in using corporate single sign-on."
										: "Please sign in with your corporate account to continue."
									}
								</span>
							}
							avatar={
								<Avatar
									testId="login-brand-avatar"
									initials={userInitials}
									tooltip={isAuthenticated ? accounts[0].name : "WorkNest"}
									size="lg"
									sx={{
										bgcolor: isAuthenticated ? "#10b981" : "#2563eb",
										boxShadow: isAuthenticated 
											? "0 8px 24px rgba(16,185,129,0.25)"
											: "0 8px 24px rgba(37,99,235,0.25)",
										transition: "all 0.3s ease",
									}}
								/>
							}
							paddingX={28}
							paddingY={28}
						/>

						<CardBody testId="login-card-body" className="px-7 pb-8 pt-0">
							{isAuthenticated ? (
								/* Authenticated UI State */
								<div className="flex flex-col gap-6">
									<div className="flex flex-col items-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 backdrop-blur-sm">
										<span className="text-base font-bold text-slate-800">
											{accounts[0].name}
										</span>
										<span className="text-xs font-semibold text-slate-400 mt-1 select-all">
											{accounts[0].username}
										</span>
										
										{/* Active session status badge */}
										<div className="mt-4 flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
											<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
											Active MSAL Session
										</div>
									</div>

									<div className="flex flex-col gap-3">
										<MuiButton
											data-testid="enter-workspace-button"
											type="button"
											variant="contained"
											fullWidth
											className="flex h-[48px] items-center justify-center rounded-lg bg-indigo-600 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0"
											onClick={handleEnterWorkspace}
										>
											Enter Workspace
										</MuiButton>

										<MuiButton
											data-testid="logout-button"
											type="button"
											variant="outlined"
											fullWidth
											className="flex h-[48px] items-center justify-center rounded-lg border border-slate-200 bg-white font-semibold text-slate-500 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
											onClick={handleLogout}
										>
											Sign out
										</MuiButton>
									</div>
								</div>
							) : (
								/* Unauthenticated UI State */
								<div className="flex flex-col gap-6">
									{/* Official Microsoft Sign-in Button */}
									<MuiButton
										id="microsoft"
										name="microsoft"
										data-testid="login-microsoft-button"
										type="button"
										variant="outlined"
										fullWidth
										className="relative flex h-[52px] items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-6 font-['Segoe_UI',_SegoeUI,_system-ui,_sans-serif] text-base font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0"
										onClick={handleLogin}
										startIcon={
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="21"
												height="21"
												viewBox="0 0 21 21"
												className="mr-1.5"
											>
												<rect x="1" y="1" width="9" height="9" fill="#f25022" />
												<rect x="11" y="1" width="9" height="9" fill="#7fba00" />
												<rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
												<rect x="11" y="11" width="9" height="9" fill="#ffb900" />
											</svg>
										}
									>
										Sign in with Microsoft
									</MuiButton>
									
									<div className="text-center">
										<p className="text-xs text-slate-400">
											Protected by active OAuth2 verification policies.
										</p>
									</div>
								</div>
							)}
						</CardBody>
					</Card>
				</div>
			</section>
		</Box>
	);
};

export default LoginPage;
