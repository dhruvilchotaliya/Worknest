import SvgIcon from "@mui/material/SvgIcon";
import type { SvgIconProps } from "@mui/material/SvgIcon";

/**
 * SharePoint icon wrapper.
 * Replace the path data with the official SharePoint SVG if available.
 */
const SharepointWrappedIcon = (props: SvgIconProps) => (
	<SvgIcon {...props} viewBox="0 0 24 24">
		<path d="M11 2a7 7 0 0 0-7 7 6.95 6.95 0 0 0 3.13 5.83A4.5 4.5 0 1 0 13.5 22H20a2 2 0 0 0 2-2v-1.5a3.5 3.5 0 0 0-3.5-3.5h-.62A7 7 0 0 0 11 2Zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 11 4Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm2.5 11H20a1.5 1.5 0 0 1 1.5 1.5V18a.5.5 0 0 1-.5.5h-7.5a2.5 2.5 0 1 1 0-5Z" />
	</SvgIcon>
);

export default SharepointWrappedIcon;
