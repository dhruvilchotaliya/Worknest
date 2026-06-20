import MuiCard from "@mui/material/Card";
import MuiCardActionArea from "@mui/material/CardActionArea";
import MuiCardActions from "@mui/material/CardActions";
import MuiCardContent from "@mui/material/CardContent";
import MuiCardHeader from "@mui/material/CardHeader";
import MuiCardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import GlobalStyles from "@mui/material/GlobalStyles";
import {alpha, useTheme} from "@mui/material/styles";
import React, {type PropsWithChildren} from "react";

/**
 * The visual style variant of the card.
 *
 * - `"elevation"` – Renders the card with a drop shadow.
 * - `"outlined"` – Renders the card with a visible border and no shadow.
 */
export type CardVariant = "elevation" | "outlined";

/**
 * Controls the interactive behavior of the card surface.
 *
 * - `"area"` – The entire card surface is clickable.
 * - `"none"` – The card is purely presentational with no click interaction.
 */
export type CardInteraction = "area" | "none";

/**
 * The hover effect applied to the card.
 *
 * - `"default"` – On elevation cards, bumps the shadow depth by +4 on hover.
 *   On outlined cards, changes the border color to the theme primary.
 * - `"pop"` – Same as `"default"` plus a subtle upward lift (`translateY(-2px)`)
 *   and a slightly stronger, softer shadow for a "popping" feel.
 * - `"snake"` – A continuous animated gradient ring travels around the card's
 *   border while hovered, cycling through the theme's accent colors.
 *
 * When the prop is omitted, no hover effect is applied.
 */
export type HoverEffect = "default" | "pop" | "snake";

/**
 * Props for the `CardHeader` component.
 */
export type CardHeaderProps = {
    /**
     * The primary title of the card.
     */
    title: React.ReactNode;

    /**
     * Optional secondary text displayed below the title.
     */
    subheader?: React.ReactNode;

    /**
     * Optional avatar element displayed to the left of the title.
     * Accepts any React node — typically an `<Avatar>` or an icon.
     */
    avatar?: React.ReactNode;

    /**
     * Optional action element displayed in the top-right corner.
     * Typically an icon button or a menu trigger.
     */
    action?: React.ReactNode;

    /**
     * Horizontal padding applied to the header area in px.
     * Defaults to 16.
     */
    paddingX?: number;

    /**
     * Vertical padding applied to the header area in px.
     * Defaults to 10.
     */
    paddingY?: number;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered button element.
     */
    testId: string;
    /**
     * Optional additional CSS class names applied to the card body element.
     */
    className?: string;

    /**
     * Optional additional CSS class names applied directly to the underlying
     * `CardHeader`root element.
     */
    headerClassName?: string;

    /**
     * Optional additional CSS class names applied to the 
     * `CardHeader`action slot.
     */    
    actionClassName?: string;
    
}& PropsWithChildren;

/**
 * Renders the header section of a card — title, optional subheader,
 * avatar, and a top-right action slot.
 *
 * Must be used as a direct child of `Card`.
 *
 * @example
 * ```tsx
 * <CardHeader
 *   title="Invoice #1042"
 *   subheader="Due 31 Jan 2026"
 *   avatar={<Avatar>J</Avatar>}
 *   action={<IconButton><MoreVertIcon /></IconButton>}
 * />
 * ```
 */
export const CardHeader = ({
                               title,
                               subheader,
                               avatar,
                               action,
                               paddingX = 16,
                               paddingY = 10,
                               testId,
                               children,
                               className,
                               headerClassName,
                               actionClassName
                           }: CardHeaderProps) => {
    return (
        <div data-testid={testId} className={className}>
            {children}
            <MuiCardHeader
                   sx={{
                    padding: `${paddingY}px ${paddingX}px`,
                    flex: 0,
                    flexWrap: "wrap",
                    "& .MuiCardHeader-content": {
                        minWidth: 0,
                        flex: 1,
                    },
                    "& .MuiCardHeader-action": {
                        margin: 0,
                        alignSelf: "flex-start",
                        flexShrink: 0,
                    },
                }}
                title={title}
                subheader={subheader}
                avatar={avatar}
                action={action}
                className={headerClassName}
                classes={{
                    action: actionClassName,
                }}
            />
        </div>
    );
};

/**
 * Props for the `CardMedia` component.
 */
export type CardMediaProps = {

    /**
     * The URL of the image to display.
     */
    src: string;

    /**
     * Accessible alternative text for the image.
     */
    alt: string;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered button element.
     */
    testId: string;

     /**
     * Optional additional CSS class names applied to the card media element.
     */
    className?: string;

};

