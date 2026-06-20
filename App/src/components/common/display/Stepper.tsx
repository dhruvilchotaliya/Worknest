import MuiStepper from "@mui/material/Stepper";
import MuiStep from "@mui/material/Step";
import MuiStepLabel from "@mui/material/StepLabel";
import MuiStepContent from "@mui/material/StepContent";
import MuiStepButton from "@mui/material/StepButton";
import Box from "@mui/material/Box";
import Button from "../buttons/Button.tsx";
import { useEffect, useState } from "react";
import Typography from "./Typography.tsx";

// Shared Types

/**
 * The orientation of the stepper.
 *
 * - `"horizontal"` – Steps are laid out left to right (default).
 * - `"vertical"`   – Steps are stacked top to bottom with inline content.
 */
export type StepperOrientation = "horizontal" | "vertical";

/**
 * Represents a single step in the stepper.
 */
export type StepDef = {
	/**
	 * The title label of the step shown in the step header.
	 */
	label: string;

	/**
	 * Optional description shown below the label in the step header.
	 */
	description?: string;

	/**
	 * The content rendered inside the step body.
	 */
	content: React.ReactNode;

	/**
	 * When `true`, renders the step in an error state with an error icon
	 * and optional `errorMessage`.
	 * Defaults to `false`.
	 */
	error?: boolean;

	/**
	 * Error message shown below the step label when `error` is `true`.
	 */
	errorMessage?: string;

	/**
	 * When `true`, marks the step as optional with a subtitle.
	 * Defaults to `false`.
	 */
	optional?: boolean;

	/**
	 * When `true`, the step is completed.
	 * In linear mode this is managed internally.
	 * In non-linear mode the consumer controls this.
	 * Defaults to `false`.
	 */
	completed?: boolean;
};

/**
 * Helpers passed to `renderNavigation` so the consumer can
 * control stepper navigation from their own button implementation.
 */
export type StepperNavigationHelpers = {
	/**
	 * Advance to the next step or trigger finish on the last step.
	 */
	onNext: () => void;

	/**
	 * Go back to the previous step.
	 */
	onBack: () => void;

	/**
	 * Whether the active step is the first step.
	 */
	isFirstStep: boolean;

	/**
	 * Whether the active step is the last step.
	 */
	isLastStep: boolean;

	/**
	 * The current active step index.
	 */
	activeStep: number;
};

/**
 * Params passed to `renderStepIcon` for custom icon rendering.
 */
export type StepIconParams = {
	/**
	 * The zero-based index of the step.
	 */
	index: number;

	/**
	 * Whether this step is currently active.
	 */
	isActive: boolean;

	/**
	 * Whether this step has been completed.
	 */
	isCompleted: boolean;

	/**
	 * Whether this step is disabled.
	 */
	isDisabled: boolean;
};

/**
 * Style overrides for each step icon state.
 */
export type StepIconStyles = {
	/**
	 * Classes applied to the icon when the step is active.
	 */
	active?: string;

	/**
	 * Classes applied to the icon when the step is completed.
	 */
	completed?: string;

	/**
	 * Classes applied to the icon when the step is disabled.
	 */
	disabled?: string;

	/**
	 * Classes applied to the icon when the step is inactive (not active, completed, or disabled).
	 */
	inactive?: string;
};

// StepperProps

/**
 * Props for the `Stepper` component.
 */
