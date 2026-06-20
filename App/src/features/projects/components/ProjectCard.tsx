import { Box, Avatar, AvatarGroup, Tooltip, IconButton } from "@mui/material";
import { Card } from "../../../components/common/display/Card";
import Typography from "../../../components/common/display/Typography";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import type { DashboardProject } from "../types/project.types";

type ProjectCardProps = {
	project: DashboardProject;
};

const getCategoryBadgeClass = (category: string) => {
	switch (category) {
		case "Engineering":
			return "bg-blue-50 text-blue-600 border-blue-100";
		case "Design":
			return "bg-purple-50 text-purple-600 border-purple-100";
		case "Marketing":
			return "bg-orange-50 text-orange-600 border-orange-100";
		case "Operations":
			return "bg-green-50 text-green-600 border-green-100";
		default:
			return "bg-slate-50 text-slate-600 border-slate-100";
	}
};

const getAvatarStyle = (initials: string) => {
	const colors = [
		{ bg: "#3b82f6", text: "#ffffff" }, // blue
		{ bg: "#06b6d4", text: "#ffffff" }, // cyan
		{ bg: "#f97316", text: "#ffffff" }, // orange
		{ bg: "#8b5cf6", text: "#ffffff" }, // purple
		{ bg: "#ec4899", text: "#ffffff" }, // pink
		{ bg: "#10b981", text: "#ffffff" }, // green
	];
	let hash = 0;
	for (let i = 0; i < initials.length; i++) {
		hash = initials.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % colors.length;
	return colors[index];
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
	const progress = project.progress ?? 0;
	const category = project.category ?? "Uncategorized";

	const dateDisplay = project.dueDate || new Date(project.createdAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});

	return (
		<Card
			variant="outlined"
			hoverEffect="pop"
			testId={`project-card-${project.id}`}
			className="p-5 flex flex-col justify-between h-full bg-white group !rounded-2xl !border-slate-200/80"
		>
			{/* Top Bar: Category Pill & Three dots menu */}
			<Box className="flex items-center justify-between mb-4">
				<span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(category)}`}>
					{category}
				</span>
				<IconButton 
					size="small" 
					className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 !p-1"
					data-testid="project-card-menu-btn"
				>
					<MoreHorizIcon sx={{ fontSize: 18 }} />
				</IconButton>
			</Box>

			{/* Project Name & Description */}
			<Box className="flex flex-col flex-1 mb-5">
				<Typography 
					component="h5"
					style={{ fontSize: "1.5rem", fontWeight: 600 }} 
					testId="project-card-title"
					className="font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1"
				>
					{project.name}
				</Typography>
				<Typography 
					component="body2" 
					testId="project-card-description"
					className="text-slate-500 text-sm leading-relaxed line-clamp-2"
				>
					{project.description || "No description provided."}
				</Typography>
			</Box>

			{/* Progress Area */}
			<Box className="w-full">
				<div className="flex justify-between items-center mb-1.5">
					<span className="text-xs font-semibold text-slate-500">Progress</span>
					<span className="text-xs font-bold text-slate-900">{progress}%</span>
				</div>
				<div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
					<div 
						className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
						style={{ width: `${progress}%` }} 
					/>
				</div>
			</Box>

			{/* Footer: Members & Date */}
			<Box className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
				<Box>
					{project.members && project.members.length > 0 ? (
						<AvatarGroup 
							max={5} 
							sx={{ 
								'& .MuiAvatar-root': { 
									width: 26, 
									height: 26, 
									fontSize: '0.7rem', 
									fontWeight: 700,
									border: '2px solid white' 
								} 
							}}
						>
							{project.members.map((m) => {
								const initials = (m.name || "") + (m.surname || "");
								const style = getAvatarStyle(initials);
								return (
									<Tooltip key={m.id} title={initials}>
										<Avatar sx={{ bgcolor: style.bg, color: style.text }}>
											{initials}
										</Avatar>
									</Tooltip>
								);
							})}
						</AvatarGroup>
					) : (
						<Typography component="caption" testId="project-card-no-members" className="text-slate-400">
							No members
						</Typography>
					)}
				</Box>
				<Typography 
					component="caption"
					testId="project-card-due-date" 
					className="text-xs font-semibold text-slate-400 font-sans"
				>
					{dateDisplay}
				</Typography>
			</Box>
		</Card>
	);
};
