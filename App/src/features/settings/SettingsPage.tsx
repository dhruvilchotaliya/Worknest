import { Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Typography from "../../components/common/display/Typography";

const sections = [
	{ title: "General", description: "App language, region, and display preferences." },
	{ title: "Security", description: "Password, two-factor authentication, and active sessions." },
	{ title: "Notifications", description: "Email and in-app notification preferences." },
	{ title: "Integrations", description: "Connected services, webhooks, and API keys." },
];

export const SettingsPage = () => {
	return (
		<Box component="section" className="p-6 sm:p-8 max-w-5xl">
			<Typography
				component="overline"
				testId="settings-eyebrow"
				className="text-indigo-500 font-semibold tracking-widest mb-1 flex items-center gap-1.5"
			>
				<SettingsIcon sx={{ fontSize: 14 }} />
				Configuration
			</Typography>

			<Typography
				component="h2"
				testId="settings-heading"
				className="text-3xl font-bold text-slate-900 mb-3"
			>
				Settings
			</Typography>

			<Typography
				component="body1"
				testId="settings-description"
				className="text-slate-500 mb-8 max-w-xl"
			>
				Configure your workspace preferences, security options, and integrations.
			</Typography>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{sections.map((s) => (
					<div
						key={s.title}
						className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
					>
						<div className="flex items-center gap-2 mb-2">
							<SettingsIcon
								sx={{
									fontSize: 18,
									color: "#6366f1",
									transition: "transform 0.3s",
								}}
								className="group-hover:rotate-45"
							/>
							<Typography
								component="subtitle1"
								testId={`settings-section-${s.title}`}
								className="font-semibold text-slate-800"
							>
								{s.title}
							</Typography>
						</div>
						<Typography
							component="body2"
							testId={`settings-section-desc-${s.title}`}
							className="text-slate-500 text-sm"
						>
							{s.description}
						</Typography>
					</div>
				))}
			</div>
		</Box>
	);
};
