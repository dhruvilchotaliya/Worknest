import type { DashboardProject } from "../types/project.types";
import { EmployeePosition } from "../../../models/core/Employee";
import type { Employee } from "../../../models/core/Employee";

const createMockMember = (initials: string): Employee => {
	const name = initials[0] || "";
	const surname = initials.substring(1) || "";
	return {
		id: initials,
		name,
		surname,
		joinedAt: new Date().toISOString(),
		createdAt: new Date().toISOString(),
		position: EmployeePosition.Developer
	};
};

export const mockProjects: DashboardProject[] = [
	{
		id: "1",
		name: "Atlas Migration",
		category: "Engineering",
		description: "Migrate the legacy monolith to a service-oriented architecture on Kubernetes.",
		progress: 72,
		dueDate: "Aug 22",
		status: "Active",
		isActive: true,
		createdAt: "2026-06-01T10:00:00Z",
		members: ["PS", "JL", "DA", "MR"].map(createMockMember)
	},
	{
		id: "2",
		name: "Helios Rebrand",
		category: "Design",
		description: "Full visual rebrand including new identity system, web, and marketing assets.",
		progress: 48,
		dueDate: "Aug 28",
		status: "Active",
		isActive: true,
		createdAt: "2026-06-02T10:00:00Z",
		members: ["M", "ST", "TR"].map(createMockMember)
	},
	{
		id: "3",
		name: "Orion Mobile App",
		category: "Engineering",
		description: "Native iOS and Android companion app.",
		progress: 61,
		dueDate: "Sep 04",
		status: "Active",
		isActive: true,
		createdAt: "2026-06-03T10:00:00Z",
		members: ["JI", "AE", "PS", "DA", "JK"].map(createMockMember)
	},
	{
		id: "4",
		name: "Vertex CRM",
		category: "Engineering",
		description: "Internal CRM replacement with deep Salesforce integration.",
		progress: 22,
		dueDate: "Sep 11",
		status: "Active",
		isActive: true,
		createdAt: "2026-06-04T10:00:00Z",
		members: ["DC", "MJ", "AR"].map(createMockMember)
	},
	{
		id: "5",
		name: "Nova Analytics",
		category: "Engineering",
		description: "Cross-product analytics warehouse and dashboards.",
		progress: 84,
		dueDate: "Sep 18",
		status: "Active",
		isActive: true,
		createdAt: "2026-06-05T10:00:00Z",
		members: ["SC", "PS", "TR", "JK"].map(createMockMember)
	},
	{
		id: "6",
		name: "Q4 Launch Plan",
		category: "Marketing",
		description: "Coordinated launch campaign across owned, earned, and paid channels.",
		progress: 14,
		dueDate: "Oct 02",
		status: "Active",
		isActive: true,
		createdAt: "2026-06-06T10:00:00Z",
		members: ["TT", "ML"].map(createMockMember)
	},
	{
		id: "7",
		name: "Pulse HR Portal",
		category: "Operations",
		description: "Self-service portal for benefits, PTO, and reviews.",
		progress: 100,
		dueDate: "Jul 30",
		status: "Completed",
		isActive: false,
		createdAt: "2026-06-07T10:00:00Z",
		members: ["AF", "DA"].map(createMockMember)
	},
	{
		id: "8",
		name: "Kepler Docs",
		category: "Engineering",
		description: "Customer-facing documentation site rebuild.",
		progress: 55,
		dueDate: "Sep 25",
		status: "Active",
		isActive: true,
		createdAt: "2026-06-08T10:00:00Z",
		members: ["PS", "SC"].map(createMockMember)
	}
];
