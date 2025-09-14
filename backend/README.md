# Backend Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm install`
3. Run dev: `npm run dev`

API:
- POST `/create-payment-intent`

Request body:
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "licensePlate": "ABC-1234",
  "lotId": "A1",
  "startTime": "2025-09-11T10:00",
  "amount": 1000
}
```

Response:
```json
{ "clientSecret": "...", "bookingId": "..." }
```
