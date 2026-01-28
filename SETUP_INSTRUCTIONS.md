# GemGPT Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Firebase account
- OpenRouter API key

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password, Google Sign-In)
4. Create Firestore database
5. Enable Storage
6. Enable Cloud Functions

#### Get Firebase Configuration
1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click on Web app icon
4. Copy the Firebase configuration object

#### Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Functions Setup

#### Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

#### Initialize Firebase Functions
```bash
cd functions
npm install
```

#### Set OpenRouter API Key
```bash
firebase functions:config:set openrouter.apikey="YOUR_OPENROUTER_API_KEY"
```

#### Deploy Functions
```bash
npm run build
firebase deploy --only functions
```

### 4. OpenRouter Model Verification

**CRITICAL**: Before using the app, verify all model IDs:

1. Visit https://openrouter.ai/models
2. Check each model ID in `src/App.tsx` (CHAT_MODELS array)
3. Update model IDs if they differ from the specification
4. Verify:
   - Image generation model (FLUX.2 Klein)
   - PDF reading model (MiMo-V2-Flash)
   - All chat models

### 5. Run Development Server
```bash
npm run dev
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

## Important Notes

1. **Model IDs**: The model IDs in the code are placeholders. You MUST verify them with OpenRouter documentation before deployment.

2. **Authentication**: Currently, the app uses a simple `isPro` state. You'll need to:
   - Implement Firebase Authentication
   - Create an Auth context
   - Update all components to use real user authentication

3. **Subscription Management**: 
   - Implement subscription verification in Cloud Functions
   - Use RevenueCat or Stripe for payment processing
   - Store subscription status in Firestore

4. **Error Handling**: The app includes basic error handling, but you should:
   - Add retry logic for failed API calls
   - Implement rate limiting
   - Add proper error logging

5. **Testing**: Before production:
   - Test all models
   - Test Pro paywall flow
   - Test image generation
   - Test PDF reading
   - Test on multiple devices
   - Verify all text is in English

## Troubleshooting

### Functions Not Deploying
- Check Node.js version (should be 18)
- Verify `functions/package.json` dependencies
- Check Firebase CLI is up to date

### API Errors
- Verify OpenRouter API key is set correctly
- Check model IDs exist on OpenRouter
- Review Cloud Functions logs: `firebase functions:log`

### Authentication Issues
- Ensure Firebase Auth is enabled
- Check Firestore security rules
- Verify environment variables are set

## Next Steps

1. Implement Firebase Authentication
2. Add subscription management
3. Implement message history persistence
4. Add streaming support for chat responses
5. Remove dark mode (if still present)
6. Ensure all text is in English only
