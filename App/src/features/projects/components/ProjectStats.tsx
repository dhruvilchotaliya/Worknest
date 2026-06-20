import { Box } from "@mui/material";
import Typography from "../../../components/common/display/Typography";
import AssignmentIcon from "@mui/icons-material/Assignment";
import type { DashboardProject } from "../types/project.types";
import Icon from "../../../components/common/display/Icon";

type ProjectStatsProps = {
  projects: DashboardProject[];
};

export const ProjectStats = ({ projects }: ProjectStatsProps) => {
  const total = projects.length;
  const active = projects.filter((p) => p.status === "Active").length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const onHold = projects.filter((p) => p.status === "OnHold").length;

  const stats = [
    {
      label: "Total Projects",
      value: total,
      icon: <AssignmentIcon sx={{ color: "#6366f1" }} />,
      bgClass: "bg-indigo-50",
    },
    {
      label: "Active Projects",
      value: active,
      icon: <Icon icon="PlayCircleOutlineIcon" color="primary" />,
      bgClass: "bg-emerald-50",
    },
    {
      label: "Completed",
      value: completed,
      icon: <Icon icon="CheckCircleOutlineIcon" color="primary" />,
      bgClass: "bg-violet-50",
    },
    {
      label: "On Hold",
      value: onHold,
      icon: <Icon icon="PauseCircleOutlineIcon" color="primary" />,
      bgClass: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {stats.map((stat, idx) => (
        <Box
          key={idx}
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between"
        >
          <Box>
            <Typography
              component="body2"
              className="text-slate-400 text-xs font-medium mb-0.5 uppercase tracking-wide"
              testId={""}
            >
              {stat.label}
            </Typography>
            <Typography
              component="h3"
              className="text-xl font-bold text-slate-800"
              testId={""}
            >
              {stat.value}
            </Typography>
          </Box>
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bgClass}`}
          >
            {stat.icon}
          </div>
        </Box>
      ))}
    </div>
  );
};
