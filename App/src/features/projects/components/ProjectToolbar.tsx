import { Box, TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ToggleButtonGroup, { type ToggleOption } from "../../../components/common/inputs/ToggleButtonGroup";
import SelectInput, { type SelectOption } from "../../../components/common/inputs/SelectInput";
import type { ProjectSortField, ProjectSortDirection } from "../utils/projectFilters";

export type ViewMode = "tile" | "list";

type ProjectToolbarProps = {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	categoryFilter: string;
	setCategoryFilter: (category: string) => void;
	sortField: ProjectSortField;
	setSortField: (field: ProjectSortField) => void;
	sortDirection: ProjectSortDirection;
	setSortDirection: (dir: ProjectSortDirection) => void;
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
	onNewProject: () => void;
};

const categoryOptions: SelectOption[] = [
	{ value: "All", label: "All Categories" },
	{ value: "Engineering", label: "Engineering" },
	{ value: "Design", label: "Design" },
	{ value: "Marketing", label: "Marketing" },
	{ value: "Operations", label: "Operations" },
];

const sortOptions: SelectOption[] = [
	{ value: "createdAt", label: "Recently updated" },
	{ value: "name", label: "Name" },
];

const viewModeOptions: ToggleOption<ViewMode>[] = [
	{ value: "tile", label: "Tile", icon: "GridView" as any },
	{ value: "list", label: "List", icon: "List" as any },
];

export const ProjectToolbar = ({
	searchQuery,
	setSearchQuery,
	categoryFilter,
	setCategoryFilter,
	sortField,
	setSortField,
	setSortDirection,
	viewMode,
	setViewMode,
	onNewProject,
}: ProjectToolbarProps) => {

	const handleSortChange = (value: string) => {
		setSortField(value as ProjectSortField);
		if (value === "createdAt") {
			setSortDirection("desc");
		} else {
			setSortDirection("asc");
		}
	};

	return (
		<Box 
			className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between"
		>
			<Box className="flex-1 min-w-0">
				<TextField
					size="small"
					fullWidth
					placeholder="Search by name..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" sx={{ color: 'text.secondary', ml: 0.5 }} />
								</InputAdornment>
							),
							sx: { 
								borderRadius: '12px', 
								backgroundColor: '#f8fafc', 
								height: '40px',
								border: '1px',
								'& fieldset': { border: 'none' },
								'&:hover fieldset': { border: 'none' },
								'&.Mui-focused fieldset': { border: 'none' },
							}
						}
					}}
				/>
			</Box>

			{/* Right side: filter dropdowns, toggle, create button */}
			<Box className="flex flex-wrap md:flex-nowrap gap-3 items-center justify-start md:justify-end">
				{/* Category dropdown */}
				<Box sx={{ width: { xs: '100%', sm: '160px' }, '& .MuiFormControl-root': { mb: '0 !important' } }}>
					<SelectInput
						id="project-category-filter"
						label=""
						value={categoryFilter}
						setValue={setCategoryFilter}
						options={categoryOptions}
						testId="project-category-select"
						className="[&_.MuiOutlinedInput-root]:!rounded-xl [&_.MuiOutlinedInput-root]:!bg-white [&_.MuiOutlinedInput-notchedOutline]:!border-slate-200 [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-slate-300 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-blue-500 [&_.MuiSelect-select]:!py-2 [&_.MuiSelect-select]:!h-6 [&_.MuiSelect-select]:!flex [&_.MuiSelect-select]:!items-center"
					/>
				</Box>

				{/* Sort dropdown */}
				<Box sx={{ width: { xs: '100%', sm: '200px' }, '& .MuiFormControl-root': { mb: '0 !important' } }}>
					<SelectInput
						id="project-sort"
						label=""
						value={sortField}
						setValue={handleSortChange}
						options={sortOptions}
						testId="project-sort-select"
						className="[&_.MuiOutlinedInput-root]:!rounded-xl [&_.MuiOutlinedInput-root]:!bg-white [&_.MuiOutlinedInput-notchedOutline]:!border-slate-200 [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-slate-300 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-blue-500 [&_.MuiSelect-select]:!py-2 [&_.MuiSelect-select]:!h-6 [&_.MuiSelect-select]:!flex [&_.MuiSelect-select]:!items-center"
					/>
				</Box>

				{/* Grid/List toggle */}
				<ToggleButtonGroup
					value={viewMode}
					onChange={(val) => val && setViewMode(val)}
					options={viewModeOptions}
					testId="project-view-toggle"
					size="small"
					textTransform="none"
					className="!bg-slate-100 !rounded-xl !p-1 [&_.MuiToggleButton-root]:!rounded-lg [&_.MuiToggleButton-root]:!py-1 [&_.MuiToggleButton-root]:!px-2.5"
				/>

				{/* Create Project button */}
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					onClick={onNewProject}
					data-testid="create-project-button"
					disableElevation
					className="!bg-blue-600 hover:!bg-blue-700"
					sx={{ 
						borderRadius: '12px', 
						textTransform: 'none', 
						px: 2.5, 
						height: '40px', 
						fontWeight: 600,
						fontSize: '0.875rem', 
						whiteSpace: 'nowrap',
						boxShadow: 'none',
						width: { xs: '100%', sm: 'auto' }
					}}
				>
					Create Project
				</Button>
			</Box>
		</Box>
	);
};
