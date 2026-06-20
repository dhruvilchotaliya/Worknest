import { Outlet } from "react-router";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

/**
 * AppLayout
 *
 * Composes the full shell:
 *   ┌─────────────────────────────────────┐
 *   │          TopNavbar (fixed h-14)      │
 *   ├───────────┬─────────────────────────┤
 *   │  Sidebar  │     <Outlet />           │
 *   │(collaps.) │  (scrollable content)   │
 *   └───────────┴─────────────────────────┘
 */
export function AppLayout() {
	return (
		<div className="flex h-screen w-screen overflow-hidden bg-slate-50">
			{/* Left sidebar: full height of the viewport */}
			<Sidebar />

			{/* Right column: navbar + scrollable main content area */}
			<div className="flex flex-col flex-1 h-full overflow-hidden">
				{/* Top bar (sits to the right of the sidebar) */}
				<TopNavbar />

				{/* Main scrollable content area */}
				<main
					id="app-main-content"
					aria-label="Page content"
					className="flex-1 overflow-y-auto"
				>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
