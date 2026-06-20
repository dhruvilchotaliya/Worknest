import {type ReactNode} from "react";
import {Tabs as MuiTabs, Tab} from "@mui/material";
import FlexContainer from "../layout/FlexContainer.tsx";
import Container from "../layout/Container.tsx";
import Icon, {type IconColor, type IconType} from "./Icon.tsx";

export type TabItem = {
    /**
     * Unique tab identifier
     */
    id: string;

    /**
     * Tab label
     */
    label: string;

    /**
     * Optional tab icon
     */
    icon?: IconType;

    /**
     * The color of the icon. Default is 'default'.
     */
    iconColor?: IconColor;

    /**
     * The position of the icon relative to the label. Default is 'start'.
     */
    iconPosition?: 'top' | 'bottom' | 'start' | 'end';

    /**
     * Tab content
     */
    content: ReactNode;

    /**
     * The test identifier used for automated testing.
     */
    testId: string;
};

type TabsProps = {
    /**
     * Tabs configuration
     */
    tabs: TabItem[];

    /**
     * Currently active tab id (controlled)
     */
    value: string;

    /**
     * Tab change handler
     */
    onChange: (tabId: string) => void;

    /**
     * Whether content should fill remaining space
     */
    fillHeight?: boolean;

    /**
     * The test identifier used for automated testing.
     */
    testId: string;
};

const Tabs = (props: TabsProps) => {

    const {tabs, value, onChange, fillHeight} = props;

    return (
        <FlexContainer direction={'column'} fullHeight={true} minHeight={'0'}>
            <MuiTabs
                value={value}
                onChange={(_, newValue) => onChange(newValue)}
                variant="scrollable"
                scrollButtons='auto'
                textColor={'primary'}
                indicatorColor={'primary'}
                data-testid={props.testId}
                allowScrollButtonsMobile
            >
                {
                    tabs.map((tab) => (
                        <Tab
                            key={tab.id}
                            value={tab.id}
                            label={tab.label}
                            iconPosition={'start'}
                            icon={tab.icon ? <Icon icon={tab.icon} color={tab.iconColor || 'inherit'}/> : undefined}
                            data-testid={tab.testId}
                            sx={{
                                minHeight: 48,
                            }}
                        />
                    ))
                }
            </MuiTabs>

            <Container flex={'1 1'}
                       overflowY={'auto'}
                       style={{minHeight: fillHeight ? 0 : undefined, marginTop: 16}}>
                {
                    tabs.filter(tab => tab.id === value)
                        .map((tab) => (
                            <Container key={tab.id}>
                                {tab.content}
                            </Container>
                        )
                    )
                }
            </Container>
        </FlexContainer>
    );
};

export default Tabs;
