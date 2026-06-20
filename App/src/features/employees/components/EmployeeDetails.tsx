import { Box } from "@mui/material";
import {
	Email as EmailIcon,
	Phone as PhoneIcon,
	Business as BusinessIcon,
	LocationOn as LocationIcon,
} from "@mui/icons-material";
import type { Employee, DirectTeamMember } from "../types/employee";
import Avatar from "../../../components/common/display/Avatar";
import Typography from "../../../components/common/display/Typography";
import LinearProgressBar from "../../../components/common/display/LinearProgressBar";
import Button from "../../../components/common/buttons/Button";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
// Sub-components
// ---------------------------------------------------------------------------

/** A labelled info card (email, phone, department, location) */
const InfoCard = ({
	icon,
	label,
	value,
	testId,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	testId: string;
}) => (
	<Box
		sx={{
			flex: "1 1 calc(50% - 8px)",
			minWidth: 0,
			border: "1px solid #e2e8f0",
			borderRadius: "10px",
			px: 2,
			py: 1.5,
			display: "flex",
			alignItems: "flex-start",
			gap: 1.25,
			bgcolor: "#fff",
		}}
		data-testid={testId}
	>
		<Box sx={{ color: "#94a3b8", mt: "2px", flexShrink: 0 }}>{icon}</Box>
		<Box sx={{ minWidth: 0 }}>
			<Typography
				component="overline"
				testId={`${testId}-label`}
				style={{
					fontSize: "0.625rem",
					fontWeight: 700,
					color: "#94a3b8",
					letterSpacing: "0.08em",
					display: "block",
					textTransform: "uppercase",
				}}
			>
				{label}
			</Typography>
			<Typography
				component="body2"
				testId={`${testId}-value`}
				style={{
					fontSize: "0.8125rem",
					fontWeight: 500,
					color: "#1e293b",
					wordBreak: "break-word",
				}}
			>
				{value}
			</Typography>
		</Box>
	</Box>
);

/** Direct team member card */
const TeamMemberCard = ({ member }: { member: DirectTeamMember }) => {
	const colour = avatarColour(member.name);
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1.25,
				px: 1.5,
				py: 1,
				border: "1px solid #e2e8f0",
				borderRadius: "10px",
				bgcolor: "#fff",
				minWidth: 0,
			}}
			data-testid={`team-member-${member.id}`}
		>
			<Avatar
				initials={member.avatarInitials}
				sx={{ bgcolor: colour, width: 32, height: 32, fontSize: 12, fontWeight: 700, flexShrink: 0 }}
				testId={`team-member-avatar-${member.id}`}
			/>
			<Box sx={{ minWidth: 0 }}>
				<Typography
					component="body2"
					testId={`team-member-name-${member.id}`}
					style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#1e293b" }}
				>
					{member.name}
				</Typography>
				<Typography
					component="caption"
					testId={`team-member-position-${member.id}`}
					style={{ color: "#64748b", fontSize: "0.75rem", display: "block" }}
				>
					{member.position}
				</Typography>
			</Box>
		</Box>
	);
};

// ---------------------------------------------------------------------------
// EmployeeDetails
// ---------------------------------------------------------------------------

type EmployeeDetailsProps = {
	employee: Employee;
};

