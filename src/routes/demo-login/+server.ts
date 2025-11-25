import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Demo Login</title>
		</head>
		<body>
			<h1>Demo Login</h1>
			<button onclick="loginDemo()">Login as Admin Demo</button>
			<button onclick="loginDemoUser()">Login as User Demo</button>
			<script>
				async function loginDemo() {
					try {
						const response = await fetch('/api/auth/user', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ email: 'admin@demo.com', password: 'demo123' })
						});
						const data = await response.json();
						if (response.ok) {
							alert('Login successful! Redirecting...');
							window.location.href = '/user/aksi';
						} else {
							alert('Login failed: ' + data.error);
						}
					} catch (error) {
						alert('Error: ' + error.message);
					}
				}

				async function loginDemoUser() {
					try {
						const response = await fetch('/api/auth/user', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ email: 'user@demo.com', password: 'user123' })
						});
						const data = await response.json();
						if (response.ok) {
							alert('Login successful! Redirecting...');
							window.location.href = '/user/aksi';
						} else {
							alert('Login failed: ' + data.error);
						}
					} catch (error) {
						alert('Error: ' + error.message);
					}
				}
			</script>
		</body>
		</html>
	`, {
		headers: { 'Content-Type': 'text/html' }
	});
};