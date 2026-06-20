import type { Group } from "../../../models/core/group";
import { useGroupAccountSearch } from "../../../hooks/useGroupAccountSearch";
import type { SearchableEntityConfig } from "../inputs/SearchableEntityConfig";

export const groupSearchEntity: SearchableEntityConfig<Group> = {
  useSearch: useGroupAccountSearch,
  getOptionLabel: (g) => g.displayName,
  isOptionEqualToValue: (a, b) => a.id === b?.id,
};