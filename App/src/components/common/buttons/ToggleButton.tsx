import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "../display/Icon";
import Icon from "../display/Icon";
import { ToggleButton as MUIToggleButton, type SxProps, type Theme } from "@mui/material"; 

/**
 * Props for ToggleButtonWrapper
 */
type ToggleButtonProps = {
    /**
     * The value associated with this toggle button.
     * Used by parent ToggleButtonGroup to track selection.
     */
    value: string | number;

    /**
     * Whether the button is currently selected
     */
    selected?: boolean;

    /**
     * Callback triggered when the button is clicked
     */
    onChange?: () => void;

    /**
     * Label text displayed inside the button
     */
    label?: string;

    /**
     * Optional icon displayed alongside the label
     */
    icon?: IconType;

    /**
     * Size of the button, following MUI size conventions.
     * @default 'medium'
     */
    size?: "small" | "medium" | "large";

    /**
     * Color of the button when selected, following MUI color conventions.
     * @default 'standard'
     */
    color?: "standard" | "primary" | "secondary" | "error" | "info" | "success" | "warning";

    /**
     * If true, the button will be disabled
     */
    disabled?: boolean;

    /**
     * If true, the button will be full width
     */
    fullWidth?: boolean;

    /**
     * If true, the keyboard focus ripple will be disabled
     */
    disableFocusRipple?: boolean;

    /**
     * If true, the ripple effect will be disabled
     */
    disableRipple?: boolean;

    /**
     * Additional class names for custom styling
     */
    className?: string;

    ref?: React.Ref<HTMLButtonElement>;
    /**
     * Inline styles for the button
     */
    style?: CSSProperties;

    /**
     * Tab index for keyboard navigation
     */
    tabIndex?: number;

    /**
     * aria-label for accessibility
     */
    ariaLabel?: string;
    
      /**
     * MUI sx prop for custom styling using the theme
     */
      sx?: SxProps<Theme>;

    /**
     * Custom children — overrides label and icon if provided
     */
    children?: ReactNode;
};

/**
 * Standalone wrapper around MUI ToggleButton.
 * Supports all MUI ToggleButton props plus icon integration.
 * Can be used standalone or inside ToggleGroup as a replacement for raw <button>.
 */
const ToggleButton = ({
    value,
    selected,
    onChange,
    label,
    icon,
    size = "small",
    color = "standard",
    disabled,
    fullWidth,
    disableFocusRipple,
    disableRipple,
    className,
    style,
    ref,
    sx,
    tabIndex,
    ariaLabel,
    children,
}: ToggleButtonProps) => {
    return (
        <MUIToggleButton
            value={value}
            selected={selected}
            onChange={onChange}
            size={size}
            color={color}
            disabled={disabled}
            fullWidth={fullWidth}
            disableFocusRipple={disableFocusRipple}
            disableRipple={disableRipple}
            className={className}
            ref={ref}
            sx={{
                width: 'fit-content',
                alignSelf: 'center',
                ...sx              
            }}
            style={style}
            tabIndex={tabIndex}
            aria-label={ariaLabel}
        >
            {children ?? (
                <>
                    {icon && <Icon icon={icon} />}
                    {label}
                </>
            )}
        </MUIToggleButton>
    );
}

export default ToggleButton;