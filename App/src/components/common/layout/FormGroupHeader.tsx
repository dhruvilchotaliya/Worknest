import React from "react";
import FlexContainer from "./FlexContainer.tsx";
import Icon, {type IconType} from "../display/Icon.tsx";
import Typography from "../display/Typography.tsx";
import Container from "./Container.tsx";

type FormGroupHeaderProps = {
    title?: string;
    subtitle?: string;
    headingIcon?: IconType;
    action?: React.ReactNode;
    padded?: boolean;
    testId?: string;
};

export const FormGroupHeader = (props: FormGroupHeaderProps) => {
    return (
        <FlexContainer data-testid={props.testId}
                       gap={true}
                       fullWidth={true}
        >
            {
                props.headingIcon && (
                    <FlexContainer flex={'auto'} align={'center'} justify={'center'}>
                        <Icon size={'large'} icon={props.headingIcon} />
                    </FlexContainer>
                )
            }
            {
                props.title && (
                    <FlexContainer data-testid={`${props.testId}-header`}
                                   direction={'column'}
                                   fullWidth={true}
                                   directionalPadding={true}
                    >
                        <Typography testId={`${props.testId}-header-title`} component={'h4'}>
                            {
                                props.title
                            }
                        </Typography>
                        {
                            props.subtitle && (
                                <Typography testId={`${props.testId}-header-subtitle`} component={'subtitle2'}>
                                    {
                                        props.subtitle
                                    }
                                </Typography>
                            )
                        }
                    </FlexContainer>
                )
            }
            {
                props.action && (
                    <Container flex={'auto'}>
                        {
                            props.action
                        }
                    </Container>
                )
            }
        </FlexContainer>
    )
}

export default FormGroupHeader;