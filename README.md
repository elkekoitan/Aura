# 🌟 Aura Fashion - AI-Powered Fashion Discovery

Aura is a cutting-edge, mobile-first fashion discovery platform that leverages AI to provide a personalized styling and shopping experience. Built with a modern tech stack including React Native, Expo, and Supabase, Aura features a stunning glassmorphism design and a rich, interactive user interface.

## ✨ Key Features

-   **AI-Powered Styling**: Personalized style recommendations, color analysis, and trend predictions.
-   **Virtual Try-On**: Augmented reality feature to try on clothes in real-time. (Future Implementation)
-   **Brand-Centric Discovery**: Explore and follow your favorite fashion brands.
-   **Advanced Product Search**: Powerful search and filtering capabilities to find the perfect item.
-   **Seamless Shopping Cart**: A persistent and user-friendly shopping cart experience.
-   **Comprehensive User Profiles**: Manage personal details, style preferences, and body measurements.
-   **Secure Authentication**: Robust email/password authentication powered by Supabase.
-   **Admin Dashboard**: A full-featured content management system for products, brands, and analytics.

## 🛠️ Technology Stack

### Frontend
-   **React Native & Expo**: For cross-platform iOS, Android, and Web development.
-   **TypeScript**: Ensures a type-safe and reliable codebase.
-   **Redux Toolkit**: For predictable and centralized state management.
-   **React Navigation**: For handling navigation and screen transitions.
--   **Expo Linear Gradient & Blur**: To create the signature glassmorphism effects.
-   **Stripe**: For processing payments securely.

### Backend & Database
-   **Supabase**: Provides the backend, database, authentication, and storage.
-   **PostgreSQL**: The underlying database with Row Level Security for data protection.
-   **Deno**: For writing Supabase Edge Functions in TypeScript.

## 📂 Project Structure

The project follows a feature-oriented directory structure to keep the codebase organized and scalable.

```
.
├── src/
│   ├── components/    # Reusable UI and feature components
│   ├── config/        # Configuration files (e.g., Supabase)
│   ├── constants/     # Global constants (Colors, Typography, etc.)
│   ├── navigation/    # Navigation setup and navigators
│   ├── screens/       # Top-level screen components
│   ├── services/      # External service integrations (e.g., Stripe)
│   ├── store/         # Redux Toolkit store, slices, and types
│   └── utils/         # Utility functions and web stubs
├── supabase/
│   ├── functions/     # Supabase edge functions
│   └── migrations/    # Database schema migrations
└── App.tsx            # Main application entry point
```

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or newer)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Expo CLI](https://docs.expo.dev/get-started/installation/)
-   A free [Supabase](https://supabase.com/) account.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd aura-fashion-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a `.env` file by copying the example:
        ```bash
        cp .env.example .env
        ```
    -   Log in to your Supabase account and create a new project.
    -   Navigate to **Project Settings > API**.
    -   Copy your **Project URL** and **`service_role` key** and add them to your `.env` file.
    -   You will also need your Stripe publishable key and webhook secret.

    Your `.env` file should look like this:
    ```
    EXPO_PUBLIC_SUPABASE_URL="your-supabase-url"
    EXPO_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
    SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-pk"
    STRIPE_SECRET_KEY="your-stripe-sk"
    STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
    ```

### Running the Application

You can run the application on a mobile simulator or on the web.

-   **For Web:**
    ```bash
    npm run web
    ```

-   **For iOS (macOS required):**
    ```bash
    npm run ios
    ```

-   **For Android:**
    ```bash
    npm run android
    ```

## 🗄️ Backend Setup

The Supabase backend, including the database schema, is defined in the `/supabase` directory.

1.  **Set up the Database Schema:**
    -   In your Supabase project, navigate to the **SQL Editor**.
    -   Open the `supabase/schema.sql` file, copy its content, and run it in the SQL Editor to create the database tables and relationships.

2.  **Deploy Edge Functions:**
    -   The Supabase CLI is required to deploy edge functions. Follow the official [Supabase documentation](https://supabase.com/docs/guides/functions/deploy) for instructions on deploying the functions located in the `supabase/functions` directory.

## 📜 Available Scripts

-   `npm run ios`: Runs the app on the iOS simulator.
-   `npm run android`: Runs the app on the Android emulator.
-   `npm run web`: Runs the app in a web browser.
-   `npm test`: (Not yet implemented) Runs the test suite.

## 🤝 Contributing

Contributions are welcome! If you have a suggestion or find a bug, please open an issue to discuss it.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
