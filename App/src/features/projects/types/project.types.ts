import type { Employee } from "../../../models/core/Employee";

export type DashboardProjectStatus = "Active" | "OnHold" | "Completed" | "Cancelled";

export type DashboardProject = {
	id: string;
	name: string;
	description?: string;
	clientName?: string;
	code?: string;
	status: DashboardProjectStatus;
	isActive: boolean;
	createdAt: string;
	bannerUrl?: string;
	members?: Employee[];
	category?: string;
	progress?: number;
	dueDate?: string;
};
