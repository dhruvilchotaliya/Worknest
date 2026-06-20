import { Box } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Typography from "../../components/common/display/Typography";

const tasks = [
	{ id: 1, title: "Design new onboarding flow", done: true, priority: "High" },
	{ id: 2, title: "Fix auth redirect on session expire", done: false, priority: "Critical" },
	{ id: 3, title: "Write API integration tests", done: false, priority: "Medium" },
	{ id: 4, title: "Review PR #142 — dashboard redesign", done: true, priority: "Low" },
];

export const TasksPage = () => {
	return (
		<Box component="section" className="p-6 sm:p-8 max-w-5xl">
			<Typography
				component="overline"
				testId="tasks-eyebrow"
				className="text-indigo-500 font-semibold tracking-widest mb-1 flex items-center gap-1.5"
			>
				<AssignmentIcon sx={{ fontSize: 14 }} />
				Workspace
			</Typography>

			<Typography
				component="h2"
				testId="tasks-heading"
				className="text-3xl font-bold text-slate-900 mb-3"
			>
				Tasks
			</Typography>

			<Typography
				component="body1"
				testId="tasks-description"
				className="text-slate-500 mb-8 max-w-xl"
			>
				View and manage your assigned tasks. Update status and collaborate with
				your team to hit deadlines.
			</Typography>

			<div className="flex flex-col gap-2.5">
				{tasks.map((task) => (
					<div
						key={task.id}
						className={[
							"flex items-center justify-between rounded-2xl border px-5 py-4 bg-white shadow-sm",
							"hover:shadow-md transition-all duration-200",
							task.done ? "opacity-60" : "",
						].join(" ")}
					>
						<div className="flex items-center gap-3">
							{task.done ? (
								<CheckCircleOutlineOutlinedIcon sx={{ color: "#10b981", fontSize: 20 }} />
							) : (
								<RadioButtonUncheckedIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
							)}
							<Typography
								component="body1"
								testId={`task-title-${task.id}`}
								className={`font-medium text-slate-800 ${task.done ? "line-through text-slate-400" : ""}`}
							>
								{task.title}
							</Typography>
						</div>
						<span
							className={[
								"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
								task.priority === "Critical"
									? "bg-red-50 text-red-700 ring-red-500/20"
									: task.priority === "High"
									? "bg-orange-50 text-orange-700 ring-orange-500/20"
									: task.priority === "Medium"
									? "bg-yellow-50 text-yellow-700 ring-yellow-500/20"
									: "bg-slate-50 text-slate-600 ring-slate-200",
							].join(" ")}
						>
							{task.priority}
						</span>
					</div>
				))}
			</div>
		</Box>
	);
};
