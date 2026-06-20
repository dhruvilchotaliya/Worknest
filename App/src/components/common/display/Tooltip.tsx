import React from "react";
import { Tooltip as MuiTooltip, type TooltipProps as MuiTooltipProps} from "@mui/material";

export type TooltipPlacement =
	| "bottom-end"
	| "bottom-start"
	| "bottom"
	| "left-end"
	| "left-start"
	| "left"
	| "right-end"
	| "right-start"
	| "right"
	| "top-end"
	| "top-start"
	| "top";

export interface TooltipProps {
	/** 
     * The tooltip content. Can be a string, number, or any React node. 
     */
	title: React.ReactNode;

	/** 
     * The element the tooltip is attached to. Must be a single React element. 
     */
	children: React.ReactElement;


	/**
     *  If true, the tooltip is disabled and will never show.
     */
	disableTooltip?: boolean;

	/** 
     * Tooltip placement relative to the child element. Defaults to "bottom".
    */
	placement?: TooltipPlacement;

	/** 
     * Class name applied to the tooltip popper element.
     */
	className?: string;

    /**
     * If true, the tooltip will not be shown when the child element receives focus.
     */
    disableFocusListener?: boolean;

	testId: string;
}

const Tooltip = ({
	title,
	children,
    className,
	disableTooltip = false,
    disableFocusListener,
    testId,
	placement = "bottom",
}: TooltipProps) => {
	if (disableTooltip || !title) {
		return <>{children}</>;
	}

	return (
		<MuiTooltip
			title={title}
			placement={placement}
            disableFocusListener={disableFocusListener}
            arrow
            className={className}
            slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -8],
                      },
                    },
                  ],
                },
              }}
              data-testid={testId}
		>
			{children}
		</MuiTooltip>
	);
};

export default Tooltip;