import MuiChip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import type { AvatarProps } from "./Avatar.tsx";
import Avatar from "./Avatar.tsx";
import { SvgIcon } from "@mui/material";

type ChipVariant = "filled" | "outlined";

type ChipColor =
	| "default"
	| "primary"
	| "secondary"
	| "error"
	| "info"
	| "success"
	| "warning";

type ChipSize = "sm" | "md";

const sizeMap: Record<ChipSize, "small" | "medium"> = {
	sm: "small",
	md: "medium",
};

/**
 * Props for the `Chip` component.
 *
 * Content is mutually exclusive — only one of `avatar` or `icon` can be
 * provided at a time. TypeScript will error if both are passed.
 */
export type ChipProps = {
	/**
	 * The label text displayed inside the chip.
	 */
	label: string;

	/**
	 * The visual style variant of the chip.
	 * Defaults to `"filled"`.
	 */
	variant?: ChipVariant;

	/**
	 * The color of the chip.
	 * Defaults to `"default"`.
	 */
	color?: ChipColor;

	/**
	 * The size of the chip.
	 * Defaults to `"md"`.
	 */
	size?: ChipSize;

	/**
	 * When `true`, the chip is rendered in a disabled state.
	 * Defaults to `false`.
	 */
	disabled?: boolean;

	/**
	 * Callback fired when the chip is clicked.
	 * When provided, the chip renders as clickable with a ripple effect.
	 */
	onClick?: () => void;

	/**
	 * Callback fired when the delete icon is clicked.
	 * When provided, a delete icon is shown on the chip.
	 */
	onDelete?: () => void;

	/**
	 * Optional additional CSS class names applied to the chip.
	 */
	className?: string;

	/**
	 * The test identifier used for automated testing.
	 * Mapped to `data-testid` on the rendered input element.
	 */
	testId: string;

	/**
	 * Optional inline styles applied to the chip.
	 */
	style?: React.CSSProperties;

} & (
	| {
			/**
			 * Avatar displayed to the left of the label.
			 * Accepts `src` and `alt` for an image avatar, or `initials` for a text avatar.
			 */
			avatar: AvatarProps;
			icon?: never;
	  }
	| {
			/**
			 * Icon displayed to the left of the label.
			 */
			icon: React.ReactElement;
			avatar?: never;
	  }
	| {
			avatar?: never;
			icon?: never;
	  }
);

/**
 * A compact element representing an attribute, action, or filter.
 *
 * Supports click and delete interactions, and can display an avatar or icon.
 * `avatar` and `icon` are mutually exclusive — passing both is a type error.
 */
export const Chip = ({
	label,
	variant = "filled",
	color = "default",
	size = "md",
	disabled = false,
	onClick,
	onDelete,
	className,
	avatar,
	icon,
	testId,
	style
}: ChipProps) => {
	const avatarElement = avatar ? (
		<Avatar
			src={avatar.src}
			alt={avatar.alt}
			initials={avatar.initials}
			testId={`${testId}-avatar`}
		/>
	) : undefined;

	return (
		<MuiChip
			data-testid={testId}
			label={label}
			variant={variant}
			color={color}
			size={sizeMap[size]}
			disabled={disabled}
			onClick={onClick}
			onDelete={onDelete}
			avatar={avatarElement}
			icon={icon ? <SvgIcon>{icon}</SvgIcon> : undefined}
			className={className}
			style={style}
		/>
	);
};

/**
 * Props for the `ChipGroup` component.
 */
export type ChipGroupProps = {
	/**
	 * List of chips to render in the group.
	 */
	chips: ChipProps[];

	/**
	 * Gap between chips.
	 * Defaults to `"sm"`.
	 *
	 * - `"sm"` – 8px
	 * - `"md"` – 16px
	 */
	gap?: "sm" | "md";

	/**
	 * When `true`, chips wrap onto the next line when the container is full.
	 * Defaults to `true`.
	 */
	wrap?: boolean;

	/**
	 * Optional additional CSS class names applied to the group wrapper.
	 */
	className?: string;

	/**
	 * The test identifier used for automated testing.
	 * Mapped to `data-testid` on the rendered input element.
	 */
	testId: string;
};

/**
 * Renders a horizontal group of `Chip` components.
 *
 * Chips wrap onto the next line by default when the container is full.
 *
 * @example
 * ```tsx
 * <ChipGroup
 *   chips={[
 *     { label: "React", onDelete: () => remove("React") },
 *     { label: "TypeScript", color: "primary" },
 *     { label: "MUI", icon: <StarIcon />, onClick: () => select("MUI") },
 *   ]}
 * />
 * ```
 */
export const ChipGroup = ({
	chips,
	gap = "sm",
	wrap = true,
	className,
	testId,
}: ChipGroupProps) => {
	const gapMap = { sm: 1, md: 2 };

	return (
		<Box
			className={className}
			sx={{
				display: "flex",
				flexWrap: wrap ? "wrap" : "nowrap",
				gap: gapMap[gap],
			}}
		>
			{chips.map((chip) => (
				<Chip
					key={chip.label}
					{...chip}
					testId={`${testId}-${chip.label}`}
				/>
			))}
		</Box>
	);
};
