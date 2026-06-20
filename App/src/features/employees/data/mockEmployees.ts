import type { Employee } from "../types/employee";

/** Derive initials from a full name (e.g. "Priya Shah" → "PS") */
const initials = (name: string) =>
	name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

export const mockEmployees: Employee[] = [
	{
		id: "emp-1",
		firstName: "Priya",
		lastName: "Shah",
		fullName: "Priya Shah",
		email: "priya@nimbus.io",
		phone: "+1 415 555 0118",
		department: "Engineering",
		position: "Engineering Lead",
		location: "San Francisco, CA",
		activeProjects: [
			{ id: "proj-1", name: "Atlas Migration", role: "Lead", progress: 72 },
			{ id: "proj-2", name: "Kepler Docs", role: "Lead", progress: 55 },
		],
		directTeam: [
			{ id: "dt-1", name: "Jenna Kim", position: "iOS", avatarInitials: initials("Jenna Kim") },
			{ id: "dt-2", name: "Diego Alvarez", position: "Backend", avatarInitials: initials("Diego Alvarez") },
			{ id: "dt-3", name: "Mira Roy", position: "QA", avatarInitials: initials("Mira Roy") },
		],
	},
	{
		id: "emp-2",
		firstName: "Marcus",
		lastName: "Lee",
		fullName: "Marcus Lee",
		email: "marcus@nimbus.io",
		phone: "+1 415 555 0204",
		department: "Design",
		position: "Design Director",
		location: "New York, NY",
		activeProjects: [
			{ id: "proj-3", name: "Brand Refresh", role: "Lead", progress: 88 },
		],
		directTeam: [
			{ id: "dt-4", name: "Elena Novak", position: "UX", avatarInitials: initials("Elena Novak") },
		],
	},
	{
		id: "emp-3",
		firstName: "Jenna",
		lastName: "Kim",
		fullName: "Jenna Kim",
		email: "jenna@nimbus.io",
		phone: "+1 415 555 0312",
		department: "Engineering",
		position: "Senior iOS Engineer",
		location: "Austin, TX",
		activeProjects: [
			{ id: "proj-4", name: "iOS Overhaul", role: "Contributor", progress: 40 },
		],
		directTeam: [],
	},
	{
		id: "emp-4",
		firstName: "Diego",
		lastName: "Alvarez",
		fullName: "Diego Alvarez",
		email: "diego@nimbus.io",
		phone: "+1 415 555 0421",
		department: "Engineering",
		position: "Backend Engineer",
		location: "Chicago, IL",
		activeProjects: [
			{ id: "proj-1", name: "Atlas Migration", role: "Engineer", progress: 72 },
		],
		directTeam: [],
	},
	{
		id: "emp-5",
		firstName: "Sara",
		lastName: "Chen",
		fullName: "Sara Chen",
		email: "sara@nimbus.io",
		phone: "+1 415 555 0533",
		department: "Engineering",
		position: "Data Engineer",
		location: "Seattle, WA",
		activeProjects: [
			{ id: "proj-5", name: "Data Lake", role: "Lead", progress: 61 },
		],
		directTeam: [],
	},
	{
		id: "emp-6",
		firstName: "Tom",
		lastName: "Reyes",
		fullName: "Tom Reyes",
		email: "tom@nimbus.io",
		phone: "+1 415 555 0645",
		department: "Marketing",
		position: "Marketing Manager",
		location: "Los Angeles, CA",
		activeProjects: [
			{ id: "proj-6", name: "Q3 Campaign", role: "Manager", progress: 30 },
		],
		directTeam: [],
	},
	{
		id: "emp-7",
		firstName: "Alex",
		lastName: "Rivera",
		fullName: "Alex Rivera",
		email: "alex@nimbus.io",
		phone: "+1 415 555 0756",
		department: "Product",
		position: "Product Manager",
		location: "Denver, CO",
		activeProjects: [
			{ id: "proj-7", name: "Roadmap 2026", role: "Owner", progress: 50 },
		],
		directTeam: [],
	},
	{
		id: "emp-8",
		firstName: "Mira",
		lastName: "Roy",
		fullName: "Mira Roy",
		email: "mira@nimbus.io",
		phone: "+1 415 555 0867",
		department: "Engineering",
		position: "QA Engineer",
		location: "San Jose, CA",
		activeProjects: [
			{ id: "proj-4", name: "iOS Overhaul", role: "QA Lead", progress: 40 },
		],
		directTeam: [],
	},
	{
		id: "emp-9",
		firstName: "Elena",
		lastName: "Novak",
		fullName: "Elena Novak",
		email: "elena@nimbus.io",
		phone: "+1 415 555 0978",
		department: "Design",
		position: "UX Researcher",
		location: "Boston, MA",
		activeProjects: [
			{ id: "proj-3", name: "Brand Refresh", role: "Researcher", progress: 88 },
		],
		directTeam: [],
	},
	{
		id: "emp-10",
		firstName: "Ravi",
		lastName: "Kapoor",
		fullName: "Ravi Kapoor",
		email: "ravi@nimbus.io",
		phone: "+1 415 555 1089",
		department: "Engineering",
		position: "DevOps Engineer",
		location: "Phoenix, AZ",
		activeProjects: [
			{ id: "proj-8", name: "CI/CD Pipeline", role: "Lead", progress: 95 },
		],
		directTeam: [],
	},
];
