# SlowChat 💬

**A self-hosted slow messaging app with strict rate limiting: 1 message per 24 hours per conversation per user.**

Make every message count! SlowChat encourages thoughtful communication by enforcing a 24-hour cooldown between messages. Perfect for meaningful conversations without the noise of instant messaging.

## ✨ Features

- 🔐 **Firebase Authentication** - Secure email/password login
- 💬 **1-on-1 Chat** - Private conversations via invite link/email
- ⏰ **Rate Limiting** - Hard limit of 1 message per 24 hours per conversation per user
- 📎 **Photo & Video Attachments** - Share images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, MOV) up to 50MB
- 🔄 **Real-time Updates** - Live messaging with Firestore listeners
- 📅 **Message Scheduling** - Schedule messages for later if you've already sent one today
- 📧 **Email Invites** - Start conversations by email
- 📱 **Responsive Design** - Beautiful UI built with React + Vite + Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Firebase project ([Create one here](https://console.firebase.google.com/))

### Firebase Setup

1. **Create a Firebase project** at https://console.firebase.google.com/

2. **Enable Authentication:**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"

3. **Create Firestore Database:**
   - Go to Firestore Database > Create database
   - Start in production mode or test mode (for development)
   - Choose a location

4. **Enable Firebase Storage:**
   - Go to Storage > Get started
   - Start in test mode (for development)

5. **Get your Firebase config:**
   - Go to Project Settings > General
   - Under "Your apps", click the web icon (</>)
   - Register your app and copy the config

### Installation

```bash
# Clone the repository
git clone https://github.com/devadrianapostol/slow-chat.git
cd slow-chat

# Install dependencies
npm install

# Copy the environment file
cp .env.example .env

# Edit .env with your Firebase credentials
# Add your Firebase config values from the setup above
```

### Configuration

Edit `.env` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### Firestore Security Rules

Add these security rules to your Firestore database (Firestore Database > Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null && 
        request.auth.uid in request.resource.data.participants;
      allow update: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.senderId;
    }
  }
}
```

### Storage Security Rules

Add these security rules to your Firebase Storage (Storage > Rules):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /conversations/{conversationId}/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
        && request.resource.size < 50 * 1024 * 1024  // 50MB limit
        && (request.resource.contentType.matches('image/.*') 
            || request.resource.contentType.matches('video/.*'));
    }
  }
}
```

### Run the App

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📖 Usage

1. **Sign Up** - Create an account with email and password
2. **Start a Conversation** - Click "New Conversation" and enter a friend's email (they must have an account)
3. **Send Messages** - Type your message and/or attach photos/videos, then click Send
4. **Rate Limit** - You can send 1 message per 24 hours per conversation
5. **Schedule Messages** - If you've already sent a message today, you can schedule one for later

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Authentication, Firestore, Storage)
- **Routing:** React Router v6
- **File Upload:** Firebase Storage

## 📁 Project Structure

```
slow-chat/
├── src/
│   ├── components/        # React components
│   │   ├── ConversationList.jsx
│   │   ├── MessageList.jsx
│   │   ├── MessageInput.jsx
│   │   └── InviteModal.jsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx
│   ├── hooks/             # Custom hooks
│   │   └── useUserPresence.js
│   ├── pages/             # Page components
│   │   ├── Login.jsx
│   │   └── Chat.jsx
│   ├── utils/             # Utility functions
│   │   ├── rateLimit.js
│   │   └── fileUpload.js
│   ├── firebase.js        # Firebase configuration
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── .env.example           # Environment variables template
├── package.json
└── README.md
```

## 🔒 Security Features

- Email/password authentication
- Firestore security rules enforce rate limits
- File type and size validation
- User can only send messages in their conversations
- Secure file storage with access controls

## 🚧 Roadmap / Optional Features

- [ ] Email notifications when you receive a message
- [ ] Push notifications
- [ ] Group conversations
- [ ] Message reactions
- [ ] Read receipts
- [ ] User profiles
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Made with ❤️ for thoughtful communication**
