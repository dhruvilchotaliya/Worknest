import {
	ContextMenu,
	Gantt,
	Willow,
	WillowDark,
	type IColumnConfig,
	type ILink,
	type ITask,
} from "@svar-ui/react-gantt";
import "@svar-ui/react-gantt/all.css";
import React, {
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";
import ThemeContext from "../../../context/ThemeContext";

interface GanttChartProProps {
	tasks: ITask[];
	links?: ILink[];
	readonly?: boolean;
	onTaskOpen?: (id: string) => void;
	onTaskUpdate?: (task: ITask) => void;
}

export const GanttChartPro: React.FC<GanttChartProProps> = ({
	tasks,
	links = [],
	readonly = false,
	onTaskOpen,
	onTaskUpdate,
}) => {
	const theme = useContext(ThemeContext);
	const updateTimeoutRef = useRef<number | null>(null);

	const HIDE_PREFIX = "__hide__";

	useEffect(() => {
		return () => {
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
		};
	}, []);

	const init = (api) => {
		api.on("select-task", (ev: any) => {
			onTaskOpen?.(ev.id);
		});

		api.on("update-task", (taskObject) => {
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
			updateTimeoutRef.current = setTimeout(() => {
				const task: ITask = {
					id: taskObject.task.id,
					text: taskObject.task.text,
					start: taskObject.task.start,
					end: taskObject.task.end,
					duration: taskObject.task.duration,
					progress: taskObject.task.progress,
					parent: taskObject.task.parent,
				};

				onTaskUpdate?.(task);
			}, 300);
		});
	};

	const resolvedColumns: IColumnConfig[] = useMemo(
		() => [
			{
				id: "text",
				header: "Task",
				tree: true,
				width: 280,
				template: (text: string) => `${text}`,
			},
			{
				id: "start",
				header: "Start",
				align: "center",
				width: 110,
				template: (val: string) => {
					if (!val || isNaN(new Date(val).getTime())) {
						return "-";
					}
					const date = new Date(val);
					return `${date.getDate().toString().padStart(2, "0")}/${(
						date.getMonth() + 1
					)
						.toString()
						.padStart(2, "0")}/${date.getFullYear()}`;
				},
			},
			{
				id: "duration",
				header: "Days",
				align: "center",
				width: 70,
				template: (val: number) => {
					if (val == null) {
						return `-`;
					}
					return val.toString();
				},
			},
			{
				id: "progress",
				header: "%",
				align: "center",
				width: 60,
				template: (progress: number | undefined) => {
					if (
						progress == null ||
						progress == undefined ||
						isNaN(progress)
					) {
						return "-";
					}
					return `${Math.round(progress)}%`;
				},
			},
		],
		[]
	);

	const idMap = new Map<string, string>();

	tasks.forEach((task) => {
		if (!task.start && !task.end) {
			idMap.set(task.id as string, `${HIDE_PREFIX}${task.id}`);
		}
	});

	tasks = tasks.map((task) => {
		const newId = idMap.get(task.id as string) ?? task.id;
		const newParent = task.parent
			? idMap.get(task.parent as string) ?? task.parent
			: undefined;

		return {
			...task,
			id: newId,
			parent: newParent,
		};
	});

	if (!tasks.length) {
		return (
			<div
				style={{
					border: "1px dashed #d1d5db",
					borderRadius: 8,
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#6b7280",
				}}
			>
				No Gantt data available
			</div>
		);
	}

	return (
		<div
			className="border-gray-300 dark:border-gray-600"
			style={{
				width: "100%",
				height: "100%",
				border: "1px solid #d1d5db",
				borderColor: theme.isDark ? "#4b5563" : "#d1d5db",
				backgroundColor: theme.isDark ? "#2a2b2d" : "#ffffff",
				borderRadius: 10,
				overflow: "hidden",
				background: "#ffffff",
			}}
		>
			<ContextMenu>
				{theme.isDark ? (
					<WillowDark>
						<Gantt
							tasks={tasks}
							links={links}
							columns={resolvedColumns}
							cellWidth={100}
							unscheduledTasks={true}
							scaleHeight={50}
							cellHeight={40}
							readonly={readonly}
							init={init}
						/>
					</WillowDark>
				) : (
					<Willow>
						<Gantt
							tasks={tasks}
							links={links}
							columns={resolvedColumns}
							cellWidth={100}
							unscheduledTasks={true}
							scaleHeight={50}
							cellHeight={40}
							readonly={readonly}
							init={init}
						/>
					</Willow>
				)}
			</ContextMenu>
		</div>
	);
};

export default GanttChartPro;
