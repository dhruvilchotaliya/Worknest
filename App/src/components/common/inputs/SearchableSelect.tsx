import { Autocomplete, TextField, Chip, CircularProgress } from "@mui/material";
import type { InputProps } from "./InputProps";
import Typography from "../display/Typography.tsx";
import type { SearchableEntityConfig } from "./SearchableEntityConfig";

export interface SearchableSelectProps<T> extends InputProps {
	/**
	 * Label displayed above the input field.
	 */
	label: string;

	/**
	 * Placeholder text shown when no value is selected.
	 */
	placeholder?: string;

	/**
	 * Visual size of the input.
	 * @default "small"
	 */
	size?: "small" | "medium";

	/**
	 * Validation error message to display below the input.
	 */
	error?: string;

	/**
	 * Maximum number of results returned by the search hook.
	 * @default 20
	 */
	maxResults?: number;

	/**
	 * Entity-specific search configuration.
	 */
	entity: SearchableEntityConfig<T>;

	/**
	 * Controls whether the component operates in single-select or multi-select mode.
	 *
	 * - When `false` (single-select): use `value` and `setValue` to manage state.
	 * - When `true`  (multi-select):  use `values` and `setValues` to manage state.
	 */
	allowMultiple: boolean;

	/**
	 * The currently selected value. Used when `allowMultiple` is `false`.
	 */
	value?: T | null;

	/**
	 * Callback to update the selected value. Used when `allowMultiple` is `false`.
	 */
	setValue?: (value: T | null) => void;

	/**
	 * The currently selected values. Used when `allowMultiple` is `true`.
	 */
	values?: T[] | null;

	/**
	 * Callback to update the selected values. Used when `allowMultiple` is `true`.
	 */
	setValues?: (values: T[] | null) => void;

	/**
	 * The test identifier used for automated testing.
	 * Mapped to `data-testid` on the rendered input element.
	 */
	testId: string;
}

const SearchableSelect = <T extends object>({
	label,
	placeholder,
	size = "small",
	error,
	maxResults = 20,
	entity,
	displayMode = "editable",
	required,
	id,
	name,
	className,
	style,
	allowMultiple,
	value = null,
	setValue,
	values = null,
	setValues,
	testId,
}: Readonly<SearchableSelectProps<T>>) => {
	const { options, setInputValue, loading } =
		entity.useSearch(maxResults);

	const handleInputChange = (
		_event: unknown,
		value: string,
		reason: string
	) => {
		if (reason === "input" || reason === "clear") {
			setInputValue(value);
		}
	};

	if (displayMode === "hidden") return null;

	if (displayMode === "text") {
		if (allowMultiple) {
			return (
				<span>
					{values?.length
						? values.map(entity.getOptionLabel).join(", ")
						: "-"}
				</span>
			);
		}

		return (
			<div>
				{label && <Typography component="h5" testId={`${testId}-label`}>{label}</Typography>}
				<Typography component="body1" testId={`${testId}-value`}>
					{value ? entity.getOptionLabel(value) : "-"}
				</Typography>
			</div>
		);
	}

	if (allowMultiple) {
		return (
			<Autocomplete
				multiple
				size={size}
				options={options}
				value={values ?? undefined}
				readOnly={displayMode === "readonly"}
				disabled={displayMode === "disabled"}
				onChange={(_, v) => setValues?.(v ?? [])}
				onInputChange={handleInputChange}
				getOptionLabel={entity.getOptionLabel}
				isOptionEqualToValue={entity.isOptionEqualToValue}
				filterSelectedOptions
				loading={loading}
				renderValue={(tagValue, getTagProps) =>
					tagValue.map((option, index) => (
						<Chip
							{...getTagProps({ index })}
							key={`${entity.getOptionLabel(option)}-${index}`}
							label={entity.getOptionLabel(option)}
						/>
					))
				}
				data-testid={testId}
				renderInput={(params) => (
					<TextField
						{...params}
						id={id}
						name={name}
						className={className}
						style={style}
						label={label}
						placeholder={displayMode === "disabled" || displayMode === "readonly" ? "" : placeholder}
						required={required}
						error={!!error}
						helperText={error}
						slotProps={{
							input: {
								...params.InputProps,
								endAdornment: (
									<>
										{loading && (
											<CircularProgress size={18} />
										)}
										{params.InputProps.endAdornment}
									</>
								),
							},
						}}
					/>
				)}
			/>
		);
	}

	return (
		<Autocomplete
			size={size}
			options={options}
			value={value}
			readOnly={displayMode === "readonly"}
			disabled={displayMode === "disabled"}
			onChange={(_, v) => setValue?.(v ?? null)}
			onInputChange={handleInputChange}
			getOptionLabel={entity.getOptionLabel}
			isOptionEqualToValue={entity.isOptionEqualToValue}
			loading={loading}
			data-testid={testId}
			renderInput={(params) => (
				<TextField
					{...params}
					id={id}
					name={name}
					className={className}
					style={style}
					label={label}
					placeholder={placeholder}
					required={required}
					error={!!error}
					helperText={error}
					slotProps={{
						input: {
							...params.InputProps,
							endAdornment: (
								<>
									{loading && <CircularProgress size={18} />}
									{params.InputProps.endAdornment}
								</>
							),
						},
					}}
				/>
			)}
		/>
	);
};

export default SearchableSelect;
