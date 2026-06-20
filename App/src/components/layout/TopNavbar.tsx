import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import IconButton from "../common/buttons/IconButton";
import Typography from "../common/display/Typography";
import UserProfileMenu from "../UserProfileMenu";

// ---------------------------------------------------------------------------
// WorkNest brand logo mark
// ---------------------------------------------------------------------------

const WorkNestLogo = () => (
	<div className="flex items-center gap-2.5 select-none">
		{/* Logo mark: rounded square with stylised "W" */}
		<div
			aria-hidden="true"
			className="flex h-8 w-8 items-center justify-center rounded-lg shadow-md"
			style={{
				background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
				boxShadow: "0 4px 12px rgba(79,70,229,0.35)",
			}}
		>
			<span className="text-[13px] font-black text-white tracking-wider leading-none">
				W
			</span>
		</div>

		{/* Brand name */}
		<Typography
			component="h6"
			testId="topnav-brand-name"
			className="font-bold text-slate-900 tracking-tight text-base leading-none"
		>
			WorkNest
		</Typography>
	</div>
);

// ---------------------------------------------------------------------------
// TopNavbar
// ---------------------------------------------------------------------------

/** Unread notification count — replace with real data source when available. */
const UNREAD_NOTIFICATIONS = 3;

const TopNavbar = () => {
	const navigate = useNavigate();

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
				"bg-white/90 backdrop-blur-md",
				"border-b border-slate-200/80",
				"shadow-[0_1px_8px_rgba(0,0,0,0.04)]",
			].join(" ")}
		>
			{/* Right — actions */}
			<div className="flex items-center gap-1.5">
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
					className="mx-1 h-6 w-px bg-slate-200 rounded-full"
				/>

				{/* User profile dropdown */}
				<UserProfileMenu />
			</div>
		</header>
	);
};

export default TopNavbar;
