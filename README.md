# Ink Forge ✒️

https://ink-forge.onrender.com/

Ink Forge is a premium, AI-moderated blog platform built with Next.js 16. It empowers writers to publish content safely with automated moderation, ensuring a clean and constructive environment for all users. The platform features a stunning glassmorphism design that fully supports light and dark modes out of the box.

## 🌟 Features

- **Automated AI Moderation**: Uses advanced Google Gemini AI to automatically screen and moderate user posts and comments for inappropriate content or misinformation before they are published.
- **Premium Glassmorphism UI**: Beautiful, fully responsive design using Tailwind CSS v4 featuring adaptive light and dark themes, glowing accents, and blurred glass elements.
- **Markdown Editor**: Integrated markdown support allowing writers to format their posts richly (bold, italic, quotes, code, headers) with an instant live preview.
- **Stateless Authentication**: Fully secure JWT-based stateless session management using HTTP-only cookies, eliminating the need for heavy server-side sessions.
- **Unified Roles**: All users can read, explore, write, and engage with content without rigid role restrictions.
- **Social Engagement**: Users can like, comment, and interact with posts across the platform.
- **Profile Customization**: Users can easily update their avatars, change display names, and securely manage their passwords.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, `next-themes` (Dark/Light mode)
- **Database**: MongoDB & Mongoose
- **Authentication**: `jose` (JWT encryption), `bcryptjs`
- **AI Engine**: `@google/genai` (Gemini API)
- **Content Rendering**: `react-markdown`, `remark-gfm`

## 🛠️ Getting Started

### Prerequisites

You will need the following installed:
- Node.js 20+
- A MongoDB cluster (e.g., MongoDB Atlas)
- A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SathtikBose/Ink-Forge.git
   cd Ink-Forge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root of your project and populate it with the following keys:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication Secret
   JWT_SECRET=your_super_secret_jwt_key

   # AI Integration
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is optimized for deployment on platforms like Render, Vercel, or any Node.js hosting environment.

**For Render Deployment:**
1. Connect your GitHub repository to Render.
2. Select **Web Service** and choose the Node environment.
3. Set the build command to `npm install && npm run build`.
4. Set the start command to `npm start`.
5. Add your Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`).
6. Deploy!

---
*Built with ❤️ and Next.js*
