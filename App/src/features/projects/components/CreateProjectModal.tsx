import { Box, Button } from "@mui/material";
import { useState, useContext } from "react";
import { ModalContext } from "../../../components/common/utils/ModalContext";
import SearchableSelect from "../../../components/common/inputs/SearchableSelect";
import { employeeSearchEntity } from "../../../components/common/entities/employeeSearchEntity";
import type { Employee } from "../../../models/core/Employee";

export const CreateProjectModalContent = () => {
	const { close } = useContext(ModalContext);
	const [owner, setOwner] = useState<Employee | null>(null);

	// Placeholder for actual form logic (name, dates, etc.)
	const handleSave = () => {
		// Save logic here
		close();
	};

	return (
		<Box className="flex flex-col gap-4 py-4 h-full" data-testid="create-project-modal-content">
			<SearchableSelect
				id="project-owner-select"
				label="Project Owner"
				entity={employeeSearchEntity}
				allowMultiple={false}
				value={owner}
				setValue={setOwner}
				testId="project-owner-input"
				placeholder="Search for an owner..."
			/>
			{/* Add other form fields like TextInput for project name, Description, etc. as needed */}
			
			<Box className="flex justify-end gap-2 mt-auto pt-4">
				<Button variant="outlined" color="inherit" onClick={close} data-testid="cancel-project-btn">
					Cancel
				</Button>
				<Button variant="contained" color="primary" onClick={handleSave} data-testid="save-project-btn">
					Save Project
				</Button>
			</Box>
		</Box>
	);
};
