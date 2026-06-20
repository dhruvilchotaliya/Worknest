import type {CSSProperties} from "react";

/**
 * Properties for any input component.
 */
export type InputProps = {

    /**
     * The test identifier used for automated testing.
     * Mapped to `data-testid` on the rendered input element.
     */
    testId: string;

    /**
     * The ID of the element
     */
    id?: string

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
     * Whether the input is required to be filled.
     */
    required?: boolean;

    /**
     * The display mode of the input.
     * @default 'editable'
     */
    displayMode?: 'editable' | 'readonly' | 'disabled' | 'hidden' | 'text';
}