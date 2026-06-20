export interface SearchHookResult<T> {
  options: T[];
  inputValue: string;
  setInputValue: (value: string) => void;
  loading: boolean;
}

export interface SearchableEntityConfig<T> {
  useSearch: (maxResults: number) => SearchHookResult<T>;
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue: (a: T, b: T | null) => boolean;
}