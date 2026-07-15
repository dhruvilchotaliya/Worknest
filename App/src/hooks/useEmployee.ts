import { useCallback } from "react";
import { useApi } from "./network/useApi";
import environment from "../config/environment-config";
import { loginRequest } from "../authConfig";

export interface CurrentUserContextDto {
	objectId?: string;
	tenantId?: string;
	email?: string;
	name?: string;
	roles: string[];
	azureEmail?: string;
	isGuestUser?: boolean;
	requiresTenantSwitch?: boolean;
}

export interface RegisterEmployeeRequest {
	surname: string;
	position: number;
	teamId?: string | null;
	experienceInYears?: number | null;
	phoneNumber?: string | null;
	dateOfBirth?: string | null;
	bio?: string | null;
	workModel?: number | null;
}

const employeeResource = {
	endpoint: environment.apiUrl,
	scopes: loginRequest.scopes,
};

export const useEmployee = () => {
	const api = useApi(employeeResource);

	const getMe = useCallback(async (): Promise<CurrentUserContextDto> => {
		const response = await api.getAsync("/api/employee/me");
		return api.readResponseAsJson<CurrentUserContextDto>(response);
	}, [api]);

	const register = useCallback(async (request: RegisterEmployeeRequest): Promise<any> => {
		const response = await api.postAsync("/api/auth/register", request);
		return api.readResponseAsJson<any>(response);
	}, [api]);

	const onboard = useCallback(async (request: RegisterEmployeeRequest): Promise<any> => {
		const response = await api.postAsync("/api/auth/onboard", request);
		return api.readResponseAsJson<any>(response);
	}, [api]);

	return {
		getMe,
		register,
		onboard,
	};
};
