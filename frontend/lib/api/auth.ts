// frontend/lib/api/auth.ts

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (credentials.email === 'user@example.com' && credentials.password === 'password') {
    return {
      token: 'dummy-auth-token',
      user: {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'Administrator',
      },
    };
  } else {
    throw new Error('Invalid email or password');
  }
}

export async function logout(): Promise<void> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Logged out successfully (simulated)');
}
