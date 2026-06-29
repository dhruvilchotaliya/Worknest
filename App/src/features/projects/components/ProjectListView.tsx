import { Box, Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { useCallback } from "react";
import VirtuosoTable from "../../../components/common/tables/VirtuosoTable";
import type { TableColumnDef } from "../../../components/common/tables/VirtuosoTable";
import type { DashboardProject } from "../types/project.types";
import Typography from "../../../components/common/display/Typography";
import FolderSharedIcon from "@mui/icons-material/FolderShared";

type ProjectListViewProps = {
	projects: DashboardProject[];
};

const getCategoryBadgeClass = (category: string) => {
	switch (category) {
		case "Engineering":
			return "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50";
		case "Design":
			return "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50";
		case "Marketing":
			return "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/50";
		case "Operations":
			return "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50";
		default:
			return "bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700/50";
	}
};

const getAvatarStyle = (initials: string) => {
	const colors = [
		{ bg: "#3b82f6", text: "#ffffff" },
		{ bg: "#06b6d4", text: "#ffffff" },
		{ bg: "#f97316", text: "#ffffff" },
		{ bg: "#8b5cf6", text: "#ffffff" },
		{ bg: "#ec4899", text: "#ffffff" },
		{ bg: "#10b981", text: "#ffffff" },
	];
	let hash = 0;
	for (let i = 0; i < initials.length; i++) {
		hash = initials.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % colors.length;
	return colors[index];
};

export const ProjectListView = ({ projects }: ProjectListViewProps) => {
	const columns: TableColumnDef<DashboardProject>[] = [
		{
			field: "name",
			headerName: "Project",
			flex: 1.5,
			renderCell: (row) => (
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
						<FolderSharedIcon sx={{ fontSize: 18, color: "#64748b" }} />
					</div>
					<div className="flex flex-col">
						<Typography component="body2" testId="project-list-name" className="font-semibold text-slate-900 dark:text-slate-50">
							{row.name}
						</Typography>
						{row.code && (
							<Typography component="caption" testId="project-list-code" className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
								{row.code}
							</Typography>
						)}
					</div>
				</div>
			),
		},
		{
			field: "category",
			headerName: "Category",
			width: 120,
			renderCell: (row) => {
				const cat = row.category ?? "Uncategorized";
				return (
					<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getCategoryBadgeClass(cat)}`}>
						{cat}
					</span>
				);
			},
		},
		{
			field: "progress",
			headerName: "Progress",
			width: 200,
			renderCell: (row) => {
				const prog = row.progress ?? 0;
				return (
					<div className="flex items-center gap-3 w-full pr-4">
						<div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
							<div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${prog}%` }} />
						</div>
						<span className="text-xs font-bold text-slate-900 dark:text-slate-50">{prog}%</span>
					</div>
				);
			},
		},
		{
			field: "status",
			headerName: "Status",
			width: 120,
			renderCell: (row) => {
				let color = "bg-slate-100 dark:bg-slate-800/40 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700/50";
				if (row.status === "Active") color = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50";
				if (row.status === "OnHold") color = "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50";
				if (row.status === "Completed") color = "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-900/50";
				if (row.status === "Cancelled") color = "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/50";

				const label = row.status === "OnHold" ? "On Hold" : row.status;
				return (
					<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${color}`}>
						{label}
					</span>
				);
			},
		},
		{
			field: "dueDate",
			headerName: "Due Date",
			width: 140,
			renderCell: (row) => (
				<Typography component="body2" testId="project-list-due-date" className="text-slate-500 dark:text-slate-400 font-sans text-xs">
					{row.dueDate || "-"}
				</Typography>
			),
		},
		{
			field: "members",
			headerName: "Members",
			width: 150,
			sortable: false,
			renderCell: (row) => (
				<Box className="flex items-center" >
					{row.members && row.members.length > 0 ? (
						<AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: "0.65rem", fontWeight: 700, border: "2px solid", borderColor: "background.paper" } }}>
							{row.members.map((m) => {
								const initials = (m.name || "") + (m.surname || "");
								const style = getAvatarStyle(initials);
								return (
									<Tooltip key={m.id} title={initials}>
										<Avatar sx={{ bgcolor: style.bg, color: style.text }}>{initials}</Avatar>
									</Tooltip>
								);
							})}
						</AvatarGroup>
					) : (
						<Typography component="caption" testId="project-list-no-members" className="text-slate-400 dark:text-slate-500 font-sans">
							None
						</Typography>
					)}
				</Box>
			),
		},
	];

	const getItems = useCallback(
		async (top: number, skip: number) => {
			return {
				data: projects.slice(skip, skip + top),
				totalRowCount: projects.length,
			};
		},
		[projects]
	);

	return (
		<Box className="w-full h-[calc(100vh-320px)] min-h-[500px] pb-8">
			<VirtuosoTable<DashboardProject>
				columns={columns}
				getItems={getItems}
				testId="projects-list-table"
				autoRowHeight
			/>
		</Box>
	);
};
