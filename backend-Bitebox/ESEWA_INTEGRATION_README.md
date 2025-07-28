# eSewa Payment Integration Setup

This document provides instructions for setting up the eSewa payment integration in the Bitebox backend.

## Required Environment Variables

Add the following environment variables to your `.env` file:

```env
# eSewa Configuration
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_PAYMENT_URL=https://esewa.com.np/epay/main
ESEWA_VERIFICATION_URL=https://esewa.com.np/epay/transrec

# Application URLs
FRONTEND_URL=https://localhost:5173
BACKEND_URL=https://localhost:3000

# Email Configuration (for order confirmations)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## Implemented Endpoints

### 1. Create Order
**POST** `/api/orders/create`

Creates a new order and returns the order ID for eSewa integration.

**Request Body:**
```json
{
  "items": [
    {
      "recipeId": "string",
      "title": "string",
      "price": number,
      "servings": number,
      "image": "string"
    }
  ],
  "customerInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string"
  },
  "total": number,
  "paymentMethod": "esewa"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-1234567890-ABC123",
  "message": "Order created successfully"
}
```

### 2. eSewa Payment Initiation
**GET** `/api/esewa/create/:orderId`

Redirects to the eSewa payment page with payment parameters.

**Response:** Redirects to eSewa payment gateway

### 3. eSewa Success Callback
**POST** `/api/esewa/success`

Handles successful payment from eSewa.

**Request Body (from eSewa):**
```json
{
  "oid": "string",
  "amt": "number",
  "refId": "string",
  "signature": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment successful",
  "orderId": "string",
  "refId": "string"
}
```

### 4. eSewa Failure Callback
**POST** `/api/esewa/failure`

Handles failed payment from eSewa.

**Request Body (from eSewa):**
```json
{
  "oid": "string",
  "amt": "number",
  "refId": "string"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Payment failed",
  "orderId": "string"
}
```

### 5. Order Status Check
**GET** `/api/orders/:orderId/status`

Gets order details and status.

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "string",
    "orderId": "string",
    "status": "pending|paid|failed|delivered",
    "paymentMethod": "esewa|cod",
    "total": number,
    "customerInfo": {},
    "items": [],
    "createdAt": "date",
    "paidAt": "date"
  }
}
```

## Database Schema

The order model has been updated with the following structure:

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  orderId: String, // Unique order identifier
  items: [{
    recipeId: ObjectId,
    title: String,
    price: Number,
    servings: Number,
    image: String
  }],
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String
  },
  total: Number,
  paymentMethod: String, // "esewa" or "cod"
  status: String, // "pending", "paid", "failed", "delivered"
  esewaRefId: String, // eSewa reference ID
  createdAt: Date,
  paidAt: Date,
  deliveredAt: Date
}
```

## Integration Flow

1. **Order Creation**: Frontend calls `/api/orders/create` with order details
2. **Payment Initiation**: Frontend redirects to `/api/esewa/create/:orderId`
3. **Payment Processing**: User completes payment on eSewa
4. **Success/Failure**: eSewa redirects to success/failure callback
5. **Order Update**: Backend updates order status and sends confirmation email
6. **Status Check**: Frontend can check order status via `/api/orders/:orderId/status`

## Security Features

- Signature verification for eSewa callbacks
- Amount validation to prevent payment manipulation
- Order ownership validation
- Rate limiting on payment endpoints
- Comprehensive error handling and logging

## Testing

For testing, use the eSewa test credentials:
- Merchant Code: `EPAYTEST`
- Secret Key: `8gBm/:&EnhH.1/q`

## Error Handling

The integration includes comprehensive error handling for:
- Invalid order data
- Missing required parameters
- Payment amount mismatches
- Signature verification failures
- Order not found scenarios
- Duplicate payment processing

## Email Notifications

Order confirmation emails are automatically sent when payment is successful, including:
- Order details
- Customer information
- Item list
- Payment confirmation 