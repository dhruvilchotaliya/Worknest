import { Typography as MuiTypography } from "@mui/material";
import React, { type PropsWithChildren } from "react";

type TypographyProps = {
	component:
		| "h1"
		| "h2"
		| "h3"
		| "h4"
		| "h5"
		| "h6"
		| "subtitle1"
		| "subtitle2"
		| "body1"
		| "body2"
		| "caption"
		| "overline"
		| "inherit";
	className?: string;
	style?: React.CSSProperties;
	flex?: string;
	/**
	 * The test identifier used for automated testing.
	 */
	testId: string;
} & PropsWithChildren;

const Typography = (props: TypographyProps) => {
	return (
		<MuiTypography
			variant={props.component}
			className={props.className}
			style={props.style}
			data-testid={props.testId}
			sx={{
				flex: props.flex
			}}
		>
			{props.children}
		</MuiTypography>
	);
};

export default Typography;
