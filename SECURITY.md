Security Practices

1. Authentication

JWT: JSON Web Tokens are used for secure user authentication. Tokens are signed with a secret key and verified on each protected route.
Password Hashing: Passwords are hashed using bcrypt with a salt factor of 10 to prevent plaintext storage.

2. Data Protection

MongoDB: User data is stored in MongoDB with access restricted to authenticated users via JWT.
Input Validation: All user inputs are sanitized to prevent injection attacks (e.g., MongoDB query injection).
CORS: Configured to allow requests only from the frontend origin.

3. API Security

TMDB API Key: Stored in environment variables to prevent exposure.
Rate Limiting: Not implemented in this version but recommended for production to prevent abuse.

4. Docker Security

Non-root User: Docker containers run as non-root users where possible.
Isolated Containers: Each service (frontend, backend, MongoDB) runs in its own container with minimal permissions.

5. Recommendations for Production

Use HTTPS to encrypt data in transit.
Implement rate limiting on API endpoints.
Regularly rotate JWT secret keys.
Use a secure MongoDB configuration with authentication enabled.
