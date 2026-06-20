import {Box} from "@mui/material";
import {type PropsWithChildren} from "react";

type FormGroupProps = {
    padding?: boolean;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    className?: string;
    testId?: string;
} & PropsWithChildren;

const FormGroup = (props: FormGroupProps) => {
    return (
        <Box
            component={'div'}
            className={props.className}
            data-testid={props.testId}
            sx={{
                flexWrap: 'wrap',
                padding: props.padding ? '0.5rem' : undefined,
                gap: '0.5rem',
                display: 'flex',
                flexDirection: props.direction ?? 'column',
                flex: '1 1'
            }}
        >
            {
                props.children
            }
        </Box>
    )
}

export default FormGroup;