# 🔐 Password Manager with 2FA

A secure, user-friendly web-based password manager with Two-Factor Authentication (2FA). Users can safely store and manage their passwords with encrypted storage and enhanced login security.

## 🚀 Features

- 🔑 Secure user authentication
- 🔒 Encrypted password storage
- 📱 Two-Factor Authentication (2FA) via email or authenticator app
- 🧩 Password generator
- 🗂️ Tagging and searching of stored entries
- 🌐 Responsive, modern UI

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS or Bootstrap
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)

**Security:**
- bcrypt for password hashing
- AES encryption for stored passwords
- TOTP (Time-based One-Time Passwords) for 2FA using `speakeasy`
- QR code generation for 2FA setup via `qrcode` package

## 📦 Installation

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or cloud)
  

### Clone the repository
bash
git clone https://github.com/your-username/password-manager-2fa.git
cd password-manager-2fa


🔐 How 2FA Works
User logs in with email and password.
If 2FA is enabled, a TOTP (6-digit code) is required.
Users can scan a QR code in their authenticator app (e.g., Google Authenticator) to set it up.
On successful TOTP validation, user receives access token.



✅ To Do / Improvements
 Browser extension support
 Biometric authentication (WebAuthn)
 Secure sharing of credentials
 Audit logging

👥 Contributing
Contributions are welcome! Please fork the repo and open a pull request.


📄 License
This project is licensed under the MIT License. See LICENSE for more information.

📬 Contact
Created by Heena Pawriya – feel free to reach out!
