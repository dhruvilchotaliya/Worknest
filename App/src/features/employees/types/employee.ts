/**
 * Represents a single active project an employee is involved in.
 */
export type ActiveProject = {
	id: string;
	name: string;
	role: string;
	/** Progress percentage 0–100 */
	progress: number;
};

/**
 * Represents a member of an employee's direct team.
 */
export type DirectTeamMember = {
	id: string;
	name: string;
	position: string;
	avatarInitials: string;
};

/**
 * Core employee entity used across the directory feature.
 */
export type Employee = {
	id: string;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	phone: string;
	department: string;
	position: string;
	location: string;
	/** Optional URL for a profile photo */
	avatarUrl?: string;
	activeProjects: ActiveProject[];
	directTeam: DirectTeamMember[];
};

/**
 * Form data shape used when creating a new employee.
 * avatarFile holds a locally selected File before any upload.
 */
export type NewEmployeeFormData = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	department: string;
	position: string;
	location: string;
	avatarFile?: File;
};
