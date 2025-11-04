import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'user' | 'viewer';
	avatar?: string;
	created_at: string;
	last_login?: string;
}

export interface UserSession {
	user: User | null;
	isAuthenticated: boolean;
	token?: string;
}

// Create the store with initial state
function createUserStore() {
	const initialState: UserSession = {
		user: null,
		isAuthenticated: false,
		token: undefined
	};

	const { subscribe, set, update } = writable<UserSession>(initialState);

	return {
		subscribe,
		
		// Login method
		login: (user: User, token?: string) => {
			const session: UserSession = {
				user,
				isAuthenticated: true,
				token
			};
			
			set(session);
			
			// Store in localStorage if in browser
			if (browser) {
				localStorage.setItem('user_session', JSON.stringify(session));
			}
		},

		// Logout method
		logout: () => {
			set(initialState);
			
			// Clear localStorage if in browser
			if (browser) {
				localStorage.removeItem('user_session');
			}
		},

		// Update user info
		updateUser: (updatedUser: Partial<User>) => {
			update(session => {
				if (session.user) {
					const newUser = { ...session.user, ...updatedUser };
					const newSession = { ...session, user: newUser };
					
					// Update localStorage if in browser
					if (browser) {
						localStorage.setItem('user_session', JSON.stringify(newSession));
					}
					
					return newSession;
				}
				return session;
			});
		},

		// Initialize from localStorage
		initialize: () => {
			if (browser) {
				const stored = localStorage.getItem('user_session');
				if (stored) {
					try {
						const session = JSON.parse(stored);
						// Validate the session is still valid (you might want to check token expiration)
						if (session.user && session.isAuthenticated) {
							set(session);
						}
					} catch (error) {
						console.error('Failed to parse stored user session:', error);
						localStorage.removeItem('user_session');
					}
				}
			}
		},

		// Check if user has specific role
		hasRole: (requiredRole: User['role']) => {
			let currentSession: UserSession = initialState;
			const unsubscribe = subscribe(session => currentSession = session);
			unsubscribe();
			
			if (!currentSession.isAuthenticated || !currentSession.user) {
				return false;
			}

			const roleHierarchy = {
				'viewer': 1,
				'user': 2, 
				'admin': 3
			};

			return roleHierarchy[currentSession.user.role] >= roleHierarchy[requiredRole];
		},

		// Get current user
		getCurrentUser: () => {
			let currentSession: UserSession = initialState;
			const unsubscribe = subscribe(session => currentSession = session);
			unsubscribe();
			return currentSession.user;
		},

		// Check authentication status
		isAuthenticated: () => {
			let currentSession: UserSession = initialState;
			const unsubscribe = subscribe(session => currentSession = session);
			unsubscribe();
			return currentSession.isAuthenticated;
		}
	};
}

export const userStore = createUserStore();

// Initialize the store when the module loads
if (browser) {
	userStore.initialize();
}

// Demo user for testing
export const demoUser: User = {
	id: 'demo-user-1',
	name: 'Admin Demo',
	email: 'admin@demo.com',
	role: 'admin',
	created_at: new Date().toISOString(),
	last_login: new Date().toISOString()
};