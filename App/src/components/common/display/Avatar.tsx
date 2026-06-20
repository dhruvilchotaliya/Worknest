import { Box, Tooltip } from "@mui/material";
import MuiAvatar from "@mui/material/Avatar";
import MuiAvatarGroup from "@mui/material/AvatarGroup";
import Popover from "@mui/material/Popover";
import type { SxProps, Theme } from "@mui/material/styles";
import { useState } from "react";

/**
 * The shape of the avatar.
 *
 * - `"circular"` – Fully rounded (default).
 * - `"rounded"` – Slightly rounded corners.
 * - `"square"` – No border radius.
 */
type AvatarVariant = "circular" | "rounded" | "square";

/**
 * The size of the avatar.
 *
 * - `"sm"` – 24px
 * - `"md"` – 40px (default)
 * - `"lg"` – 56px
 */
type AvatarSize = "sm" | "md" | "lg";

const sizeMap: Record<AvatarSize, number> = {
	sm: 24,
	md: 30,
	lg: 56,
};

/**
 * Props for the `Avatar` component.
 */
export type AvatarProps = {
	/**
	 * The URL of the image to display.
	 * When provided, the avatar renders as an image.
	 */
	src?: string;

	/**
	 * Accessible alternative text for the image.
	 * Also used to derive initials when `src` is not provided or fails to load.
	 */
	alt?: string;

	/**
	 * Text or initials to display inside the avatar.
	 * Typically 1–2 characters. Used when `src` is not provided.
	 */
	initials?: string;

	/**
	 * Icon to display inside the avatar.
	 * Used when neither `src` nor `initials` are provided.
	 */
	icon?: React.ReactNode;

	/**
	 * Fallback content rendered when the image fails to load.
	 * Defaults to initials if provided, then icon, then a generic person icon.
	 */
	fallback?: React.ReactNode;

	/**
	 * Tooltip text shown on hover.
	 * Typically used to display the user's full name.
	 */
	tooltip?: string;

	/**
	 * The shape of the avatar.
	 * Defaults to `"circular"`.
	 */
	variant?: AvatarVariant;

	/**
	 * The size of the avatar.
	 * Defaults to `"md"`.
	 */
	size?: AvatarSize;

	/**
	 * Optional additional CSS class names applied to the avatar.
	 */
	className?: string;

	/**
	 * Optional inline styles applied to the avatar.
	 */
	style?: React.CSSProperties;

	/**
	 * Optional MUI sx prop for advanced theming.
	 * Kept internal — consumers should prefer `className` or `style`.
	 */
	sx?: SxProps<Theme>;

	/**
	 * The test identifier used for automated testing.
	 * Mapped to `data-testid` on the rendered input element.
	 */
	testId: string;
};

/**
 * Displays a user avatar — image, initials, icon, or a fallback.
 *
 * Priority order for content:
 * 1. `src` image (with fallback on error)
 * 2. `initials`
 * 3. `icon`
 * 4. `fallback`
 * 5. MUI default person icon
 *
 * @example
 * ```tsx
 * // Image avatar
 * <Avatar src="/user.jpg" alt="Alice Bob" size="md" />
 *
 * // Initials avatar
 * <Avatar initials="AM" size="lg" />
 *
 * // Icon avatar
 * <Avatar icon={<PersonIcon />} variant="rounded" />
 *
 * // With fallback when image fails
 * <Avatar src="/broken.jpg" alt="Alice Bob" fallback={<PersonIcon />} />
 * ```
 */
