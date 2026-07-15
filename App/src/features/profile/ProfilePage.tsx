import { useMemo, useState, useContext } from "react";
import { Box, Divider } from "@mui/material";
import Avatar from "../../components/common/display/Avatar";
import Typography from "../../components/common/display/Typography";
import AuthenticationContext from "../../context/AuthenticationContext";
import Icon from "../../components/common/display/Icon";

function getInitials(name: string, email: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}
	if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
	return email.slice(0, 2).toUpperCase();
}

export const ProfilePage = () => {
	const { account } = useContext(AuthenticationContext);

	const displayName = account?.name ?? "WorkNest User";
	const email = account?.username ?? "user@example.com";
	const roles = (account?.idTokenClaims as Record<string, unknown>)?.roles as string[] | undefined;
	const roleLabel = roles?.[0] ?? "Member";

	const [isEditing, setIsEditing] = useState(false);
	const [editedName, setEditedName] = useState(displayName);
	const [editedEmail, setEditedEmail] = useState(email);
	const [editedRole, setEditedRole] = useState(roleLabel);
	const [editedTenant, setEditedTenant] = useState(account?.tenantId ?? "—");

	const initials = useMemo(
		() => getInitials(editedName, editedEmail),
		[editedName, editedEmail]
	);

	const handleSave = () => {
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedName(displayName);
		setEditedEmail(email);
		setEditedRole(roleLabel);
		setEditedTenant(account?.tenantId ?? "—");
		setIsEditing(false);
	};

	return (
		<Box 
			component="section" 
			className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[80vh] w-full"
		>
			<div className="w-full max-w-xl flex flex-col items-start mb-4">
				<Typography
					component="overline"
					testId="profile-eyebrow"
					className="text-indigo-500 font-semibold tracking-widest mb-1 flex items-center gap-1.5"
				>
					<Icon icon="Person" sx={{ fontSize: 14 }} />
					Account
				</Typography>

				<div className="flex w-full items-center justify-between">
					<Typography
						component="h2"
						testId="profile-heading"
						className="text-xl font-bold text-slate-800 dark:text-slate-100"
					>
						My Profile
					</Typography>

					{!isEditing ? (
						<button
							onClick={() => setIsEditing(true)}
							className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 transition-all shadow-md cursor-pointer"
						>
							<Icon icon="Edit" sx={{ fontSize: 14 }} />
							Edit
						</button>
					) : (
						<div className="flex gap-2">
							<button
								onClick={handleSave}
								className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 transition-all shadow-md cursor-pointer"
							>
								<Icon icon="Save" sx={{ fontSize: 14 }} />
								Save
							</button>
							<button
								onClick={handleCancel}
								className="flex items-center gap-1.5 rounded-lg bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-1.5 transition-all shadow-md cursor-pointer"
							>
								<Icon icon="Close" sx={{ fontSize: 14 }} />
								Cancel
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="w-full max-w-xl flex items-center gap-5 mb-6 p-6 rounded-2xl border bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/80 shadow-md">
				<Avatar
					testId="profile-avatar"
					initials={initials}
					size="lg"
					sx={{ bgcolor: "#4f46e5", fontSize: "1.2rem", fontWeight: 700 }}
				/>
				<div className="flex-1">
					{isEditing ? (
						<div className="flex flex-col gap-2">
							<input
								type="text"
								value={editedName}
								onChange={(e) => setEditedName(e.target.value)}
								className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
								placeholder="Full Name"
							/>
							<input
								type="email"
								value={editedEmail}
								onChange={(e) => setEditedEmail(e.target.value)}
								className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
								placeholder="Email"
							/>
						</div>
					) : (
						<>
							<Typography
								component="h5"
								testId="profile-name"
								className="font-bold text-slate-900 dark:text-slate-100"
							>
								{editedName}
							</Typography>
							<Typography
								component="body2"
								testId="profile-email"
								className="text-slate-500 dark:text-slate-400 text-sm mt-0.5"
							>
								{editedEmail}
							</Typography>
							<span className="mt-2 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
								{editedRole}
							</span>
						</>
					)}
				</div>
			</div>

			<div className="w-full max-w-xl rounded-2xl border bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/80 shadow-md overflow-hidden">
				{[
					{ label: "Full Name", value: editedName, key: "name", setter: setEditedName },
					{ label: "Email", value: editedEmail, key: "email", setter: setEditedEmail },
					{ label: "Role", value: editedRole, key: "role", setter: setEditedRole },
					{ label: "Tenant", value: editedTenant, key: "tenant", setter: setEditedTenant },
				].map((field, idx) => (
					<div key={field.label}>
						{idx > 0 && <Divider className="border-slate-200/60 dark:border-slate-800/80" />}
						<div className="flex items-center justify-between px-6 py-4">
							<Typography
								component="caption"
								testId={`profile-field-label-${field.label}`}
								className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-widest w-28 flex-shrink-0"
							>
								{field.label}
							</Typography>
							
							{isEditing ? (
								<input
									type="text"
									value={field.value}
									onChange={(e) => field.setter(e.target.value)}
									className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right w-full max-w-[280px]"
								/>
							) : (
								<Typography
									component="body2"
									testId={`profile-field-value-${field.label}`}
									className="text-slate-800 dark:text-slate-200 font-medium text-sm text-right"
								>
									{field.value}
								</Typography>
							)}
						</div>
					</div>
				))}
			</div>
		</Box>
	);
};