/**
 * Renders an image media area inside a card.
 *
 * Must be used as a direct child of `Card`, typically placed
 * immediately after `CardHeader` or at the top of the card.
 *
 * @example
 * ```tsx
 * <CardMedia src="/images/product.jpg" alt="Product preview" height={180} />
 * ```
 */
export const CardMedia = ({
                              src,
                              alt,
                              testId,
                              className
                          }: CardMediaProps) => {
    return (
        <MuiCardMedia
            component="img"
            src={src}
            alt={alt}
            data-testid={testId}
            className={className}
        />
    );
};

/**
 * Props for the `CardBody` component.
 */
export type CardBodyProps = {

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered button element.
     */
    testId: string;

    /**
     * Optional additional CSS class names applied to the card body element.
     */
    className?: string;

} & PropsWithChildren;

/**
 * Renders the main content area of a card.
 *
 * Must be used as a direct child of `Card`.
 *
 * @example
 * ```tsx
 * <CardBody paddingX={16} paddingY={24}>
 *   <Typography>Your content here.</Typography>
 * </CardBody>
 * ```
 */
export const CardBody = ({
     children,
     testId,
     className
}: CardBodyProps) => {
    return (
        <MuiCardContent
            data-testid={testId}
            sx={{flex: 1}}
            className={className}
        >
            {children}
        </MuiCardContent>
    );
};

/**
 * Props for the `CardActions` component.
 */
export type CardActionsProps = {

    /**
     * When `true`, renders a divider above the actions area.
     */
    divider?: boolean;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered button element.
     */
    testId: string;

    /**
     * Optional additional CSS class names applied to the card actions element.
     */
    className?: string;

} & PropsWithChildren;

/**
 * Renders the actions / footer area of a card.
 *
 * Must be used as a direct child of `Card`, typically placed last.
 *
 * @example
 * ```tsx
 * <CardActions divider paddingX={16} paddingY={8}>
 *   <Button variant="contained">Confirm</Button>
 *   <Button variant="text">Cancel</Button>
 * </CardActions>
 * ```
 */
export const CardActions = ({
                                children,
                                divider = false,
                                testId,
                                className
                            }: CardActionsProps) => {
    return (
        <>
            {divider && <Divider/>}
            <MuiCardActions
                className={className}
                data-testid={testId}
            >
                {children}
            </MuiCardActions>
        </>
    );
};

/**
 * Props for the `CardActionArea` component.
 */
export type CardActionAreaProps = {

    /**
     * Callback fired when the card area is clicked. Only relevant when used as a child of `Card` with `interaction="area"`.
     */
    onClick?: () => void;

    /**
     * When `true`, applies the selected background and hover colors
     * via the `data-active` attribute — the idiomatic MUI pattern.
     */
    selected?: boolean;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered button element.
     */
    testId: string;

} & PropsWithChildren;

/**
 * Makes the entire card surface clickable with a ripple effect.
 *
 * Use this when the whole card should act as a single interactive target.
 * Pair `selected` with `onClick` to manage selection state from the parent.
 *
 * Must be used as a direct child of `Card`.
 *
 * @example
 * ```tsx
 * <Card variant="outlined">
 *   <CardActionArea selected={selectedId === item.id} onClick={() => setSelectedId(item.id)}>
 *     <CardHeader title="Pro Plan" />
 *     <CardBody>...</CardBody>
 *   </CardActionArea>
 * </Card>
 * ```
 */
export const CardActionArea = ({
	onClick,
	selected = false,
	children,
	testId,
}: CardActionAreaProps) => {
	return (
		<MuiCardActionArea
			onClick={onClick}
			data-active={selected ? "" : undefined}
			data-testid={testId}
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				flex: 1,
				backgroundColor: "transparent",
				"& .MuiCardActionArea-focusHighlight": {
					background: "none",
				},
				"&[data-active]": {
					backgroundColor: "transparent",
					"&:hover": {
						backgroundColor: "transparent",
					},
				},
				"&:hover": {
					backgroundColor: "transparent",
				},
			}}
		>
			{children}
		</MuiCardActionArea>
	);
};

/**
 * Props for the root `Card` component.
 */
export type CardProps = {

    /**
     * The visual style variant of the card.
     */
    variant?: CardVariant;

    /**
     * The shadow depth when `variant` is `"elevation"`.
     * Accepts values from 0 to 24.
     */
    elevation?: number;

    /**
     * Controls interactive behavior of the card surface.
     */
    interaction?: CardInteraction;

    /**
     * Callback fired when the card area is clicked.
     * Only relevant when `interaction` is `"area"`.
     */
    onClick?: () => void;

    /**
     * When `true`, renders the card in a visually selected state —
     * highlighted border and background using the theme's primary color.
     *
     * Useful for selection lists or choice UIs.
     */
    selected?: boolean;

    /**
     * When `true`, the card stretches to fill the height of its container.
     */
    fullHeight?: boolean;

    /**
     * When `true`, the card stretches to fill the width of its container.
     */
    fullWidth?: boolean;

    /**
     * Optional additional CSS class names applied to the root card element.
     */
    className?: string;

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered button element.
     */
    testId: string;

    /**
     * The hover effect applied to the card. When omitted, no hover effect is applied.
     *
     * See {@link HoverEffect} for the available effect variants.
     */
    hoverEffect?: HoverEffect;

    /**
     * Optional inline styles applied to the root card element.
     */
    style?: React.CSSProperties;

} & PropsWithChildren;

