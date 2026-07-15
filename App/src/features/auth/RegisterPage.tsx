import { useMemo, useState, useEffect } from "react";
import { Box, Button as MuiButton, CircularProgress } from "@mui/material";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import heroImage from "../../assets/login_hero.png";
import Avatar from "../../components/common/display/Avatar";
import { Card, CardBody, CardHeader } from "../../components/common/display/Card";
import { useNavigate } from "react-router";
import TextInput from "../../components/common/inputs/TextInput";
import SelectInput from "../../components/common/inputs/SelectInput";
import DateInput from "../../components/common/inputs/DateInput";
import NumberInput from "../../components/common/inputs/NumberInput";
import { useEmployee } from "../../hooks/useEmployee";
import { POSITION_OPTIONS, WORK_MODEL_OPTIONS } from "../../models/core/Employee";

const RegisterPage = () => {
	const { accounts } = useMsal();
	const isAuthenticated = useIsAuthenticated();
	const navigate = useNavigate();
	const { onboard } = useEmployee();

	const [surname, setSurname] = useState("");
	const [position, setPosition] = useState<string>("");
	const [experience, setExperience] = useState<number | undefined>(undefined);
	const [phone, setPhone] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(undefined);
	const [bio, setBio] = useState("");
	const [workModel, setWorkModel] = useState<string>("");

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/auth/login", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const currentAccount = accounts[0];
	const name = currentAccount?.name ?? "";
	const email = currentAccount?.username ?? "";

	const userInitials = useMemo(() => {
		if (!name) return "WN";
		const parts = name.trim().split(/\s+/);
		if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		if (parts[0]) {
			return parts[0].slice(0, 2).toUpperCase();
		}
		return "WN";
	}, [name]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!surname.trim() || position === "") {
			setErrorMessage("Surname and Job Title/Position are required.");
			return;
		}

		setIsSubmitting(true);
		setErrorMessage("");

		try {
			const result = await onboard({
				surname: surname.trim(),
				position: Number(position),
				teamId: null,
				experienceInYears: experience !== undefined ? Number(experience) : null,
				phoneNumber: phone.trim() || null,
				dateOfBirth: dateOfBirth || null,
				bio: bio.trim() || null,
				workModel: workModel !== "" ? Number(workModel) : null,
			});

			if (result.requiresRedemption && result.inviteRedeemUrl) {
				window.location.href = result.inviteRedeemUrl;
				return;
			}

			// Successfully registered, navigate to App Dashboard
			navigate("/app/home", { replace: true });
		} catch (error: any) {
			console.error("Registration error:", error);
			setErrorMessage(
				error.problemDetails?.detail ||
				error.message ||
				"An unexpected error occurred during registration. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Box className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white overflow-hidden">
			<section className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
				{/* Left Hero Section (identical mesh glow theme) */}
				<div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-slate-950 p-8 lg:min-h-screen lg:p-16">
					<div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-indigo-600/30 blur-[120px] pointer-events-none" />
					<div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-violet-600/25 blur-[120px] pointer-events-none" />
					
					<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] pointer-events-none" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(99,102,241,0.22),transparent_40%)] pointer-events-none" />

					<div className="relative z-10 flex items-center gap-2.5">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
							<span className="text-sm font-black text-white tracking-wider">WN</span>
						</div>
						<span className="text-sm font-semibold tracking-wider uppercase text-slate-200">
							WorkNest App
						</span>
					</div>

					<div className="relative my-auto flex items-center justify-center py-10 z-10">
						<div className="relative group">
							<div className="absolute -inset-4 rounded-full bg-indigo-500/10 blur-xl opacity-75 transition duration-1000 group-hover:opacity-100" />
							<img
								src={heroImage}
								alt="Modern workspace illustration"
								className="relative h-64 w-64 object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out hover:scale-105 sm:h-80 sm:w-80 lg:h-[360px] lg:w-[360px]"
							/>
						</div>
					</div>

					<div className="relative z-10 text-white">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/25">
							Profile Setup
						</span>
						<h1 className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl text-slate-100">
							Complete your profile registration.
						</h1>
						<p className="mt-3 max-w-sm text-sm text-slate-400">
							Just a few more details to set up your corporate account and welcome you to the nest.
						</p>
					</div>
				</div>

				{/* Right Registration Form Section */}
				<div className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(145deg,#f1f5f9_0%,#f8fafc_50%,#e2e8f0_100%)] px-4 py-8 sm:px-8 overflow-y-auto">
					<div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none" />
					<div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-indigo-100/50 blur-[100px] pointer-events-none" />

					<Card
						testId="register-card"
						variant="elevation"
						elevation={0}
						fullWidth
						className="w-full max-w-[580px] rounded-xl border-0 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(124,58,237,0.4)] my-8"
					>
						<CardHeader
							testId="register-card-header"
							title={
								<span className="text-2xl font-bold tracking-tight text-slate-900">
									Onboarding Form
								</span>
							}
							subheader={
								<span className="text-sm font-medium text-slate-500">
									Please complete your professional info.
								</span>
							}
							avatar={
								<Avatar
									testId="register-avatar"
									initials={userInitials}
									tooltip={name}
									size="lg"
									sx={{
										bgcolor: "#2563eb",
										boxShadow: "0 8px 24px rgba(37,99,235,0.25)",
									}}
								/>
							}
							paddingX={28}
							paddingY={28}
						/>

						<CardBody testId="register-card-body" className="px-7 pb-8 pt-0">
							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								{errorMessage && (
									<div className="p-4 text-sm font-medium text-white bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
										{errorMessage}
									</div>
								)}

								{/* Prefilled Fields Grid */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<TextInput
										label="First Name"
										value={name.split(" ")[0] || ""}
										displayMode="readonly"
										testId="register-first-name"
									/>
									<TextInput
										label="Corporate Email"
										value={email}
										displayMode="readonly"
										testId="register-email"
									/>
								</div>

								{/* Surname & Position */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<TextInput
										label="Surname / Last Name"
										value={surname}
										setValue={setSurname}
										required
										testId="register-surname"
									/>
									<SelectInput
										label="Job Title / Position"
										value={position}
										setValue={setPosition}
										options={POSITION_OPTIONS}
										required
										testId="register-position"
									/>
								</div>

								{/* Phone & Date of Birth */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<TextInput
										label="Phone Number"
										value={phone}
										setValue={setPhone}
										placeholder="+1 (555) 000-0000"
										testId="register-phone"
									/>
									<DateInput
										label="Date of Birth"
										value={dateOfBirth}
										setValue={setDateOfBirth}
										testId="register-dob"
									/>
								</div>

								{/* Experience & Work Model */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<NumberInput
										label="Experience (in years)"
										value={experience}
										setValue={setExperience}
										min={0}
										max={50}
										testId="register-experience"
									/>
									<SelectInput
										label="Work Setup Preference"
										value={workModel}
										setValue={setWorkModel}
										options={WORK_MODEL_OPTIONS}
										testId="register-workmodel"
									/>
								</div>

								{/* Bio / About Me */}
								<TextInput
									label="About Me / Professional Bio"
									value={bio}
									setValue={setBio}
									placeholder="Tell us about yourself..."
									testId="register-bio"
									style={{ width: "100%" }}
								/>

								<div className="mt-4 flex flex-col gap-3">
									<MuiButton
										data-testid="submit-registration-button"
										type="submit"
										variant="contained"
										fullWidth
										disabled={isSubmitting}
										className="flex h-[48px] items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5"
										sx={{
											"&.Mui-disabled": {
												background: "linear-gradient(to right, #4f46e5, #7c3aed)",
												color: "white !important",
												opacity: 0.7,
											}
										}}
									>
										{isSubmitting ? (
											<div className="flex items-center gap-2 text-white">
												<CircularProgress size={20} color="inherit" />
												<span className="text-white">Registering...</span>
											</div>
										) : (
											<span className="text-white">Submit Registration</span>
										)}
									</MuiButton>
								</div>
							</form>
						</CardBody>
					</Card>
				</div>
			</section>
		</Box>
	);
};

export default RegisterPage;
