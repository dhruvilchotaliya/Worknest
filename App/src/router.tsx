import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./features/auth/LoginPage";
import { AppLayout } from "./components/layout/AppLayout";

// Pages
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { HomePage } from "./features/home/HomePage";
import { ProjectsPage } from "./features/projects/ProjectsPage";
import { TasksPage } from "./features/tasks/TasksPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { ProfilePage } from "./features/profile/ProfilePage";
import { EmployeesPage } from "./features/employees/EmployeesPage";

export const router = createBrowserRouter([
	// Root — redirect to login
	{
		path: "/",
		element: <Navigate to="/auth/login" replace />,
	},

	// Auth
	{
		path: "/auth/login",
		element: <LoginPage />,
	},

	// App shell — all protected pages share AppLayout
	{
		path: "/app",
		element: <AppLayout />,
		children: [
			// Default: /app → /app/home
			{
				index: true,
				element: <Navigate to="/app/home" replace />,
			},

			// Home (replaces legacy /app/dashboard as primary landing)
			{ path: "home", element: <HomePage /> },

			// Legacy dashboard route — keep working to avoid breaking bookmarks
			{ path: "dashboard", element: <DashboardPage /> },

			// Main navigation pages
			{ path: "projects", element: <ProjectsPage /> },
			{ path: "tasks", element: <TasksPage /> },
			{ path: "settings", element: <SettingsPage /> },
			{ path: "profile", element: <ProfilePage /> },
			{ path: "employees", element: <EmployeesPage /> },
		],
	},
]);
