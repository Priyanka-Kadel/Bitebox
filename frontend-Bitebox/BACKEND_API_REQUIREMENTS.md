# Backend API Requirements for 2FA Email Verification

## Overview
This document outlines the backend API endpoints needed to implement 2FA email verification for user registration.

## Required Endpoints

### 1. Modified Register Endpoint
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "string",
  "email": "string", 
  "password": "string"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "isVerified": false
  }
}
```

**Backend Logic:**
- Hash the password
- Create user record with `isVerified: false`
- Generate a 6-digit verification token
- Store token with expiration (e.g., 10 minutes)
- Send email with verification code
- Return success response

### 2. Email Verification Endpoint
**POST** `/api/auth/verify-email`

**Request Body:**
```json
{
  "email": "string",
  "verificationToken": "string"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Backend Logic:**
- Find user by email
- Check if verification token matches and is not expired
- Update user `isVerified: true`
- Delete the verification token
- Return success response

### 3. Resend Verification Endpoint
**POST** `/api/auth/resend-verification`

**Request Body:**
```json
{
  "email": "string"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Verification code resent"
}
```

**Backend Logic:**
- Find user by email
- Generate new 6-digit verification token
- Update token with new expiration
- Send new email with verification code
- Return success response

### 4. Modified Login Endpoint
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Expected Response for Unverified User:**
```json
{
  "success": false,
  "message": "Please verify your email first"
}
```

**Expected Response for Verified User:**
```json
{
  "success": true,
  "token": "jwt_token",
  "name": "string",
  "email": "string",
  "role": "string",
  "_id": "string"
}
```

**Backend Logic:**
- Check if user exists and password is correct
- Check if user is verified (`isVerified: true`)
- If not verified, return error message
- If verified, generate JWT token and return user data

## Database Schema Updates

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String,
  isVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Verification Tokens Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  email: String,
  token: String,
  expiresAt: Date,
  createdAt: Date
}
```

## Email Template Example

**Subject:** Verify Your Bitebox Account

**Body:**
```
Hello {name},

Thank you for registering with Bitebox! To complete your registration, please enter the following verification code:

{verificationCode}

This code will expire in 10 minutes.

If you didn't create this account, please ignore this email.

Best regards,
The Bitebox Team
```

## Security Considerations

1. **Token Expiration:** Verification tokens should expire after 10-15 minutes
2. **Rate Limiting:** Implement rate limiting on verification endpoints
3. **Token Cleanup:** Regularly clean up expired tokens from database
4. **Email Validation:** Ensure email format is valid before sending
5. **Case Insensitive:** Email comparisons should be case insensitive

## Error Handling

Common error responses:
- `400`: Invalid email format
- `404`: User not found
- `409`: Email already exists (for registration)
- `422`: Invalid verification token
- `429`: Too many requests (rate limiting)
- `500`: Internal server error

## Implementation Notes

1. Use a reliable email service (SendGrid, AWS SES, etc.)
2. Store verification tokens securely with expiration
3. Implement proper error handling and logging
4. Consider using environment variables for email configuration
5. Test email delivery in development environment 