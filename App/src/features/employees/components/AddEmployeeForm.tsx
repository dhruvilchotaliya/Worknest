import { useState, useCallback } from "react";
import { Box, Divider } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import type { NewEmployeeFormData } from "../types/employee";
import TextInput from "../../../components/common/inputs/TextInput";
import SelectInput from "../../../components/common/inputs/SelectInput";
import Button from "../../../components/common/buttons/Button";
import Typography from "../../../components/common/display/Typography";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEPARTMENT_OPTIONS = [
	{ label: "Engineering", value: "Engineering" },
	{ label: "Design", value: "Design" },
	{ label: "Product", value: "Product" },
	{ label: "Marketing", value: "Marketing" },
	{ label: "Operations", value: "Operations" },
	{ label: "Finance", value: "Finance" },
	{ label: "HR", value: "HR" },
	{ label: "Sales", value: "Sales" },
];

type FieldErrors = Partial<Record<keyof NewEmployeeFormData, string>>;

const emptyForm = (): NewEmployeeFormData => ({
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	department: "",
	position: "",
	location: "",
	avatarFile: undefined,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AddEmployeeFormProps = {
	onSave: (data: NewEmployeeFormData) => void;
	onCancel: () => void;
	isSaving?: boolean;
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const validate = (form: NewEmployeeFormData): FieldErrors => {
	const errors: FieldErrors = {};
	if (!form.firstName.trim()) errors.firstName = "First name is required";
	if (!form.lastName.trim()) errors.lastName = "Last name is required";
	if (!form.email.trim()) {
		errors.email = "Email is required";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
		errors.email = "Enter a valid email address";
	}
	if (!form.department) errors.department = "Department is required";
	if (!form.position.trim()) errors.position = "Job title is required";
	return errors;
};

// ---------------------------------------------------------------------------
// AddEmployeeForm
// ---------------------------------------------------------------------------

const AddEmployeeForm = ({ onSave, onCancel, isSaving = false }: AddEmployeeFormProps) => {
	const [form, setForm] = useState<NewEmployeeFormData>(emptyForm);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [touched, setTouched] = useState<Partial<Record<keyof NewEmployeeFormData, boolean>>>({});
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const setField = useCallback(
		<K extends keyof NewEmployeeFormData>(key: K, value: NewEmployeeFormData[K]) => {
			setForm((prev) => ({ ...prev, [key]: value }));
			// Clear error on change
			if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
		},
		[errors],
	);

	const handleBlur = (field: keyof NewEmployeeFormData) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
		const newErrors = validate(form);
		setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setField("avatarFile", file);
		const url = URL.createObjectURL(file);
		setAvatarPreview(url);
	};

	const handleSubmit = () => {
		const allTouched = Object.keys(form).reduce(
			(acc, k) => ({ ...acc, [k]: true }),
			{} as typeof touched,
		);
		setTouched(allTouched);
		const newErrors = validate(form);
		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;
		onSave(form);
	};

	const isFieldError = (field: keyof NewEmployeeFormData) =>
		touched[field] && Boolean(errors[field]);

	return (
		<Box
			sx={{ display: "flex", flexDirection: "column", gap: 2 }}
			data-testid="add-employee-form"
		>
			{/* ── Photo Upload ─────────────────────────────────────── */}
			<Box>
				<Typography
					component="caption"
					testId="photo-upload-label"
					style={{
						fontWeight: 600,
						fontSize: "0.75rem",
						color: "#475569",
						display: "block",
						marginBottom: "8px",
					}}
				>
					Profile Photo
				</Typography>
				<Box
					component="label"
					htmlFor="employee-avatar-upload"
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 1,
						border: "2px dashed #cbd5e1",
						borderRadius: "10px",
						py: 3,
						cursor: "pointer",
						bgcolor: "#f8fafc",
						transition: "border-color 0.15s, background-color 0.15s",
						"&:hover": {
							borderColor: "#4f6ef7",
							bgcolor: "rgba(79,110,247,0.04)",
						},
					}}
				>
					{avatarPreview ? (
						<Box
							component="img"
							src={avatarPreview}
							alt="Avatar preview"
							sx={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }}
						/>
					) : (
						<>
							<CloudUploadIcon sx={{ fontSize: 32, color: "#94a3b8" }} />
							<Typography
								component="body2"
								testId="photo-upload-hint"
								style={{ color: "#94a3b8", fontSize: "0.8125rem" }}
							>
								Click to upload photo
							</Typography>
							<Typography
								component="caption"
								testId="photo-upload-formats"
								style={{ color: "#cbd5e1", fontSize: "0.75rem" }}
							>
								PNG, JPG, WEBP up to 5MB
							</Typography>
						</>
					)}
					<input
						id="employee-avatar-upload"
						type="file"
						accept="image/*"
						style={{ display: "none" }}
						onChange={handleFileChange}
						data-testid="employee-avatar-file-input"
					/>
				</Box>
			</Box>

			<Divider sx={{ borderColor: "#f1f5f9" }} />

			{/* ── Name row ─────────────────────────────────────────── */}
			<Box sx={{ display: "flex", gap: 1.5 }}>
				<TextInput
					label="First Name"
					value={form.firstName}
					setValue={(v) => setField("firstName", v)}
					onBlur={() => handleBlur("firstName")}
					error={isFieldError("firstName")}
					subtext={isFieldError("firstName") ? errors.firstName : undefined}
					required
					testId="add-employee-first-name"
				/>
				<TextInput
					label="Last Name"
					value={form.lastName}
					setValue={(v) => setField("lastName", v)}
					onBlur={() => handleBlur("lastName")}
					error={isFieldError("lastName")}
					subtext={isFieldError("lastName") ? errors.lastName : undefined}
					required
					testId="add-employee-last-name"
				/>
			</Box>

			{/* ── Email ────────────────────────────────────────────── */}
			<TextInput
				label="Email"
				type="email"
				value={form.email}
				setValue={(v) => setField("email", v)}
				onBlur={() => handleBlur("email")}
				error={isFieldError("email")}
				subtext={isFieldError("email") ? errors.email : undefined}
				required
				testId="add-employee-email"
			/>

			{/* ── Phone ────────────────────────────────────────────── */}
			<TextInput
				label="Phone"
				type="tel"
				value={form.phone}
				setValue={(v) => setField("phone", v)}
				placeholder="+1 415 555 0000"
				testId="add-employee-phone"
			/>

			{/* ── Department ───────────────────────────────────────── */}
			<SelectInput
				label="Department"
				value={form.department}
				setValue={(v) => setField("department", v)}
				options={DEPARTMENT_OPTIONS}
				error={isFieldError("department")}
				subtext={isFieldError("department") ? errors.department : undefined}
				required
				testId="add-employee-department"
			/>

			{/* ── Job Title ────────────────────────────────────────── */}
			<TextInput
				label="Job Title"
				value={form.position}
				setValue={(v) => setField("position", v)}
				onBlur={() => handleBlur("position")}
				error={isFieldError("position")}
				subtext={isFieldError("position") ? errors.position : undefined}
				required
				testId="add-employee-position"
			/>

			{/* ── Location ─────────────────────────────────────────── */}
			<TextInput
				label="Location"
				value={form.location}
				setValue={(v) => setField("location", v)}
				placeholder="City, State"
				testId="add-employee-location"
			/>

			{/* ── Footer actions (rendered inside WorknestSidebar footer) ─ */}
			<Box
				sx={{
					display: "flex",
					gap: 1.5,
					justifyContent: "flex-end",
					pt: 1,
				}}
			>
				<Button
					label="Cancel"
					variant="outlined"
					onClick={onCancel}
					testId="add-employee-cancel-btn"
				/>
				<Button
					label="Add Employee"
					variant="contained"
					onClick={handleSubmit}
					loading={isSaving}
					testId="add-employee-submit-btn"
				/>
			</Box>
		</Box>
	);
};

export default AddEmployeeForm;
