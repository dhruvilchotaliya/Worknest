import {
	Accordion as MuiAccordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ReactNode } from "react";

export type AccordionItem = {
	/**
	 * Unique accordion identifier
	 */
	id: string;

	/**
	 * Accordion header label
	 */
	label: ReactNode;

	/**
	 * Accordion content
	 */
	content: ReactNode;

	/**
	 * Disable this accordion item
	 */
	disabled?: boolean;
};

type AccordionProps = {

	/**
	 * The test identifier used for automated testing.
	 * Mapped to `data-testid` on the rendered input element.
	 */
	testId: string;

	/**
	 * Accordion items
	 */
	items: AccordionItem[];

	/**
	 * If true, the accordion will not have padding around the content. Default is false.
	 */
	disableGutters?: boolean

	/**
	 * Expanded accordion id (controlled)
	 * null = all collapsed
	 */
	value?: string | null;

	/**
	 * Expansion change handler
	 */
	onChange?: (id: string | null) => void;

	/**
	 * If true, the accordion will have rounded corners. Default is true.
	 */
	isRounded?: boolean;

	/**
	 * Optional additional CSS class names applied to the accordion wrapper.
	 */
	className?: string;
};

const Accordion = (props: AccordionProps) => {
	const { items = [], value, onChange } = props;

	return (
		<>
			{items.map((item) => {
				const expanded = value === item.id;

				return (
					<MuiAccordion
						key={item.id}
						expanded={expanded}
						disabled={item.disabled}
						square={!(props.isRounded ?? true)}
						disableGutters={props.disableGutters}
						data-testid={`${props.testId}-${item.id}`}
						className={props.className}
						onChange={(e) => {
							e.stopPropagation();
							onChange?.(expanded ? null : item.id);
						}}
						sx={{
							"&:before": { display: "none" },
							borderRadius: props.isRounded ? 1 : 0,
							boxShadow: item.disabled ? 'none' : undefined,
						}}
					>
						<AccordionSummary
							data-testid={`${props.testId}-${item.id}-summary`}
							expandIcon={<ExpandMoreIcon />}
						>
							{item.label}
						</AccordionSummary>

						<AccordionDetails
							data-testid={`${props.testId}-${item.id}-details`}
						>
							{item.content}
						</AccordionDetails>
					</MuiAccordion>
				);
			})}
		</>
	);
};

export default Accordion;
