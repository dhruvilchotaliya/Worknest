import { useMemo } from "react";
import type { DashboardProject } from "../types/project.types";

export type ProjectSortField = "name" | "createdAt";
export type ProjectSortDirection = "asc" | "desc";

export const useProjectFilters = (
	projects: DashboardProject[],
	searchQuery: string,
	categoryFilter: string | "All",
	sortField: ProjectSortField,
	sortDirection: ProjectSortDirection
) => {
	return useMemo(() => {
		let result = [...projects];

		// 1. Filter by search query
		if (searchQuery.trim() !== "") {
			const query = searchQuery.toLowerCase();
			result = result.filter((p) => {
				const matchName = p.name.toLowerCase().includes(query);
				const matchCode = p.code?.toLowerCase().includes(query);
				const matchClient = p.clientName?.toLowerCase().includes(query);
				const matchDesc = p.description?.toLowerCase().includes(query);
				return matchName || matchCode || matchClient || matchDesc;
			});
		}

		// 2. Filter by category
		if (categoryFilter !== "All") {
			result = result.filter((p) => p.category === categoryFilter);
		}

		// 3. Sort
		result.sort((a, b) => {
			let valA: string | number;
			let valB: string | number;

			if (sortField === "createdAt") {
				valA = new Date(a.createdAt).getTime();
				valB = new Date(b.createdAt).getTime();
			} else {
				valA = a.name.toLowerCase();
				valB = b.name.toLowerCase();
			}

			if (valA < valB) return sortDirection === "asc" ? -1 : 1;
			if (valA > valB) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});

		return result;
	}, [projects, searchQuery, categoryFilter, sortField, sortDirection]);
};
