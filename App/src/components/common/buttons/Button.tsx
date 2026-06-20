import MuiButton from "@mui/material/Button";
import Icon, { type IconType } from "../display/Icon.tsx";
import type { ButtonProps } from "./ButtonProps.ts";
import {Badge, Tooltip} from "@mui/material";
import {useMemo} from "react";

type BasicButtonProps = {
  /**
   * Button text.
   */
  label: string;

  /**
   * Optional icon to display before the label.
   */
  icon?: IconType;

  /**
   * Button variant.
   * @default 'contained'
   */
  variant?: "contained" | "outlined" | "text";

  /**
   * Full width button.
   * @default false
   */
  fullWidth?: boolean;
} & ButtonProps;

const Button = (props: BasicButtonProps) => {

  const button = useMemo(() => {
    return (
        <MuiButton
            id={props.id}
            name={props.name}
            className={props.className}
            style={props.style}
            data-testid={props.testId}
            variant={props.variant}
            color={props.color}
            type={props.type}
            size={'small'}
            fullWidth={props.fullWidth}
            disabled={props.displayMode === 'disabled'}
            onClick={props.onClick}
            loading={props.loading}
            loadingPosition={'start'}
            startIcon={props.icon ? <Icon icon={props.icon} /> : undefined}
        >
          {props.label}
        </MuiButton>
    );
  }, [
      props.className,
      props.color,
      props.displayMode,
      props.fullWidth,
      props.icon,
      props.id,
      props.label,
      props.loading,
      props.name,
      props.onClick,
      props.style,
      props.type,
      props.variant,
	  props.testId
  ]);

  const badge = useMemo(() => {
    if (!props.badgeContent)
      return button;

    return (
        <Badge badgeContent={props.badgeContent} color={props.badgeColor ?? 'primary'}>
          {button}
        </Badge>
    );
  }, [props.badgeContent, props.badgeColor, button])

  const tooltip = useMemo(() => {
    if (!props.tooltip)
      return badge;

    return (
        <Tooltip title={props.tooltip} arrow>
          {badge}
        </Tooltip>
    );
  }, [badge, props.tooltip]);

  if (props.displayMode === 'hidden')
    return <></>;
  return tooltip;
};

export default Button;