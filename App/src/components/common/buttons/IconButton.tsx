import MuiIconButton from "@mui/material/IconButton";
import Icon, { type IconProps, type IconType } from "../display/Icon.tsx";
import { Badge, Tooltip } from "@mui/material";
import React, { useMemo } from "react";
import Spinner from "../display/Spinner.tsx";
import type { ButtonProps } from "./ButtonProps.ts";

type IconButtonProps = {
	/**
	 * The variant to use.
	 * @default 'icon-only'
	 */
	variant?: "contained" | "outlined" | "icon-only";

	/**
	 * The icon to display.
	 */
	icon: IconType;

	customIcon?: React.ReactNode;

	/**
	 * Styling props for the icon. The `icon` prop is required and cannot be overridden through `iconStyle`.
	 */
	iconStyle?: Omit<IconProps, "icon">;
} & ButtonProps;

const IconButton = (props: IconButtonProps) => {
	const color = useMemo(() => {
		switch (props.color) {
			case "primary":
				return "rgba(var(--primary))";
			case "secondary":
				return "rgba(var(--secondary))";
			case "error":
				return "rgba(var(--error))";
			case "info":
				return "rgba(var(--info))";
			case "success":
				return "rgba(var(--success))";
			case "warning":
				return "rgba(var(--warning))";
			default:
				return undefined;
		}
	}, [props.color]);

	const iconButton = useMemo(() => {
		return (
			<span style={{ position: "relative", display: "inline-flex" }}>
				<MuiIconButton
					type={props.type ?? "button"}
					size={"small"}
					id={props.id}
					name={props.name}
					style={props.style}
					className={props.className}
					data-testid={props.testId}
					sx={{
						boxSizing: "border-box",
						outline: props.variant === "outlined" ? "2px solid" : 0,
						outlineOffset:
							props.variant === "outlined" ? "-2px" : 0,
						borderColor:
							props.variant === "outlined" ? color : undefined,
						boxShadow: props.variant === "contained" ? 1 : 0,
						backgroundColor:
							props.variant === "contained" ? color : undefined,
					}}
					onClick={props.onClick}
					color={props.color}
					disabled={props.displayMode === "disabled" || props.loading}
				>
					{props.customIcon && React.isValidElement(props.customIcon) ? (
						// Render custom icon if provided (e.g., <img />, <svg />, or a custom component)
						props.customIcon
					) : (
						// Fallback to standard Icon component using the 'icon' prop (IconType string)
						<Icon
							icon={props.icon}
							size={props.iconStyle?.size}
							color={props.iconStyle?.color}
							className={props.iconStyle?.className}
						/>
					)}
				</MuiIconButton>
				{props.loading && (
					<Spinner
						size={34}
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							marginTop: "-17px",
							marginLeft: "-17px",
						}}
					/>
				)}
			</span>
		);
	}, [
		color,
		props.className,
		props.color,
		props.displayMode,
		props.iconStyle,
		props.id,
		props.loading,
		props.name,
		props.onClick,
		props.style,
		props.type,
		props.variant,
		props.testId,
		props.icon
	]);

	const badge = useMemo(() => {
		if (!props.badgeContent) return iconButton;

		return (
			<Badge
				badgeContent={props.badgeContent}
				color={props.badgeColor ?? "primary"}
				overlap={"circular"}
			>
				{iconButton}
			</Badge>
		);
	}, [props.badgeContent, props.badgeColor, iconButton]);

	const tooltip = useMemo(() => {
		if (!props.tooltip) return badge;

		return (
			<Tooltip title={props.tooltip} arrow>
				{badge}
			</Tooltip>
		);
	}, [badge, props.tooltip]);

	if (props.displayMode === "hidden") return <></>;
	return tooltip;
};

export default IconButton;
