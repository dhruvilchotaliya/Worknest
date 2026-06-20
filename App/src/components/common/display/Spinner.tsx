import {CircularProgress, type SxProps, type Theme} from "@mui/material";

export type SpinnerProps = {

    variant?: 'determinate' | 'indeterminate'

    value?: number

    size?: number | 'inherit' | 'small' | 'medium' | 'large'

    sx?: SxProps<Theme>
}

const Spinner = (props: SpinnerProps) => {
    return (
        <CircularProgress variant={props.variant} value={props.value} size={props.size} sx={props.sx} />
    )
}

export default Spinner;