export type StepperProps = {
	/**
	 * The list of steps to render.
	 */
	steps: StepDef[];

	/**
	 * The orientation of the stepper.
	 * Defaults to `"horizontal"`.
	 */
	orientation?: StepperOrientation;

	/**
	 * When `true`, the stepper enforces sequential order — a step cannot
	 * be visited until all previous steps are completed.
	 * When `false`, any step can be clicked freely.
	 * Defaults to `true`.
	 */
	linear?: boolean;

	/**
	 * The index of the initially active step.
	 * Defaults to `0`.
	 */
	initialStep?: number;

	/**
	 * Label for the back navigation button.
	 * Only used when `renderNavigation` is not provided.
	 * Defaults to `"Back"`.
	 */
	backLabel?: string;

	/**
	 * Label for the next navigation button.
	 * Only used when `renderNavigation` is not provided.
	 * Defaults to `"Next"`.
	 */
	nextLabel?: string;

	/**
	 * Label for the finish button shown on the last step.
	 * Only used when `renderNavigation` is not provided.
	 * Defaults to `"Finish"`.
	 */
	finishLabel?: string;

	/**
	 * Label for the reset button shown after all steps are completed.
	 * Defaults to `"Reset"`.
	 */
	resetLabel?: string;

	/**
	 * Custom render function for the navigation buttons.
	 * Receives helpers to control navigation so the consumer
	 * can wire them to their own UI.
	 *
	 * When provided, the default back/next/finish buttons are not rendered.
	 *
	 * @example
	 * ```tsx
	 * renderNavigation={({ onNext, onBack, isFirstStep, isLastStep }) => (
	 *   <div className="flex gap-2 mt-4">
	 *     <Button label={isLastStep ? "Submit" : "Continue"} onClick={onNext} />
	 *     {!isFirstStep && <Button label="Back" variant="outlined" onClick={onBack} />}
	 *   </div>
	 * )}
	 * ```
	 */
	renderNavigation?: (helpers: StepperNavigationHelpers) => React.ReactNode;

	/**
	 * Callback fired when the finish button is clicked on the last step.
	 */
	onFinish?: () => void;

	/**
	 * Callback fired whenever the active step changes.
	 * Receives the new active step index.
	 */
	onStepChange?: (step: number) => void;

	/**
	 * Optional additional CSS class names applied to the root wrapper.
	 */
	className?: string;

	/**
	 * The test identifier used for automated testing.
	 */
	testId: string;

	/**
	 * When `true`, the consumer is responsible for rendering all step content,
	 * including descriptions and error messages, inside `renderNavigation`.
	 * This allows for maximum flexibility in custom layouts but requires more
	 * work from the consumer.
	 * Defaults to `false`.
	 */
	isCustomRendering?: boolean;

	/**
	 * Custom icon renderer per step. Receives the step's state and index.
	 * When provided, replaces MUI's default step icon entirely.
	 *
	 * @example
	 * ```tsx
	 * renderStepIcon={({ index, isActive, isCompleted, isDisabled }) => {
	 *   if (isDisabled) return <FaMinus size={16} />;
	 *   if (isCompleted) return <FaCheck size={16} />;
	 *   return <span>{index + 1}</span>;
	 * }}
	 * ```
	 */
	renderStepIcon?: (params: StepIconParams) => React.ReactNode;

	/**
	 * Custom label formatter applied to each step's label string.
	 *
	 * @example
	 * ```tsx
	 * formatStepLabel={(label) => label.charAt(0).toUpperCase() + label.slice(1)}
	 * ```
	 */
	formatStepLabel?: (label: string) => string;

	/**
	 * When `false`, completed steps will NOT show a checkmark (tick) icon.
	 * Defaults to `true`.
	 */
	showCompletedIcon?: boolean;

	/**
	 * Externally controlled completed step indices.
	 * When provided, overrides the internal `completedSteps` tracking entirely.
	 * Useful when the parent manages which steps are complete (e.g. non-linear flows).
	 */
	completedSteps?: number[];

	/**
	 * Indices of steps that should be rendered as disabled.
	 * Disabled steps cannot be clicked and receive the `disabled` icon style.
	 */
	disabledSteps?: number[];

	/**
	 * Tailwind class overrides for each step icon state.
	 * Applied when using `renderStepIcon` or the default icon.
	 *
	 * @example
	 * ```tsx
	 * stepIconStyles={{
	 *   active: "bg-primary border-primary text-white",
	 *   completed: "bg-green-500 border-green-500 text-white",
	 *   disabled: "bg-gray-200 border-gray-400 text-gray-400",
	 *   inactive: "bg-gray-100 border-gray-300 text-gray-500",
	 * }}
	 * ```
	 */
	stepIconStyles?: StepIconStyles;

	/**
	 * When `true`, marks each step as completed as soon as the user advances
	 * past it via `onNext` — regardless of the `linear` setting.
	 * This allows non-linear steppers to still show tick marks when navigating forward.
	 * Defaults to `true`.
	 */
	markCompletedOnNext?: boolean;

	/**
	 * When `true`, hides the connector line rendered between steps by MUI.
	 * When `false` (default), MUI's default connector line is shown.
	 * Defaults to `false`.
	 */
	hideConnector?: boolean;

	/**
	 * Additional CSS classes applied to the step icons (numbers or checkmarks).
	 * Only applied when using the default MUI icons, not when `renderStepIcon` is provided.
	 */
	stepperClassName?: string;

	/**
	 *  When using `isCustomRendering` mode, this prop allows externally controlling the active step index
	 */
	customActiveStep?: number;

	/**
     * Props applied to the Back button.
     */
    backButtonProps?: Partial<React.ComponentProps<typeof Button>>;

    /**
     * Props applied to the Next button.
     */
    nextButtonProps?: Partial<React.ComponentProps<typeof Button>>;

    /**
     * Props applied to the Reset button shown after completion.
     */
    resetButtonProps?: Partial<React.ComponentProps<typeof Button>>;

	/**
     * Props applied to the Finish button.
     */
	finishButtonProps?: Partial<React.ComponentProps<typeof Button>>;
};

