import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import type { Employee } from "../types/employee";
import Avatar from "../../../components/common/display/Avatar";
import Typography from "../../../components/common/display/Typography";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a deterministic HSL colour for a given string. */
const avatarColour = (name: string): string => {
	const palette = [
		"#4f6ef7",
		"#7c5cbf",
		"#e0756a",
		"#3aab87",
		"#e09c35",
		"#5c9fde",
		"#c45e9f",
		"#6ab04c",
	];
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
	return palette[Math.abs(hash) % palette.length];
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EmployeeListProps = {
	employees: Employee[];
	selectedId: string | null;
	searchQuery: string;
	onSelect: (employee: Employee) => void;
	onSearchChange: (query: string) => void;
};

// ---------------------------------------------------------------------------
// EmployeeRow (internal)
// ---------------------------------------------------------------------------

type EmployeeRowProps = {
	employee: Employee;
	isSelected: boolean;
	onSelect: (employee: Employee) => void;
};

const EmployeeRow = ({ employee, isSelected, onSelect }: EmployeeRowProps) => {
	const initials = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();
	const colour = avatarColour(employee.fullName);

	return (
		<Box
			component="li"
			onClick={() => onSelect(employee)}
			data-testid={`employee-row-${employee.id}`}
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				px: 1.5,
				py: 1.25,
				cursor: "pointer",
				borderRadius: "8px",
				bgcolor: isSelected ? "rgba(79, 110, 247, 0.08)" : "transparent",
				border: "1px solid",
				borderColor: isSelected ? "rgba(79, 110, 247, 0.25)" : "transparent",
				transition: "background-color 0.15s ease, border-color 0.15s ease",
				"&:hover": {
					bgcolor: isSelected ? "rgba(79, 110, 247, 0.1)" : "rgba(0,0,0,0.04)",
				},
				listStyle: "none",
			}}
		>
			{/* Avatar */}
			<Avatar
				initials={initials}
				sx={{ bgcolor: colour, width: 36, height: 36, fontSize: 13, fontWeight: 700, flexShrink: 0 }}
				testId={`employee-avatar-${employee.id}`}
			/>

			{/* Name + position */}
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography
					component="body2"
					testId={`employee-name-${employee.id}`}
					style={{
						fontWeight: 600,
						fontSize: "0.8125rem",
						color: "#1e293b",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					{employee.fullName}
				</Typography>
				<Typography
					component="caption"
					testId={`employee-position-${employee.id}`}
					style={{
						color: "#64748b",
						fontSize: "0.75rem",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						display: "block",
					}}
				>
					{employee.position}
				</Typography>
			</Box>

			{/* Department chip */}
			<Box
				sx={{
					flexShrink: 0,
					px: 1,
					py: 0.25,
					borderRadius: "4px",
					bgcolor: "rgba(79, 110, 247, 0.07)",
					border: "1px solid rgba(79, 110, 247, 0.15)",
				}}
			>
				<Typography
					component="caption"
					testId={`employee-dept-${employee.id}`}
					style={{ color: "#4f6ef7", fontSize: "0.6875rem", fontWeight: 600 }}
				>
					{employee.department}
				</Typography>
			</Box>
		</Box>
	);
};

// ---------------------------------------------------------------------------
// EmployeeList
// ---------------------------------------------------------------------------

const EmployeeList = ({
	employees,
	selectedId,
	searchQuery,
	onSelect,
	onSearchChange,
}: EmployeeListProps) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				minHeight: 0,
			}}
		>
			{/* Search */}
			<Box sx={{ px: 1, pb: 1.5, flexShrink: 0 }}>
				<OutlinedInput
					fullWidth
					size="small"
					placeholder="Search the directory..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					inputProps={{ "data-testid": "employee-search-input" }}
					startAdornment={
						<InputAdornment position="start">
							<SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
						</InputAdornment>
					}
					sx={{
						borderRadius: "8px",
						bgcolor: "#fff",
						fontSize: "0.8125rem",
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: "#e2e8f0",
						},
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: "#cbd5e1",
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "#4f6ef7",
						},
					}}
				/>
			</Box>

			{/* List */}
			<Box
				component="ul"
				sx={{
					flex: 1,
					overflowY: "auto",
					display: "flex",
					flexDirection: "column",
					gap: 0.5,
					m: 0,
					p: "0 4px",
					listStyle: "none",
				}}
				data-testid="employee-list"
			>
				{employees.length === 0 ? (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							py: 8,
							gap: 1,
						}}
						data-testid="employee-list-empty"
					>
						<Typography
							component="body1"
							testId="employee-list-empty-msg"
							style={{ color: "#94a3b8", fontSize: "0.875rem" }}
						>
							No employees found
						</Typography>
						<Typography
							component="caption"
							testId="employee-list-empty-sub"
							style={{ color: "#cbd5e1", fontSize: "0.75rem" }}
						>
							Try a different search term
						</Typography>
					</Box>
				) : (
					employees.map((emp) => (
						<EmployeeRow
							key={emp.id}
							employee={emp}
							isSelected={emp.id === selectedId}
							onSelect={onSelect}
						/>
					))
				)}
			</Box>
		</Box>
	);
};

export default EmployeeList;
