import React, {type CSSProperties} from "react";

export type ButtonProps = {

    /**
    * The ID of the element
    */
    id?: string

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered button element.
     */
    testId: string;

    /**
     * The name of the element
     */
    name?: string;

    /**
     * The class list of the element
     */
    className?: string;

    /**
     * The CSS styling of the element.
     */
    style?: CSSProperties;

    /**
     * The tooltip to display when hovering over the button.
     */
    tooltip?: string,

    /**
     * The display mode of the input.
     * @default 'editable'
     */
    displayMode?: 'editable' | 'disabled' | 'hidden';

    /**
     * Button type.
     * @default 'button'
     */
    type?: "button" | "submit" | "reset";

    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     */
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit',

    /**
     * Whether the button is loading.
     */
    loading?: boolean

    /**
     * Click handler.
     */
    onClick?: React.MouseEventHandler<HTMLButtonElement>;

    /**
     * The content rendered within the badge.
     */
    badgeContent?: number,

    /**
     * The color of the badge.
     */
    badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
}