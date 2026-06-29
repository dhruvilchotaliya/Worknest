import { useState, useMemo, useCallback, useContext } from "react";
import { Box } from "@mui/material";
import Typography from "../../components/common/display/Typography";
import Button from "../../components/common/buttons/Button";
import WorknestSidebar from "../../components/common/layout/WorknestSidebar";
import ThemeContext from "../../context/ThemeContext";

import EmployeeList from "./components/EmployeeList";
import EmployeeDetails from "./components/EmployeeDetails";
import AddEmployeeForm from "./components/AddEmployeeForm";

import { mockEmployees } from "./data/mockEmployees";
import type { Employee, NewEmployeeFormData } from "./types/employee";

// ---------------------------------------------------------------------------
// EmployeesPage
// ---------------------------------------------------------------------------

export const EmployeesPage = () => {
	const { isDark } = useContext(ThemeContext);

	// ── State ──────────────────────────────────────────────────────────────
	const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee>(mockEmployees[0]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// ── Derived: filtered list (search does NOT reset selected employee) ───
	const filteredEmployees = useMemo(() => {
		if (!searchQuery.trim()) return employees;
		const q = searchQuery.toLowerCase();
		return employees.filter((emp) => emp.fullName.toLowerCase().includes(q));
	}, [employees, searchQuery]);

	// ── Handlers ───────────────────────────────────────────────────────────
	const handleSelectEmployee = useCallback((emp: Employee) => {
		setSelectedEmployee(emp);
	}, []);

	const handleOpenSidebar = useCallback(() => setSidebarOpen(true), []);
	const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

	const handleAddEmployee = useCallback(
		(data: NewEmployeeFormData) => {
			const newEmployee: Employee = {
				id: `emp-${Date.now()}`,
				firstName: data.firstName,
				lastName: data.lastName,
				fullName: `${data.firstName} ${data.lastName}`,
				email: data.email,
				phone: data.phone,
				department: data.department,
				position: data.position,
				location: data.location,
				avatarUrl: undefined,
				activeProjects: [],
				directTeam: [],
			};

			setEmployees((prev) => [newEmployee, ...prev]);
			setSelectedEmployee(newEmployee);
			setSidebarOpen(false);
		},
		[],
	);

	// ── Render ─────────────────────────────────────────────────────────────
	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				p: 3,
				gap: 0,
				bgcolor: isDark ? "#020617" : "#f1f5f9",
				transition: "background-color 0.3s ease",
			}}
			data-testid="employees-page"
		>
			{/* ── Page header ────────────────────────────────────────────── */}
			<Box
				sx={{
					display: "flex",
					alignItems: "flex-end",
					justifyContent: "space-between",
					mb: 2.5,
					flexWrap: "wrap",
					gap: 1,
				}}
			>
				<Box>
					<Typography
						component="overline"
						testId="employees-eyebrow"
						style={{
							fontSize: "0.625rem",
							fontWeight: 700,
							letterSpacing: "0.1em",
							color: isDark ? "#64748b" : "#94a3b8",
							textTransform: "uppercase",
							display: "block",
						}}
					>
						Directory
					</Typography>
					<Typography
						component="h3"
						testId="employees-heading"
						style={{ fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", lineHeight: 1.2 }}
					>
						Employees
					</Typography>
				</Box>

				<Button
					label="Add Employee"
					variant="contained"
					icon="PersonAdd"
					onClick={handleOpenSidebar}
					testId="add-employee-btn"
				/>
			</Box>

			{/* ── Two-column layout ──────────────────────────────────────── */}
			<Box
				sx={{
					display: "flex",
					flex: 1,
					gap: 2.5,
					minHeight: 0,
					flexDirection: { xs: "column", md: "row" },
				}}
			>
				{/* LEFT — Employee list */}
				<Box
					sx={{
						width: { xs: "100%", md: 420 },
						flexShrink: 0,
						display: "flex",
						flexDirection: "column",
						bgcolor: isDark ? "#0f172a" : "#fff",
						border: "1px solid",
						borderColor: isDark ? "#1e293b" : "#e2e8f0",
						borderRadius: "12px",
						p: 1.5,
						minHeight: { xs: 360, md: 0 },
						// Constrain height so the list itself scrolls
						maxHeight: { xs: 420, md: "none" },
						overflow: "hidden",
						transition: "background-color 0.3s ease, border-color 0.3s ease",
					}}
					data-testid="employee-list-panel"
				>
					<EmployeeList
						employees={filteredEmployees}
						selectedId={selectedEmployee?.id ?? null}
						searchQuery={searchQuery}
						onSelect={handleSelectEmployee}
						onSearchChange={setSearchQuery}
					/>
				</Box>

				{/* RIGHT — Employee details */}
				<Box
					sx={{
						flex: 1,
						minWidth: 0,
						minHeight: { xs: 520, md: 0 },
					}}
					data-testid="employee-details-wrapper"
				>
					<EmployeeDetails employee={selectedEmployee} />
				</Box>
			</Box>

			{/* ── Add Employee sidebar ────────────────────────────────────── */}
			<WorknestSidebar
				open={sidebarOpen}
				title="Add Employee"
				onClose={handleCloseSidebar}
				width={480}
				testId="add-employee-sidebar"
			>
				<AddEmployeeForm onSave={handleAddEmployee} onCancel={handleCloseSidebar} />
			</WorknestSidebar>
		</Box>
	);
};