// Stepper

/**
 * A multi-step progression component supporting horizontal and vertical
 * layouts, linear and non-linear navigation, optional steps, error states,
 * and full icon / connector customisation.
 *
 * In `linear` mode, navigation is sequential — next/back buttons control
 * the active step, and completed states are tracked internally.
 *
 * In non-linear mode (`linear={false}`), any step label is clickable and
 * the consumer controls `completed` per step.
 */
export const Stepper = ({
	steps,
	orientation = "horizontal",
	linear = true,
	initialStep = 0,
	backLabel = "Back",
	nextLabel = "Next",
	finishLabel = "Finish",
	resetLabel = "Reset",
	renderNavigation,
	onFinish,
	onStepChange,
	className,
	testId,
	isCustomRendering = false,
	renderStepIcon,
	formatStepLabel,
	showCompletedIcon = true,
	completedSteps: externalCompletedSteps,
	disabledSteps = [],
	stepIconStyles,
	markCompletedOnNext = true,
	hideConnector = false,
	stepperClassName,
	customActiveStep,
	backButtonProps,
    nextButtonProps,
    resetButtonProps,
	finishButtonProps 
}: StepperProps) => {
	const [activeStep, setActiveStep] = useState(initialStep);
	const [internalCompletedSteps, setInternalCompletedSteps] = useState<
		Set<number>
	>(new Set());
	const [finished, setFinished] = useState(false);

	const isLastStep = activeStep === steps.length - 1;

	useEffect(() => {
		if (isCustomRendering && customActiveStep !== undefined) {
			setActiveStep(customActiveStep);
		}
	}, [customActiveStep, isCustomRendering]);

	// Resolve which completed set to use
	const resolvedCompletedSteps: Set<number> = externalCompletedSteps
		? new Set(externalCompletedSteps)
		: internalCompletedSteps;

	const handleNext = () => {
		// Mark as completed when advancing, respecting markCompletedOnNext
		if (linear || markCompletedOnNext) {
			if (!externalCompletedSteps) {
				setInternalCompletedSteps((prev) =>
					new Set(prev).add(activeStep)
				);
			}
		}

		if (isLastStep) {
			setFinished(true);
			onFinish?.();
		} else {
			const next = activeStep + 1;
			setActiveStep(next);
			onStepChange?.(next);
		}
	};

	const handleBack = () => {
		const prev = activeStep - 1;
		setActiveStep(prev);
		onStepChange?.(prev);
	};

	const handleStepClick = (index: number) => {
		if (!linear && !disabledSteps.includes(index)) {
			setActiveStep(index);
			onStepChange?.(index);
		}
	};

	const handleReset = () => {
		setActiveStep(initialStep);
		setInternalCompletedSteps(new Set());
		setFinished(false);
		onStepChange?.(initialStep);
	};

	const isStepCompleted = (index: number): boolean => {
		if (!showCompletedIcon) return false;
		if (linear) return resolvedCompletedSteps.has(index);
		// Non-linear: prefer external completedSteps, else per-step `completed` flag
		if (externalCompletedSteps) return resolvedCompletedSteps.has(index);
		return steps[index].completed ?? resolvedCompletedSteps.has(index);
	};

	const isStepDisabled = (index: number): boolean =>
		disabledSteps.includes(index);

	const connector = hideConnector ? null : undefined;

	const buildStepIconComponent = (index: number) => {
		const isActive = index === activeStep;
		const isCompleted = isStepCompleted(index);
		const isDisabled = isStepDisabled(index);

		// Resolve icon style class
		const iconClass = (() => {
			if (isDisabled) return stepIconStyles?.disabled ?? "";
			if (isCompleted) return stepIconStyles?.completed ?? "";
			if (isActive) return stepIconStyles?.active ?? "";
			return stepIconStyles?.inactive ?? "";
		})();

		if (!renderStepIcon) return undefined; // Let MUI render its default icon

		// Return a component (not an element) so MUI can call it correctly
		const IconComponent = () => (
			<span className={iconClass}>
				{renderStepIcon({ index, isActive, isCompleted, isDisabled })}
			</span>
		);
		IconComponent.displayName = `StepIcon_${index}`;
		return IconComponent;
	};
    const activeNextButtonProps = isLastStep ? finishButtonProps : nextButtonProps;

	const navigationButtons = renderNavigation ? (
		renderNavigation({
			onNext: handleNext,
			onBack: handleBack,
			isFirstStep: activeStep === 0,
			isLastStep,
			activeStep,
		})
	) : (
		<Box className="flex gap-2 mt-2">
			<Button
            label={backLabel}
            variant="outlined"
            displayMode={activeStep === 0 ? "disabled" : undefined}
            onClick={handleBack}
            testId={`${testId}-back-button`}
            {...backButtonProps}
            />
			<Button
			label={isLastStep ? finishLabel : nextLabel}
			variant="contained"
			onClick={handleNext}
			testId={`${testId}-next-button`}
			{...activeNextButtonProps}
			/>
		</Box>
	);

	const renderStepLabel = (step: StepDef, index: number) => {
		const label = formatStepLabel
			? formatStepLabel(step.label)
			: step.label;
		const StepIconComponent = buildStepIconComponent(index);

		if (linear) {
			return (
				<MuiStepLabel
					error={step.error}
					slots={{
						stepIcon: StepIconComponent ?? undefined,
					}}
					optional={
						step.optional ? (
							<Typography
								component="caption"
								testId={`${testId}-optional`}
							>
								Optional
							</Typography>
						) : step.error && step.errorMessage ? (
							<Typography
								component="caption"
								className="text-red-500"
								testId={`${testId}-linear-errormessage`}
							>
								{step.errorMessage}
							</Typography>
						) : undefined
					}
				>
					{label}
				</MuiStepLabel>
			);
		}

		return (
			<MuiStepButton
				onClick={() => handleStepClick(index)}
				disabled={isStepDisabled(index)}
				icon={StepIconComponent ? <StepIconComponent /> : undefined}
			>
				{label}
			</MuiStepButton>
		);
	};

	if (finished) {
		return (
			<Box className={className}>
				<MuiStepper
					activeStep={steps.length}
					orientation={orientation}
					connector={connector}
					data-testid={testId}
					className={stepperClassName}
				>
					{steps.map((step) => {
						const label = formatStepLabel
							? formatStepLabel(step.label)
							: step.label;
						return (
							<MuiStep
								key={step.label}
								completed
								data-testid={`${testId}-step-${step.label}`}
							>
								<MuiStepLabel>{label}</MuiStepLabel>
							</MuiStep>
						);
					})}
				</MuiStepper>
				<Box className="mt-4 flex flex-col gap-2">
					<Typography
						component="body1"
						testId={`${testId}-completed-message`}
					>
						All steps completed!
					</Typography>
					<Box>
						<Button
							label={resetLabel}
							variant="outlined"
							onClick={handleReset}
							testId={`${testId}-reset-button`}
							{...resetButtonProps}
						/>
					</Box>
				</Box>
			</Box>
		);
	}

	if (orientation === "vertical") {
		return (
			<Box className={className}>
				<MuiStepper
					activeStep={activeStep}
					orientation="vertical"
					nonLinear={!linear}
					connector={connector}
					data-testid={testId}
					className={stepperClassName}
				>
					{steps.map((step, index) => (
						<MuiStep
							key={step.label}
							completed={isStepCompleted(index)}
							disabled={isStepDisabled(index)}
							data-testid={`${testId}-step-${step.label}`}
						>
							{renderStepLabel(step, index)}
							<MuiStepContent
								data-testid={`${testId}-step-content-${step.label}`}
							>
								{step.description && (
									<Typography
										component="body2"
										className="mb-2"
										testId={`${testId}-step-description-${step.label}`}
									>
										{step.description}
									</Typography>
								)}
								{step.content}
								{!isCustomRendering && navigationButtons}
							</MuiStepContent>
						</MuiStep>
					))}
				</MuiStepper>
			</Box>
		);
	}

	return (
		<Box className={className}>
			<MuiStepper
				activeStep={activeStep}
				nonLinear={!linear}
				connector={connector}
				data-testid={testId}
				className={stepperClassName}
			>
				{steps.map((step, index) => (
					<MuiStep
						key={step.label}
						completed={isStepCompleted(index)}
						disabled={isStepDisabled(index)}
						data-testid={`${testId}-step-${step.label}`}
					>
						{renderStepLabel(step, index)}
					</MuiStep>
				))}
			</MuiStepper>

			{/* Active step content */}
			<Box className="mt-4">
				{steps[activeStep].description && (
					<Typography
						component="body2"
						className="mb-2"
						testId={`${testId}-active-step-description`}
					>
						{steps[activeStep].description}
					</Typography>
				)}
				{steps[activeStep].content}
				{!isCustomRendering && navigationButtons}
			</Box>
		</Box>
	);
};
