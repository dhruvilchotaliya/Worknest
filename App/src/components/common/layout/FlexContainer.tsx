import { Box } from "@mui/material";
import { type PropsWithChildren, useMemo } from "react";

type FlexContainerProps = {
	wrap?: boolean,
	padding?: boolean;
	directionalPadding?: boolean;
	gap?: boolean;
	direction?: "row" | "row-reverse" | "column" | "column-reverse";
	align?: "start" | "center" | "end" | "baseline" | "stretch";
	justify?:
		| "start"
		| "center"
		| "end"
		| "space-between"
		| "space-around";
	flex?: string;
	fullWidth?: boolean;
	fullHeight?: boolean;
	minWidth?: string;
	maxWidth?: string;
	minHeight?: string;
	maxHeight?: string;
	className?: string;
	testId?: string;

	/*
	* Callback fired when the container is clicked.
	*/
	onclick?: (event: React.MouseEvent<HTMLElement>) => void;
} & PropsWithChildren;

const FlexContainer = (props: FlexContainerProps) => {

	const direction = useMemo(() => {
		switch (props.direction) {
			case "row":
				return "horizontal";
			case "row-reverse":
				return "horizontal";
			case "column":
				return "vertical";
			case "column-reverse":
				return "vertical";
			default:
				return undefined;
		}
	}, [props.direction]);

	return (
		<Box
			component={"div"}
			className={props.className}
			sx={{
				flex: props.flex,
				position: "relative",
				flexWrap: props.wrap ? "wrap" : undefined,
				padding: props.padding ? "1rem" : undefined,
				gap: props.gap ? "1rem" : undefined,
				paddingY:
					props.directionalPadding && direction === "vertical"
						? "0.5rem"
						: undefined,
				paddingX:
					props.directionalPadding && direction === "horizontal"
						? "0.5rem"
						: undefined,
				display: "flex",
				flexDirection: props.direction,
				alignItems: props.align,
				justifyContent: props.justify,
				width: props.fullWidth ? "100%" : undefined,
				height: props.fullHeight ? "100%" : undefined,
				minWidth: props.minWidth ? props.minWidth : undefined,
				maxWidth: props.maxWidth ? props.maxWidth : "100%",
				minHeight: props.minHeight ? props.minHeight : undefined,
				maxHeight: props.maxHeight ? props.maxHeight : undefined,
			}}
			onClick={() => props.onclick}
			data-testid={props.testId}
		>
			{props.children}
		</Box>
	);
};

export default FlexContainer;
