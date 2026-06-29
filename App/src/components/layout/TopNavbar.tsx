import { useCallback, useContext } from "react";
import { useNavigate } from "react-router";
import IconButton from "../common/buttons/IconButton";
import UserProfileMenu from "../UserProfileMenu";
import ThemeContext from "../../context/ThemeContext";
import Tooltip from "@mui/material/Tooltip";

import { SunMoonIcon } from "../../icons/SunMoonIcon";

// ---------------------------------------------------------------------------
// TopNavbar
// ---------------------------------------------------------------------------

/** Unread notification count — replace with real data source when available. */
const UNREAD_NOTIFICATIONS = 3;

const TopNavbar = () => {
	const navigate = useNavigate();
	const { isDark, toggleTheme } = useContext(ThemeContext);

	const handleNotificationsClick = useCallback(() => {
		navigate("/app/notifications");
	}, [navigate]);

	return (
		<header
			id="app-topnavbar"
			aria-label="Top navigation bar"
			className={[
				"w-full z-30",
				"flex items-center justify-end",
				"h-14 px-4 sm:px-6",
				"bg-white/90 dark:bg-slate-900/90 backdrop-blur-md",
				"border-b border-slate-200/80 dark:border-slate-800/80",
				"shadow-[0_1px_8px_rgba(0,0,0,0.04)]",
			].join(" ")}
		>
			{/* Right — actions */}
			<div className="flex items-center gap-1.5">
				{/* Dark/Light Theme Toggle */}
				<Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow>
					<button
						id="topnav-theme-toggle-btn"
						data-testid="topnav-theme-toggle-btn"
						type="button"
						onClick={(e) => toggleTheme(e)}
						className={[
							"relative flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-300 cursor-pointer focus:outline-none",
							isDark
								? "bg-indigo-950/70 text-amber-400 border border-indigo-500/30 shadow-[inset_0_3px_5px_rgba(0,0,0,0.7),0_0_8px_rgba(99,102,241,0.2)] scale-95 translate-y-[1px]"
								: "bg-slate-50 text-slate-500 border border-slate-200 shadow-sm hover:bg-slate-100 hover:text-slate-800"
						].join(" ")}
					>
						<SunMoonIcon className="h-5 w-5" />
					</button>
				</Tooltip>

				{/* Notification icon with badge */}
				<IconButton
					id="topnav-notifications-btn"
					testId="topnav-notifications-btn"
					icon="Notifications"
					aria-label="Notifications"
					tooltip="Notifications"
					badgeContent={UNREAD_NOTIFICATIONS > 0 ? UNREAD_NOTIFICATIONS : undefined}
					badgeColor="error"
					onClick={handleNotificationsClick}
					className="text-slate-500 hover:text-indigo-600 transition-colors"
				/>

				{/* Thin vertical divider */}
				<span
					aria-hidden="true"
					className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-800 rounded-full"
				/>

				{/* User profile dropdown */}
				<UserProfileMenu />
			</div>
		</header>
	);
};

export default TopNavbar;
