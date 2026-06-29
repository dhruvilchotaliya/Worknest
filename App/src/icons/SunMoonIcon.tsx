import React from "react";

export const SunMoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		{/* Sun Left Half (Stroke only) */}
		<path d="M12 8 A 4 4 0 0 0 12 16" fill="none" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="M4.93 4.93l1.41 1.41" />
		<path d="M2 12h2" />
		<path d="M4.93 19.07l1.41-1.41" />

		{/* Moon Right Half (Filled) */}
		<path d="M12 3 A 9 9 0 0 1 12 21 Q 16.5 12 12 3 Z" />
	</svg>
);
