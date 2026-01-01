# Chat Application

A real-time chat application built with a monorepo structure using React, Node.js, and WebSockets.

## Project Structure

- **packages/frontend**: React application (Vite + Tailwind CSS)
- **packages/backend**: Node.js WebSocket server

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies in the root directory:
   ```bash
   npm install
   ```

### Running Locally

1. Start the backend server:
   ```bash
   cd packages/backend
   npm run dev
   ```
   The WebSocket server will start on port 8080.

2. Start the frontend application:
   ```bash
   cd packages/frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Features

- Real-time messaging using WebSockets
- Room-based chat
- Custom "Doto" font integration
- Modern UI with Tailwind CSS
- Auto-scroll to new messages
- In-memory message history (persists until server restart)

## Deployment

### Frontend (Vercel/Netlify)
Set the environment variable:
- `VITE_WS_URL`: Your backend WebSocket URL (e.g., `wss://chat.yourdomain.com`)

### Backend (EC2/Render/Railway)
Set the environment variable:
- `PORT`: The port to listen on (default: 8080)
