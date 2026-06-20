import { Box } from "@mui/material";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import Typography from "../../../components/common/display/Typography";

export const ProjectsHeader = () => {
	return (
		<Box className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 mb-5">
			<Typography
				component="overline"
				testId="projects-eyebrow"
				className="text-indigo-600 font-semibold tracking-widest flex items-center gap-1.5 uppercase text-xs mb-1"
			>
				<FolderSharedIcon sx={{ fontSize: 14 }} />
				Workspace
			</Typography>
			<Typography
				component="h2"
				testId="projects-heading"
				className="text-2xl font-semibold text-slate-900 leading-tight mb-1"
			>
				Projects
			</Typography>
			<Typography
				component="body2"
				testId="projects-description"
				className="text-slate-500 max-w-2xl text-sm leading-relaxed"
			>
				Manage and track all your projects. Collaborate with your team, set milestones, and monitor progress in real-time.
			</Typography>
		</Box>
	);
};
