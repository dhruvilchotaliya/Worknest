import { useMemo } from "react";
import { Box, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useMsal } from "@azure/msal-react";
import Avatar from "../../components/common/display/Avatar";
import Typography from "../../components/common/display/Typography";

function getInitials(name: string, email: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}
	if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
	return email.slice(0, 2).toUpperCase();
}

export const ProfilePage = () => {
	const { accounts } = useMsal();
	const account = accounts[0];

	const displayName = account?.name ?? "WorkNest User";
	const email = account?.username ?? "user@example.com";
	const roles = (account?.idTokenClaims as Record<string, unknown>)?.roles as
		| string[]
		| undefined;
	const roleLabel = roles?.[0] ?? "Member";

	const initials = useMemo(
		() => getInitials(displayName, email),
		[displayName, email]
	);

	const fields: { label: string; value: string }[] = [
		{ label: "Full Name", value: displayName },
		{ label: "Email", value: email },
		{ label: "Role", value: roleLabel },
		{ label: "Tenant", value: account?.tenantId ?? "—" },
	];

	return (
		<Box component="section" className="p-6 sm:p-8 max-w-2xl">
			<Typography
				component="overline"
				testId="profile-eyebrow"
				className="text-indigo-500 font-semibold tracking-widest mb-1 flex items-center gap-1.5"
			>
				<PersonIcon sx={{ fontSize: 14 }} />
				Account
			</Typography>

			<Typography
				component="h2"
				testId="profile-heading"
				className="text-3xl font-bold text-slate-900 mb-6"
			>
				My Profile
			</Typography>

			{/* Avatar + name hero */}
			<div className="flex items-center gap-5 mb-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
				<Avatar
					testId="profile-avatar"
					initials={initials}
					size="lg"
					sx={{ bgcolor: "#4f46e5", fontSize: "1.2rem", fontWeight: 700 }}
				/>
				<div>
					<Typography
						component="h5"
						testId="profile-name"
						className="font-bold text-slate-900"
					>
						{displayName}
					</Typography>
					<Typography
						component="body2"
						testId="profile-email"
						className="text-slate-500 text-sm mt-0.5"
					>
						{email}
					</Typography>
					<span className="mt-2 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
						{roleLabel}
					</span>
				</div>
			</div>

			{/* Details list */}
			<div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
				{fields.map((field, idx) => (
					<div key={field.label}>
						{idx > 0 && <Divider />}
						<div className="flex items-start justify-between px-6 py-4">
							<Typography
								component="caption"
								testId={`profile-field-label-${field.label}`}
								className="text-slate-400 text-xs font-semibold uppercase tracking-widest w-28 flex-shrink-0 pt-0.5"
							>
								{field.label}
							</Typography>
							<Typography
								component="body2"
								testId={`profile-field-value-${field.label}`}
								className="text-slate-800 font-medium text-sm text-right"
							>
								{field.value}
							</Typography>
						</div>
					</div>
				))}
			</div>
		</Box>
	);
};
