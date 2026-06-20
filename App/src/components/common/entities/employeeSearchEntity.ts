import { useEmployeeSearch } from "../../../hooks/useEmployeeSearch";
import type { Employee } from "../../../models/core/Employee";
import type { SearchableEntityConfig } from "../inputs/SearchableEntityConfig";

export const employeeSearchEntity: SearchableEntityConfig<Employee> = {
  useSearch: useEmployeeSearch,
  getOptionLabel: (e) =>
    `${e.name ?? ""} ${e.surname ?? ""} (${e.email ?? ""})`.trim(),
  isOptionEqualToValue: (a, b) =>
    !!b && a.id === b.id,
};
