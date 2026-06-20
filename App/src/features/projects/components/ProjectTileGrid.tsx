import { Box } from "@mui/material";
import { ProjectCard } from "./ProjectCard";
import type { DashboardProject } from "../types/project.types";
import Typography from "../../../components/common/display/Typography";

type ProjectTileGridProps = {
	projects: DashboardProject[];
};

export const ProjectTileGrid = ({ projects }: ProjectTileGridProps) => {
	if (projects.length === 0) {
		return (
			<Box className="py-20 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
				<Typography component="h3" testId="no-projects-heading" className="text-slate-600 font-semibold mb-1">
					No projects found
				</Typography>
				<Typography component="body2" testId="no-projects-subtext" className="text-slate-400 text-center max-w-sm">
					Try adjusting your search or filters to find what you're looking for.
				</Typography>
			</Box>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} />
			))}
		</div>
	);
};
