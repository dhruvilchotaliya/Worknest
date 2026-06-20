import type { ReactNode } from "react";
import MuiPopover, { type PopoverProps as MuiPopoverProps } from "@mui/material/Popover";

export type PopoverProps = {
  /**
   * The element to anchor the popover to.
   * Pass null to close.
   */
  anchorEl: HTMLElement | null;

  /**
   * Whether the popover is open.
   */
  open: boolean;

  /**
   * Callback fired when the popover requests to be closed.
   */
  onClose: () => void;

  /**
   * The content of the popover.
   */
  children: ReactNode;

  /**
   * Optional test identifier.
   */
  testId?: string;
  
  /**
   * Optional customization for internal styling
   */
  className?: string;
};

export const Popover = ({ anchorEl, open, onClose, children, testId, className }: PopoverProps) => {
  return (
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      data-testid={testId}
      slotProps={{
        paper: {
          className: className,
        }
      }}
    >
      {children}
    </MuiPopover>
  );
};
