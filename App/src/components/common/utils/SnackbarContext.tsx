import React, {createContext, type PropsWithChildren} from "react";
import type {SnackbarProps} from "./Snackbar.tsx";
import {SnackbarProvider as NotistackSnackbarProvider, useSnackbar as useNotistackSnackbar} from "notistack";

type SnackbarContextValue = {
    content?: React.ReactNode | string;
    variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
} & Omit<SnackbarProps, 'horizontal' | 'vertical' | 'message'>;

export type SnackbarContextState = {
    dispatchSnackbar: (snackbar: SnackbarContextValue) => void;
    closeSnackbar: (key: string) => void;
};

const InternalSnackbarProvider = (props: PropsWithChildren) => {

    const notistackSnackbar = useNotistackSnackbar();

    const dispatchSnackbar = ((snackbar: SnackbarContextValue) => {
        notistackSnackbar.enqueueSnackbar(snackbar.content ?? '', {
            key: snackbar.key,
            action: snackbar.action,
            onClose: snackbar.onClose,
            variant: snackbar.variant
        });
    });

    const closeSnackbar = (key: string) => {
        notistackSnackbar.closeSnackbar(key);
    }

    return (
        <SnackbarContext.Provider value={{dispatchSnackbar, closeSnackbar}}>
            {
                props.children
            }
        </SnackbarContext.Provider>
    );
}

type SnackbarProviderProps = {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
} & PropsWithChildren;

export const SnackbarProvider = (props: SnackbarProviderProps) => {
    return (

        <NotistackSnackbarProvider maxSnack={5} anchorOrigin={{vertical: props.vertical, horizontal: props.horizontal}}>
            <InternalSnackbarProvider>
                {
                    props.children
                }
            </InternalSnackbarProvider>
        </NotistackSnackbarProvider>
    );
};

const SnackbarContext = createContext<SnackbarContextState>({
    dispatchSnackbar: () => {},
    closeSnackbar: () => {}
});

export default SnackbarContext;