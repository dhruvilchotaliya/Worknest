import {Box} from "@mui/material";
import React, {type PropsWithChildren} from "react";

type ContainerProps = {

    /**
     * The test identifier used for automated testing. Mapped to `data-testid` on the rendered container element.
     */
    testId?: string;

    /**
     * If true, the container will take up the full width of its parent. This is useful for layouts where the container needs to fill the available horizontal space.
     */
    fullWidth?: boolean;

    /**
     * If true, the container will take up the full height of its parent. This is useful for layouts where the container needs to fill the available vertical space.
     */
    fullHeight?: boolean;

    /**
     * The CSS class name to apply to the container element.
     */
    className?: string;

    /**
     * The CSS flex property to apply to the container element. This allows for flexible layouts when used within a flex container.
     */
    flex?: string;

    /**
     * The CSS overflow property to apply to the container element. This controls how content that exceeds the container's bounds is handled. Defaults to 'auto', which adds scrollbars when necessary.
     */
    overflow?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';

    /**
     * The CSS overflow-y property to apply to the container element. This controls how vertical overflow is handled. If not specified, it will inherit the value from the `overflow` property.
     */
    overflowY?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';

    /**
     * The CSS overflow-x property to apply to the container element. This controls how horizontal overflow is handled. If not specified, it will inherit the value from the `overflow` property.
     */
    overflowX?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';

    /**
     * The inline CSS styles to apply to the container element. This allows for custom styling of the container. Note that styles defined here will override any conflicting styles set by other props (e.g., `fullWidth`, `fullHeight`, etc.).
     */
    style?: React.CSSProperties;

    ref?: React.Ref<HTMLDivElement>;

} & PropsWithChildren;

const Container = (props: ContainerProps) => {
    return (
        <Box data-testid={props.testId}
             ref={props.ref}
             style={props.style}
             className={props.className}
             sx={{
                 position: 'relative',
                 width: props.fullWidth ? '100%' : undefined,
                 height: props.fullHeight ? '100%' : undefined,
                 overflow: props.overflow ?? undefined,
                 overflowY: props.overflowY ?? undefined,
                 overflowX: props.overflowX ?? undefined,
                 flex: props.flex,
             }}
        >
            {
                props.children
            }
        </Box>
    );
};

export default Container;