import { Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "../../components/common/display/Typography";

export const HomePage = () => {
	return (
		<Box component="section" className="p-6 sm:p-8 max-w-5xl">
			{/* Page eyebrow */}
			<Typography
				component="overline"
				testId="home-eyebrow"
				className="text-indigo-500 font-semibold tracking-widest mb-1 flex items-center gap-1.5"
			>
				<HomeIcon sx={{ fontSize: 14 }} />
				Workspace
			</Typography>

			<Typography
				component="h2"
				testId="home-heading"
				className="text-3xl font-bold text-slate-900 mb-3"
			>
				Home
			</Typography>

			<Typography
				component="body1"
				testId="home-description"
				className="text-slate-500 mb-8 max-w-xl"
			>
				Welcome to WorkNest. Get an overview of your recent activity, upcoming
				deadlines, and key workspace metrics.
			</Typography>

			{/* Placeholder stat cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{[
					{ label: "Active Projects", value: "12", color: "bg-indigo-50 border-indigo-100" },
					{ label: "Open Tasks", value: "47", color: "bg-emerald-50 border-emerald-100" },
					{ label: "Team Members", value: "8", color: "bg-violet-50 border-violet-100" },
				].map((stat) => (
					<div
						key={stat.label}
						className={`rounded-2xl border p-5 ${stat.color} transition-shadow duration-200 hover:shadow-md`}
					>
						<Typography
							component="caption"
							testId={`home-stat-label-${stat.label}`}
							className="text-slate-500 text-xs font-semibold uppercase tracking-widest"
						>
							{stat.label}
						</Typography>
						<Typography
							component="h3"
							testId={`home-stat-value-${stat.label}`}
							className="text-4xl font-extrabold text-slate-800 mt-2"
						>
							{stat.value}
						</Typography>
					</div>
				))}
			</div>
		</Box>
	);
};