/**
 * Root card container. Compose with `CardHeader`, `CardMedia`,
 * `CardBody`, and `CardActions` as children.
 *
 * Use `selected` to highlight the card when it is part of a selectable list.
 * Use `interaction="area"` to make the entire card surface clickable.
 */
export const Card = ({
                         variant = "elevation",
                         elevation = 1,
                         interaction = "none",
                         onClick,
                         selected = false,
                         fullHeight = false,
                         fullWidth = false,
                         className,
                         children,
                         testId,
                         hoverEffect,
                         style,
                     }: CardProps) => {
    const theme = useTheme();

    const baseHover = variant === "outlined"
        ? { borderColor: theme.palette.primary.main }
        : { boxShadow: theme.shadows[Math.min(elevation + 4, 24)] };

    let hoverSx: Record<string, unknown> = {};
    if (hoverEffect === "default") {
        hoverSx = { "&:hover": baseHover };
    } else if (hoverEffect === "pop") {
        hoverSx = {
            "&:hover": {
                ...baseHover,
                transform: "translateY(-2px)",
                boxShadow: variant === "elevation"
                    ? theme.shadows[Math.min(elevation + 6, 24)]
                    : `0 10px 24px -10px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
        };
    } else if (hoverEffect === "snake") {
        const snakeGradient = `conic-gradient(from var(--athentra-snake-angle, 0deg), ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.info.main}, ${theme.palette.success.main}, ${theme.palette.primary.main})`;
        hoverSx = {
            position: "relative",
            overflow: "visible",
            "&::before": {
                content: '""',
                position: "absolute",
                inset: -10,
                borderRadius: "inherit",
                padding: "12px",
                background: snakeGradient,
                WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
                opacity: 0,
                transition: "opacity 220ms ease",
                zIndex: 1,
                filter: "blur(18px) saturate(1.3)",
            },
            "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                padding: "2px",
                background: snakeGradient,
                WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
                opacity: 0,
                transition: "opacity 220ms ease",
                zIndex: 2,
                filter: `
                    drop-shadow(0 0 2px ${alpha(theme.palette.primary.main, 0.55)})
                    drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.22)})
                    drop-shadow(0 0 14px ${alpha(theme.palette.secondary.main, 0.1)})
                `,
            },
            "&:hover": {
                boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.05)}`,
            },
            "&:hover::before": {
                opacity: 0.08,
                animation: "athentra-card-snake 3s linear infinite",
            },
            "&:hover::after": {
                opacity: 0.85,
                animation: "athentra-card-snake 3s linear infinite",
            },
        };
    }

    return (
        <>
            {hoverEffect === "snake" && (
                <GlobalStyles
                    styles={`
                        @property --athentra-snake-angle {
                            syntax: '<angle>';
                            initial-value: 0deg;
                            inherits: false;
                        }
                        @keyframes athentra-card-snake {
                            to { --athentra-snake-angle: 360deg; }
                        }
                    `}
                />
            )}
            <MuiCard
                variant={variant}
                elevation={variant === "outlined" ? 0 : elevation}
                className={className}
                style={style}
				onClick={interaction === "area" ? onClick : undefined}
				onKeyDown={interaction === "area" ? (e) => {
                    if (e.key === "Enter" || e.key === " ") onClick?.();
                } : undefined}
				role={interaction === "area" ? "button" : undefined}
				tabIndex={interaction === "area" ? 0 : undefined}
                sx={{
                    maxWidth: '100%',
                    height: fullHeight ? "100%" : undefined,
                    width: fullWidth ? "100%" : undefined,
                    display: "flex",
                    flexDirection: "column",
                    ...(selected && {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.action.selected,
                    }),
                    transition: "outline 0.15s ease, background-color 0.15s ease, box-shadow 220ms cubic-bezier(0.4, 0, 0.2, 1), border-color 220ms cubic-bezier(0.4, 0, 0.2, 1), transform 220ms cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: interaction === "area" ? "pointer" : "default",
                    ...hoverSx,
                }}
                data-testid={testId}
            >
				{children}
            </MuiCard>
        </>
    );
};
