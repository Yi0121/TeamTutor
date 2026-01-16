// =============================================================================
// API Client - Unified HTTP Request Handler
// =============================================================================
// This module provides a centralized HTTP client for all API requests.
// Handles authentication, error handling, and base URL configuration.

// =============================================================================
// Configuration
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// =============================================================================
// Error Classes
// =============================================================================

export class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ApiError';
    }

    static fromResponse(status: number, body: unknown): ApiError {
        if (typeof body === 'object' && body !== null) {
            const { code, message, details } = body as Record<string, unknown>;
            return new ApiError(
                status,
                (code as string) || 'UNKNOWN_ERROR',
                (message as string) || `HTTP Error ${status}`,
                details as Record<string, unknown>
            );
        }
        return new ApiError(status, 'UNKNOWN_ERROR', `HTTP Error ${status}`);
    }
}

// =============================================================================
// Token Management
// =============================================================================

let authToken: string | null = null;
let refreshToken: string | null = null;
let onUnauthorizedCallback: (() => void) | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAuthToken(token: string | null): void {
    authToken = token;
}

export function getAuthToken(): string | null {
    return authToken;
}

export function setRefreshToken(token: string | null): void {
    refreshToken = token;
}

export function getRefreshToken(): string | null {
    return refreshToken;
}

/**
 * Set callback to be called when 401 Unauthorized is received
 * Typically used to trigger logout in AuthContext
 */
export function setOnUnauthorized(callback: (() => void) | null): void {
    onUnauthorizedCallback = callback;
}

/**
 * Set a custom token refresh function
 * Should return new access token or null if refresh failed
 */
let tokenRefreshFn: ((refreshToken: string) => Promise<string | null>) | null = null;

export function setTokenRefreshFn(fn: ((refreshToken: string) => Promise<string | null>) | null): void {
    tokenRefreshFn = fn;
}

// =============================================================================
// Request Helper
// =============================================================================

export interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    skipAuth?: boolean;
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(endpoint, API_BASE_URL);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
}

async function tryRefreshToken(): Promise<boolean> {
    if (!refreshToken || !tokenRefreshFn) {
        return false;
    }

    // Prevent multiple refresh attempts
    if (refreshPromise) {
        const newToken = await refreshPromise;
        return newToken !== null;
    }

    try {
        refreshPromise = tokenRefreshFn(refreshToken);
        const newToken = await refreshPromise;

        if (newToken) {
            authToken = newToken;
            return true;
        }
        return false;
    } catch {
        return false;
    } finally {
        refreshPromise = null;
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { body, params, headers: customHeaders, skipAuth, ...restOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...customHeaders as Record<string, string>,
    };

    // Attach auth token if available and not skipped
    if (authToken && !skipAuth) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const url = buildUrl(endpoint, params);

    const response = await fetch(url, {
        ...restOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
        // Try to refresh token
        const refreshed = await tryRefreshToken();

        if (refreshed) {
            // Retry request with new token
            headers['Authorization'] = `Bearer ${authToken}`;
            const retryResponse = await fetch(url, {
                ...restOptions,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            if (retryResponse.ok) {
                if (retryResponse.status === 204) {
                    return undefined as T;
                }
                return retryResponse.json() as Promise<T>;
            }
        }

        // Refresh failed or not available, trigger logout
        if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
        }
        throw ApiError.fromResponse(401, { code: 'UNAUTHORIZED', message: 'Session expired' });
    }

    // Handle no-content responses
    if (response.status === 204) {
        return undefined as T;
    }

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
        throw ApiError.fromResponse(response.status, responseBody);
    }

    return responseBody as T;
}

// =============================================================================
// Convenience Methods
// =============================================================================

export const http = {
    get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) =>
        apiRequest<T>(endpoint, { method: 'GET', params }),

    post: <T>(endpoint: string, body?: unknown) =>
        apiRequest<T>(endpoint, { method: 'POST', body }),

    put: <T>(endpoint: string, body?: unknown) =>
        apiRequest<T>(endpoint, { method: 'PUT', body }),

    patch: <T>(endpoint: string, body?: unknown) =>
        apiRequest<T>(endpoint, { method: 'PATCH', body }),

    delete: <T>(endpoint: string) =>
        apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export default http;
