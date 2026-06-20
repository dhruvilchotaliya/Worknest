import { LinearProgress, type SxProps, type Theme } from "@mui/material";

type LinearSpinnerProps = {
    variant?: "determinate" | "indeterminate" | "buffer" | "query";
    value?: number;
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning" | "inherit";
    sx?: SxProps<Theme>;
};

const LinearProgressBar = (props: LinearSpinnerProps) => {
    return (
        <LinearProgress
            variant={props.variant}
            value={props.value}
            color={props.color}
            sx={props.sx}
        />
    );
};

export default LinearProgressBar;