# Bitespeed Backend Task - Identity Reconciliation

## Overview
This is a Node.js + Express backend service that identifies and links customer contacts.

## API Endpoint
- **POST /api/identify**

  - Accepts JSON body:  
    ```json
    {
      "email": "test@example.com",
      "phoneNumber": "1234567890"
    }
    ```
  - Returns linked contact information.

## How to Run Locally
1. Clone the repo: git clone https://github.com/khushi1301/bitespeed-backend-task.git
2. Install dependencies: npm install
3. Start the server: npm run dev
