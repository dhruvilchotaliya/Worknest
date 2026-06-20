import { Alert as MuiAlert } from "@mui/material";
import {useTheme} from "@mui/material/styles";
import React, {type PropsWithChildren, useMemo} from "react";

export type AlertSeverity = 'success' | 'error' | 'warning' | 'info';

type AlertProps = {
    testId?: string,
    color?: AlertSeverity,
    icon?: React.ReactNode,
    severity?: AlertSeverity,
    variant?: 'filled' | 'outlined' | 'outlined-solid' | 'standard',
    className?: string,
    useHoverEffect?: boolean,
} & PropsWithChildren;

const Alert = ({
    testId,
    color,
    icon,
    severity,
    variant: variantProp,
    className,
    useHoverEffect = false,
    children,
}: AlertProps) => {
    const theme = useTheme();

    const variant = useMemo(() => {
        switch (variantProp) {
            case 'outlined-solid':
                return 'outlined';
            default:
                return variantProp;
        }
    }, [variantProp]);

    const resolvedColor = color ?? severity ?? 'info';

    const hoverSx = useHoverEffect
        ? variantProp === 'filled'
            ? {
                "&:hover": {
                    boxShadow: theme.shadows[4],
                },
            }
            : {
                border: `1px solid transparent`,
                "&:hover": {
                    borderColor: theme.palette[resolvedColor].main,
                },
            }
        : {};

    return (
        <MuiAlert icon={icon}
                  severity={severity}
                  variant={variant}
                  color={color}
                  sx={{
                      bgcolor: variantProp === 'outlined-solid' ? 'background.paper' : undefined,
                      marginBottom: '0.5rem',
                      transition: "box-shadow 0.15s ease, border-color 0.15s ease",
                      ...hoverSx,
                  }}
                  className={className}
                  data-testid={testId}
        >
            {children}
        </MuiAlert>
    );
}

export default Alert;