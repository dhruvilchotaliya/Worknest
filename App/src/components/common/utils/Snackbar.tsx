import { Snackbar as MuiSnackbar } from "@mui/material";
import React, {type PropsWithChildren, useState} from "react";
import FlexContainer from "../layout/FlexContainer.tsx";
import IconButton from "../buttons/IconButton.tsx";
import Button from "../buttons/Button.tsx";

export type SnackbarProps = {
    key: string;
    open?: boolean;
    onClose?: () => void;
    autoHideDuration?: number;
    message?: string;
    action?: React.ReactNode;
    vertical?: 'top' | 'bottom';
    horizontal?: 'left' | 'center' | 'right';
    children?: React.ReactElement;
} & PropsWithChildren;

type DetailsActionProps = {
    key: string;
    details?: string;
    close: (key: string) => void;
}

export const GeneralSnackbarAction = (props: DetailsActionProps) => {

    const [copied, setCopied] = useState<boolean>(false);

    return (
        <FlexContainer gap={true}>
            {
                props.details && (
                    <IconButton tooltip={copied ? 'Copied!' : undefined} className={'text-white'} icon={copied ? 'Check' : 'CopyAll'} testId={'snackbar-copy'} onClick={() => {
                        navigator.clipboard.writeText(props.details ?? '')
                            .then(() => setCopied(true))
                            .catch(() => console.error('Failed to copy to clipboard'))
                    }} />
                )
            }
            <Button label={'Dismiss'} testId={'snackbar-dismiss'} onClick={() => props.close(props.key)} color={'primary'} className={'text-white'} />
        </FlexContainer>
    )
}

const Snackbar = (props: SnackbarProps) => {
    return (
        <MuiSnackbar
            anchorOrigin={{ vertical: props.vertical ?? 'bottom', horizontal: props.horizontal ?? 'center' }}
            key={`snackbar-${props.key}`}
            data-testid={`snackbar-${props.key}`}
            open={props.open}
            autoHideDuration={props.autoHideDuration}
            onClose={props.onClose}
            message={props.message}
            action={props.action}
        >
            {
                props.children
            }
        </MuiSnackbar>
    )
}

export default Snackbar;