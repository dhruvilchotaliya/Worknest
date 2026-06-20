import SvgIcon from "@mui/material/SvgIcon";
import type { SvgIconProps } from "@mui/material/SvgIcon";

/**
 * Microsoft Teams icon wrapper.
 * Replace the path data with the official Teams SVG if available.
 */
const MicrosoftTeamsIcon = (props: SvgIconProps) => (
	<SvgIcon {...props} viewBox="0 0 24 24">
		<path d="M19.19 8.09A2.5 2.5 0 1 0 16 5.5a2.5 2.5 0 0 0 3.19 2.59ZM12 8a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm6.5 2h-2.85a4.5 4.5 0 0 1 .35 1.75V18h3.5a1 1 0 0 0 1-1v-5a2 2 0 0 0-2-2Zm-13 0a2 2 0 0 0-2 2v5a1 1 0 0 0 1 1H8v-6.25A4.5 4.5 0 0 1 8.35 10ZM12 10a3.5 3.5 0 0 0-3.5 3.5V19a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-5.5A3.5 3.5 0 0 0 12 10Z" />
	</SvgIcon>
);

export default MicrosoftTeamsIcon;