const EmployeeDetails = ({ employee }: EmployeeDetailsProps) => {
	const initials = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();
	const colour = avatarColour(employee.fullName);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				overflowY: "auto",
				bgcolor: "#fff",
				borderRadius: "12px",
				border: "1px solid #e2e8f0",
			}}
			data-testid="employee-details-panel"
		>
			{/* ── Gradient banner ───────────────────────────────────────── */}
			<Box
				sx={{
					height: 110,
					borderRadius: "12px 12px 0 0",
					background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #06b6d4 100%)",
					flexShrink: 0,
				}}
				data-testid="employee-details-banner"
			/>

			{/* ── Identity row ─────────────────────────────────────────── */}
			<Box
				sx={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					px: 3,
					mt: -4.5,
					mb: 1,
					flexWrap: "wrap",
					gap: 1,
				}}
			>
				{/* Avatar + name/title */}
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Avatar
						initials={initials}
						sx={{
							bgcolor: colour,
							width: 72,
							height: 72,
							fontSize: 22,
							fontWeight: 700,
							border: "3px solid #fff",
							borderRadius: "12px",
							boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
							flexShrink: 0,
						}}
						variant="rounded"
						testId="employee-details-avatar"
					/>
					<Box sx={{ mt: 4.5 }}>
						<Typography
							component="h5"
							testId="employee-details-name"
							style={{ fontWeight: 700, fontSize: "1.125rem", color: "#0f172a" }}
						>
							{employee.fullName}
						</Typography>
						<Typography
							component="body2"
							testId="employee-details-role"
							style={{ color: "#475569", fontSize: "0.8125rem" }}
						>
							{employee.position} · {employee.department}
						</Typography>
					</Box>
				</Box>

				{/* Action buttons */}
				<Box sx={{ display: "flex", gap: 1, mt: 5.5 }}>
					<Button
						label="Message"
						variant="outlined"
						testId="employee-details-message-btn"
						onClick={() => {}}
						icon="ChatOutlined"
					/>
					<Button
						label="View Tasks"
						variant="contained"
						testId="employee-details-tasks-btn"
						onClick={() => {}}
						icon="Assignment"
					/>
				</Box>
			</Box>

			{/* ── Info cards ───────────────────────────────────────────── */}
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					gap: 1,
					px: 3,
					py: 1.5,
				}}
			>
				<InfoCard
					icon={<EmailIcon sx={{ fontSize: 18 }} />}
					label="Email"
					value={employee.email}
					testId="employee-info-email"
				/>
				<InfoCard
					icon={<PhoneIcon sx={{ fontSize: 18 }} />}
					label="Phone"
					value={employee.phone}
					testId="employee-info-phone"
				/>
				<InfoCard
					icon={<BusinessIcon sx={{ fontSize: 18 }} />}
					label="Department"
					value={employee.department}
					testId="employee-info-department"
				/>
				<InfoCard
					icon={<LocationIcon sx={{ fontSize: 18 }} />}
					label="Location"
					value={employee.location}
					testId="employee-info-location"
				/>
			</Box>

			{/* ── Active Projects ──────────────────────────────────────── */}
			{employee.activeProjects.length > 0 && (
				<Box sx={{ px: 3, py: 1.5 }}>
					<Typography
						component="overline"
						testId="employee-projects-heading"
						style={{
							fontWeight: 700,
							fontSize: "0.6875rem",
							letterSpacing: "0.08em",
							color: "#64748b",
							textTransform: "uppercase",
							display: "block",
							mb: 1,
						}}
					>
						Active Projects
					</Typography>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
						{employee.activeProjects.map((project) => (
							<Box key={project.id} data-testid={`project-row-${project.id}`}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mb: 0.75,
									}}
								>
									<Typography
										component="body2"
										testId={`project-name-${project.id}`}
										style={{ fontWeight: 500, fontSize: "0.8125rem", color: "#1e293b" }}
									>
										{project.name}{" "}
										<span style={{ color: "#94a3b8", fontWeight: 400 }}>
											· {project.role}
										</span>
									</Typography>
									<Typography
										component="caption"
										testId={`project-progress-label-${project.id}`}
										style={{ fontWeight: 600, color: "#475569", fontSize: "0.75rem" }}
									>
										{project.progress}%
									</Typography>
								</Box>
								<LinearProgressBar
									variant="determinate"
									value={project.progress}
									color="primary"
									sx={{
										height: 6,
										borderRadius: 3,
										bgcolor: "#e2e8f0",
										"& .MuiLinearProgress-bar": {
											borderRadius: 3,
											background:
												project.progress >= 80
													? "linear-gradient(90deg,#06b6d4,#22d3ee)"
													: "linear-gradient(90deg,#2563eb,#4f6ef7)",
										},
									}}
								/>
							</Box>
						))}
					</Box>
				</Box>
			)}

			{/* ── Direct Team ──────────────────────────────────────────── */}
			{employee.directTeam.length > 0 && (
				<Box sx={{ px: 3, py: 1.5, pb: 3 }}>
					<Typography
						component="overline"
						testId="employee-team-heading"
						style={{
							fontWeight: 700,
							fontSize: "0.6875rem",
							letterSpacing: "0.08em",
							color: "#64748b",
							textTransform: "uppercase",
							display: "block",
							marginBottom: "8px",
						}}
					>
						Direct Team
					</Typography>
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 1,
							mt: 0.5,
						}}
					>
						{employee.directTeam.map((member) => (
							<TeamMemberCard key={member.id} member={member} />
						))}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default EmployeeDetails;
