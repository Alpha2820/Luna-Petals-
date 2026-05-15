# Luna Petals

A boutique florist storefront with a React/Vite client and an Express/MongoDB backend.

## Project overview

- **Frontend**: `client/`
  - React 19 with Vite
  - Tailwind-like styling via CSS and custom theme variables
  - Pages for home, products, cart, wishlist, checkout, profile, login/signup
- **Backend**: `server/`
  - Express API with MongoDB data storage
  - File upload support via Cloudinary
  - Admin auth, product, order, and upload routes
  - Socket.io order tracking support

## Quick start

From the repository root:

```bash
cd client
npm install
npm run dev
```

In a second terminal:

```bash
cd server
npm install
npm run dev
```

Then open the client at:

```bash
http://localhost:5173
```

## Environment variables

The server uses a `.env` file in `server/`.
Create one or copy from `.env.example` if available, then add the required variables such as:

- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

> Do not commit real secret values to version control.

## Scripts

### Client

- `npm run dev` — start the Vite development server
- `npm run build` — build the production app
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

### Server

- `npm run dev` — start the server with nodemon
- `npm start` — start the server with Node

## Notes

- The frontend expects the backend API to be available at `http://localhost:5173` for CORS and socket connections.
- If you change server ports or host settings, update the CORS origin in `server/index.js` accordingly.

## Folder structure

- `client/` — React application
- `server/` — Express backend

---

Built for Luna Petals ecommerce flows and quick deploy/testing locally.