const Avatar = ({
	src,
	alt,
	initials,
	icon,
	fallback,
	variant = "circular",
	tooltip,
	size = "md",
	className,
	style,
	sx,
	testId,
}: AvatarProps) => {
	const dimension = sizeMap[size];

	// Determine what to render inside the avatar when no image is present
	// or as fallback when the image fails to load.
	const innerContent = initials ?? icon ?? fallback ?? undefined;

	const avatar = (
		<MuiAvatar
			src={src}
			alt={alt}
			variant={variant}
			className={className}
			style={style}
			data-testid={testId}
			sx={{
				width: dimension,
				height: dimension,
				fontSize: dimension * 0.4,
				...sx,
			}}
		>
			{innerContent}
		</MuiAvatar>
	);

	if (!tooltip) return avatar;

	return (
		<Tooltip title={tooltip} arrow>
			{avatar}
		</Tooltip>
	);
};

/**
 * Props for the `AvatarGroup` component.
 */
export type AvatarGroupProps = {
	/**
	 * List of avatars to display in the group.
	 */
	avatars: AvatarProps[];

	/**
	 * Maximum number of avatars to show before collapsing into an overflow indicator.
	 * Defaults to `4`.
	 */
	max?: number;

	/**
	 * The size applied uniformly to all avatars in the group.
	 * Defaults to `"md"`.
	 */
	size?: AvatarSize;

	/**
	 * When `true`, clicking the overflow indicator opens a popover
	 * listing all hidden avatars.
	 * Defaults to `true`.
	 */
	overflowPopover?: boolean;

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
 * Displays a group of avatars with an overflow count indicator.
 *
 * When the number of avatars exceeds `max`, the remaining avatars are
 * collapsed into a `+N` indicator. If `overflowPopover` is `true`,
 * clicking the indicator opens a popover listing all hidden avatars.
 *
 * @example
 * ```tsx
 * <AvatarGroup
 *   avatars={[
 *     { src: "/a.jpg", alt: "Ailani Truong" },
 *     { initials: "PL", alt: "Paisleigh Luna" },
 *     { src: "/c.jpg", alt: "Creed Levy" },
 *     { initials: "NA", alt: "Noah Adams" },
 *     { src: "/d.jpg", alt: "Della Callahan" },
 *   ]}
 *   max={3}
 *   overflowPopover
 * />
 * ```
 */
export const AvatarGroup = ({
	avatars,
	max = 4,
	size = "md",
	overflowPopover = true,
	className,
	testId,
}: AvatarGroupProps) => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const overflowAvatars = avatars.slice(max - 1);
	const hasOverflow = overflowAvatars.length > 0;

	const handleOverflowClick: (e: React.MouseEvent<HTMLElement>) => void = (
		e
	) => {
		if (overflowPopover && hasOverflow) {
			// The overflow surplus element is the last child of the group wrapper
			setAnchorEl(e.currentTarget);
		}
	};

	const handleClose = () => setAnchorEl(null);

	const open = Boolean(anchorEl);

	const dimension = sizeMap[size];

	return (
		<>
			<MuiAvatarGroup
				max={max}
				className={className}
				data-testid={testId}
				slotProps={{
					surplus: {
						onClick: handleOverflowClick,
						style: {
							cursor: overflowPopover && hasOverflow ? "pointer" : undefined,
							width: dimension,
							height: dimension,
							fontSize: dimension * 0.4,
						  },
					},
				}}
				spacing="small"
			>
				{avatars.map((avatar, index) => (
					<Avatar
						key={avatar.alt ?? index}
						{...avatar}
						size={size}
						tooltip={avatar.tooltip}
						testId={`${testId}-${index}`}
					/>
				))}
			</MuiAvatarGroup>

			{overflowPopover && (
				<Popover
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
				>
					<Box className="flex flex-col gap-2 p-3">
						{overflowAvatars.map((avatar, index) => (
							<Box
								key={avatar.alt ?? index}
								className="flex items-center gap-2"
							>
								<Avatar {...avatar} size={size} />
								{avatar.alt && (
									<span className="text-sm text-gray-700">
										{avatar.alt}
									</span>
								)}
							</Box>
						))}
					</Box>
				</Popover>
			)}
		</>
	);
};

export default Avatar;
