import {type PropsWithChildren, type ReactNode, useCallback, useMemo, useState} from "react";
import {Box, Drawer, Paper} from "@mui/material";
import React from "react";
import { SidebarContext, type SidebarState } from "./SidebarContext.tsx";
import Container from "../layout/Container.tsx";
import FlexContainer from "../layout/FlexContainer.tsx";
import Typography from "../display/Typography.tsx";
import IconButton from "../buttons/IconButton.tsx";

type SidebarFooterProps = {

	testId: string;

} & PropsWithChildren;

export const SidebarFooter = (props: SidebarFooterProps) => {

	return (
		<Box className={'sticky bottom-0 w-full'}>
			<Box className={'w-full relative'}>
				<Paper elevation={2} square>
					<FlexContainer padding={true}>
						{
							props.children
						}
					</FlexContainer>
				</Paper>
			</Box>
		</Box>
	);
}

type SidebarHeaderProps = {

	testId: string;

	title: string;

	subtitle?: string;

}

export const SidebarHeader = (props: SidebarHeaderProps) => {

	const sidebarContext = React.useContext(SidebarContext);

	return (
		<Box className={'sticky top-0 w-full z-2'}>
			<Paper variant={'outlined'} elevation={1} square>
				<FlexContainer padding={true} gap={true} align={'center'}>
					<IconButton icon={'close'}
								testId={`${props.testId}-close`}
								onClick={sidebarContext.close}
					/>
					<FlexContainer direction={'column'}			>
						<Typography
							component={'h2'}
							testId={`${props.testId}-header`}
						>
							{
								props.title
							}
						</Typography>
						{
							props.subtitle &&
							<Typography component={'subtitle1'}
										testId={`${props.testId}-subtitle`}
							>
								{
									props.subtitle
								}
							</Typography>
						}
					</FlexContainer>
				</FlexContainer>
			</Paper>
		</Box>
	);
}

const SidebarProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, dispatchOpen] = useState<boolean>(false);
	const [state, dispatchState] = useState<SidebarState[]>([]);

	const currentState = useMemo(() => {
		if (state.length === 0) return undefined;
		const cState = state[state.length - 1];
		return {
			...cState,
			statesCount: state.length,
		};
	}, [state]);

	const open = useCallback((state: SidebarState, stack?: boolean) => {
		if (stack === true) dispatchState((prevState) => [...prevState, state]);
		else dispatchState([state]);
		dispatchOpen(true);
	}, []);

	const close = useCallback(() => {
		if (state.length === 0) {
			dispatchOpen(false);
			return;
		}

		if (state.length === 1) {
			if (!state[0].onClose || state[0].onClose()) dispatchOpen(false);
			return;
		}

		const previousState = state[state.length - 1];
		if (!previousState.onClose || previousState.onClose())
			dispatchState((prevState) => prevState.slice(0, prevState.length - 1));
	},[state]);

	const width: string = useMemo(() => {
		switch (currentState?.size ?? "md") {
			case "full":
				return "max-w-100vw";
			case "xs":
				return "max-w-[24rem]";
			case "sm":
				return "max-w-[48rem]";
			case "md":
				return "max-w-[72rem]";
			case "lg":
				return "max-w-[96rem]";
			case "xl":
				return "max-w-[120rem]";
			case "auto":
				return "max-w-auto";
		}
	}, [currentState?.size]);

	const contextValue = useMemo(() => ({ isOpen, currentState, close, open }), [isOpen, currentState, close, open]);

	return (
		<SidebarContext.Provider value={contextValue}>
			{children}
			<React.Fragment key={"right"}>
				<Drawer
					anchor={"right"}
					open={isOpen}
					onClose={close}
					ModalProps={{
						disableEnforceFocus: true,
						keepMounted: true,
					}}
					sx={{ zIndex: 20 }}
					data-testid={currentState?.testId ? `${currentState.testId}-drawer` : undefined}
				>
					<Container fullWidth={true} fullHeight={true} className={`w-screen ${width} relative`}>
						{
							currentState?.content
						}
					</Container>
				</Drawer>
			</React.Fragment>
		</SidebarContext.Provider>
	);
};

export default SidebarProvider;