import { useContext, useMemo, useCallback } from "react";
import { ProblemDetailsError } from "../../models/errors/problem-details-error";
import type { ProblemDetails } from "../../models/errors/problem-details";
import environment from "../../config/environment-config";
import AuthenticationContext from "../../context/AuthenticationContext";

export const HttpMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
} as const;

export type HttpMethod = keyof typeof HttpMethod;

type ApiResource = {
    endpoint: string;
    scopes: string[];
};

// These helper functions are pure and can be defined outside the hook
// so they are not recreated on every render.
async function readResponseAsJson<T>(response: Response): Promise<T> {
    if (!response.ok) throw new ProblemDetailsError((await response.json()) as ProblemDetails);
    return await response.json() as T;
}

async function readResponseAsBlob(response: Response): Promise<Blob> {
    if (!response.ok) throw new ProblemDetailsError((await response.json()) as ProblemDetails);
    return await response.blob();
}

async function readResponseAsEmpty(response: Response): Promise<void> {
    if (!response.ok) throw new ProblemDetailsError((await response.json()) as ProblemDetails);
}

export const useApi = (resource: ApiResource) => {

    const { getAccessToken } = useContext(AuthenticationContext);

    const callProtectedApi = useCallback(async (
        path: string,
        method: HttpMethod,
        headers?: Record<string, string>,
        body?: string | FormData,
        requireAuthorization: boolean = true,
        _externalLoading?: boolean
    ) => {

        const getUri = (ep: string) => `${resource.endpoint}${ep}`;

        const executeFetch = async (claims?: string): Promise<Response> => {
            const isCommonAuthPath = path.startsWith("/api/auth/onboard") || path === "/api/employee/me";
            const authority = isCommonAuthPath
                ? "https://login.microsoftonline.com/common"
                : `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || ""}`;

            const token = requireAuthorization
                ? await getAccessToken(resource.scopes, claims, authority)
                : undefined;

            const requestOptions: RequestInit = {
                method,
                headers: {
                    ...headers,
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body,
            };
            return await fetch(getUri(path), requestOptions);
        };

            let response = await executeFetch();

            // Handle 403 Forbidden with a claims challenge
            if (response.status === 403 && response.headers.has('www-authenticate')) {
                const authenticateHeader = response.headers.get('www-authenticate') ?? '';

                // Parse the claims from the header
                const challengeMap: Record<string, string> = {};
                authenticateHeader.substring(authenticateHeader.indexOf(' ') + 1).split(', ').forEach((challenge) => {
                    const [key, value] = challenge.split('=');
                    challengeMap[key.trim()] = window.decodeURI(value.replace(/(^"|"$)/g, ''));
                });

                if (challengeMap.claims) {
                    // Retry the fetch, this time passing the claims to getAccessToken
                    response = await executeFetch(challengeMap.claims);
                }
            }

            // A 401 might indicate a stale token, but getAccessToken handles renewal,
            // so we typically just let the error propagate to the caller.
            if (!response.ok) {
                let problemDetails: ProblemDetails = {
                    status: response.status,
                    title: response.statusText || "An API error occurred.",
                };
                try {
                    const json = await response.json();
                    problemDetails = { ...problemDetails, ...json };
                } catch {
                    // Ignore JSON parsing errors for non-JSON error pages (like HTML 404 or IIS errors)
                }
                throw new ProblemDetailsError(problemDetails);
            }

            return response;
    }, [getAccessToken, resource.endpoint, resource.scopes]);

    return useMemo(() => {
        const getUri = (endpoint: string) => `${environment.apiUrl}${endpoint}`;

        return {
            getUri,
            sendAsync: (endpoint: string, method: HttpMethod, headers?: Record<string, string>, body?: string, requireAuthorization: boolean = true, externalLoading?: boolean) =>
                callProtectedApi(endpoint, method, headers, body, requireAuthorization, externalLoading),
            getAsync: (endpoint: string, requireAuthorization: boolean = true, externalLoading?: boolean) =>
                callProtectedApi(endpoint, HttpMethod.GET, undefined, undefined, requireAuthorization, externalLoading),
            putAsync: <TRequest,>(endpoint: string, body: TRequest, requireAuthorization: boolean = true, externalLoading?: boolean) =>
                callProtectedApi(endpoint, HttpMethod.PUT, { 'Content-Type': 'application/json' }, JSON.stringify(body), requireAuthorization, externalLoading),
            patchAsync: <TRequest,>(endpoint: string, body: TRequest, requireAuthorization: boolean = true, externalLoading?: boolean)=>
                callProtectedApi(endpoint, HttpMethod.PATCH, { 'Content-Type': 'application/json' }, JSON.stringify(body), requireAuthorization, externalLoading),
            postAsync: <TRequest,>(endpoint: string, body: TRequest, requireAuthorization: boolean = true, externalLoading?: boolean) =>
                callProtectedApi(endpoint, HttpMethod.POST, { 'Content-Type': 'application/json' }, JSON.stringify(body), requireAuthorization, externalLoading),
            deleteAsync: (endpoint: string, requireAuthorization: boolean = true, externalLoading?: boolean) =>
                callProtectedApi(endpoint, HttpMethod.DELETE, undefined, undefined, requireAuthorization, externalLoading),
            putFormAsync: (endpoint: string, body: FormData, requireAuthorization: boolean = true, externalLoading?: boolean) =>
                callProtectedApi(endpoint, HttpMethod.PUT, {}, body, requireAuthorization, externalLoading),
            patchFormAsync: (endpoint: string, body: FormData, requireAuthorization: boolean = true, externalLoading?: boolean) =>
                callProtectedApi(endpoint, HttpMethod.PATCH, {}, body, requireAuthorization, externalLoading),
            postFormAsync: (endpoint: string, body: FormData, requireAuthorization: boolean = true, externalLoading?: boolean) =>
                callProtectedApi(endpoint, HttpMethod.POST, {}, body, requireAuthorization, externalLoading),
            readResponseAsJson,
            readResponseAsBlob,
            readResponseAsEmpty
        };
    }, [callProtectedApi]);
};