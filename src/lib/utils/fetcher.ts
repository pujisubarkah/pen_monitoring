import { error } from '@sveltejs/kit';

export interface FetchOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	body?: any;
	timeout?: number;
}

export interface ApiResponse<T = any> {
	data?: T;
	error?: string;
	message?: string;
	status: number;
	success: boolean;
}

class Fetcher {
	private baseUrl: string;
	private defaultHeaders: Record<string, string>;

	constructor(baseUrl: string = '') {
		this.baseUrl = baseUrl;
		this.defaultHeaders = {
			'Content-Type': 'application/json',
		};
	}

	private async makeRequest<T>(
		endpoint: string, 
		options: FetchOptions = {}
	): Promise<ApiResponse<T>> {
		const { 
			method = 'GET', 
			headers = {}, 
			body, 
			timeout = 10000 
		} = options;

		const url = `${this.baseUrl}${endpoint}`;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				method,
				headers: {
					...this.defaultHeaders,
					...headers,
				},
				body: body ? JSON.stringify(body) : undefined,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			let responseData;
			const contentType = response.headers.get('content-type');
			
			if (contentType && contentType.includes('application/json')) {
				responseData = await response.json();
			} else {
				responseData = await response.text();
			}

			if (!response.ok) {
				return {
					data: undefined,
					error: responseData.error || responseData.message || 'Request failed',
					message: responseData.message,
					status: response.status,
					success: false,
				};
			}

			return {
				data: responseData,
				status: response.status,
				success: true,
			};
		} catch (err) {
			clearTimeout(timeoutId);
			
			if (err instanceof Error) {
				if (err.name === 'AbortError') {
					return {
						error: 'Request timeout',
						status: 408,
						success: false,
					};
				}
				
				return {
					error: err.message,
					status: 500,
					success: false,
				};
			}

			return {
				error: 'Unknown error occurred',
				status: 500,
				success: false,
			};
		}
	}

	// GET request
	async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(endpoint, { method: 'GET', headers });
	}

	// POST request
	async post<T>(
		endpoint: string, 
		body?: any, 
		headers?: Record<string, string>
	): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(endpoint, { method: 'POST', body, headers });
	}

	// PUT request
	async put<T>(
		endpoint: string, 
		body?: any, 
		headers?: Record<string, string>
	): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(endpoint, { method: 'PUT', body, headers });
	}

	// DELETE request
	async delete<T>(
		endpoint: string, 
		headers?: Record<string, string>
	): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(endpoint, { method: 'DELETE', headers });
	}

	// PATCH request
	async patch<T>(
		endpoint: string, 
		body?: any, 
		headers?: Record<string, string>
	): Promise<ApiResponse<T>> {
		return this.makeRequest<T>(endpoint, { method: 'PATCH', body, headers });
	}

	// Set authorization token
	setAuthToken(token: string) {
		this.defaultHeaders['Authorization'] = `Bearer ${token}`;
	}

	// Remove authorization token
	removeAuthToken() {
		delete this.defaultHeaders['Authorization'];
	}

	// Set base URL
	setBaseUrl(url: string) {
		this.baseUrl = url;
	}

	// Upload file
	async uploadFile<T>(
		endpoint: string, 
		file: File, 
		additionalData?: Record<string, any>
	): Promise<ApiResponse<T>> {
		const formData = new FormData();
		formData.append('file', file);
		
		if (additionalData) {
			Object.entries(additionalData).forEach(([key, value]) => {
				formData.append(key, value);
			});
		}

		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'POST',
				headers: {
					// Don't set Content-Type for FormData, let browser set it
					'Authorization': this.defaultHeaders['Authorization'],
				},
				body: formData,
			});

			let responseData;
			const contentType = response.headers.get('content-type');
			
			if (contentType && contentType.includes('application/json')) {
				responseData = await response.json();
			} else {
				responseData = await response.text();
			}

			if (!response.ok) {
				return {
					data: undefined,
					error: responseData.error || responseData.message || 'Upload failed',
					message: responseData.message,
					status: response.status,
					success: false,
				};
			}

			return {
				data: responseData,
				status: response.status,
				success: true,
			};
		} catch (err) {
			return {
				error: err instanceof Error ? err.message : 'Upload failed',
				status: 500,
				success: false,
			};
		}
	}
}

// Create default fetcher instance
export const fetcher = new Fetcher('/api');

// Helper function for SvelteKit error handling
export function handleApiError(response: ApiResponse): never {
	throw error(response.status, {
		message: response.error || response.message || 'An error occurred'
	});
}

// Utility function for form data
export function createFormData(data: Record<string, any>): FormData {
	const formData = new FormData();
	
	Object.entries(data).forEach(([key, value]) => {
		if (value !== null && value !== undefined) {
			if (value instanceof File) {
				formData.append(key, value);
			} else if (Array.isArray(value)) {
				value.forEach((item, index) => {
					formData.append(`${key}[${index}]`, item);
				});
			} else {
				formData.append(key, value.toString());
			}
		}
	});
	
	return formData;
}

// Export the Fetcher class for custom instances
export { Fetcher };