import { Box } from "@mui/material";
import { useState, useContext } from "react";
import { ProjectToolbar, type ViewMode } from "./components/ProjectToolbar";
import { ProjectTileGrid } from "./components/ProjectTileGrid";
import { ProjectListView } from "./components/ProjectListView";
import { ModalContext } from "../../components/common/utils/ModalContext";
import { CreateProjectModalContent } from "./components/CreateProjectModal";
import Typography from "../../components/common/display/Typography";

// Data & Types
import { mockProjects } from "./data/mockProjects";
import { useProjectFilters, type ProjectSortField, type ProjectSortDirection } from "./utils/projectFilters";

export const ProjectsPage = () => {
	const { open } = useContext(ModalContext);

	// State
	const [viewMode, setViewMode] = useState<ViewMode>("tile");
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("All");
	const [sortField, setSortField] = useState<ProjectSortField>("createdAt");
	const [sortDirection, setSortDirection] = useState<ProjectSortDirection>("desc");

	// Filtered & Sorted Projects
	const filteredProjects = useProjectFilters(
		mockProjects,
		searchQuery,
		categoryFilter,
		sortField,
		sortDirection
	);

	const handleOpenCreateModal = () => {
		open({
			header: (
				<Typography component="h5" testId="create-project-title" className="font-bold text-lg">
					Create New Project
				</Typography>
			),
			content: <CreateProjectModalContent />,
			size: "md",
			testId: "create-project",
		});
	};

	// Dynamic stats summary
	const activeCount = mockProjects.filter((p) => p.status === "Active").length;
	const categoriesCount = new Set(mockProjects.map((p) => p.category).filter(Boolean)).size;
	const summaryText = `${activeCount} active across ${categoriesCount} categories`;

	return (
		<Box component="section" className="p-6 max-w-screen-2xl mx-auto w-full flex flex-col bg-slate-100 dark:bg-slate-950 min-h-screen">
			{/* Simple modern header directly on background */}
			<Box className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
				<Box className="flex flex-col">
					<Typography
						component="overline"
						testId="projects-eyebrow"
						className="text-slate-400 font-semibold tracking-wider uppercase text-[10px] mb-0.5"
					>
						Workspace
					</Typography>
					<Typography
						component="h3"
						testId="projects-heading"
						className="font-bold text-slate-950 dark:text-white leading-tight"
					>
						Projects
					</Typography>
				</Box>
				<Typography
					component="body2"
					testId="projects-summary"
					className="text-slate-500 text-sm font-medium mt-1 sm:mt-0 self-start sm:self-auto"
				>
					{summaryText}
				</Typography>
			</Box>

			<ProjectToolbar
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				categoryFilter={categoryFilter}
				setCategoryFilter={setCategoryFilter}
				sortField={sortField}
				setSortField={setSortField}
				sortDirection={sortDirection}
				setSortDirection={setSortDirection}
				viewMode={viewMode}
				setViewMode={setViewMode}
				onNewProject={handleOpenCreateModal}
			/>

			{viewMode === "tile" ? (
				<ProjectTileGrid projects={filteredProjects} />
			) : (
				<ProjectListView projects={filteredProjects} />
			)}
		</Box>
	);
};
