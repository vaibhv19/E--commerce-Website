# General Store Ledger

General Store Ledger — a full-stack e-commerce app with product catalog, cart, checkout, and order history, built for IBM Full Stack Web Development, Module V (IBM-PBEL Module V: Full-Stack Project Development & Deployment).

---

## 1. What It Does

This application simulates a mail-order catalog e-commerce experience. Users can:
- Browse a product catalog with search queries and category filters.
- View detailed product specifications and images.
- Add items to a shopping cart (session-persistent, client-side only).
- Authenticate (signup/login) to check out.
- Place orders, which are recalculated and validated server-side.
- View their personal order history and individual receipt details.

---

## 2. Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose ODM), JSON Web Tokens (JWT) stored in HTTP-only cookies, and bcryptjs for password hashing.
- **Frontend:** React (functional components and hooks), React Router (routing), Tailwind CSS (styling), Vite (bundler and build tool), and React Context API (cart and authentication state management).
- **Product Data:** Proxied from the free public DummyJSON API (`https://dummyjson.com/products`). No API key is required.

---

## 3. How to Run

Running this application requires two separate terminal windows as both the backend and frontend servers need to run simultaneously.

### Database Requirement
You will need your own free MongoDB Atlas cluster or a local MongoDB database instance. No shared or pre-hosted database connection is provided in this repository.

### Backend Setup (Port 5000)
1. Navigate to the project root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file at the root of the project (use `.env.example` as a template):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/general-store-catalog
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```

### Frontend Setup (Port 5173)
1. Navigate to the `frontend/` subdirectory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 4. Project Structure

```
├── config/              # MongoDB connection configurations
├── controllers/         # Backend controller logic (auth, products, orders)
├── middleware/          # JWT authorization middleware
├── models/              # Mongoose data models (User, Order)
├── routes/              # Express API endpoints
├── server.js            # App entrypoint & middleware configuration
├── frontend/
│   ├── src/
│   │   ├── api/         # Client-side fetch helper wrappers
│   │   ├── components/  # Layout blocks (Header, etc.)
│   │   ├── context/     # AuthContext and CartContext state providers
│   │   ├── pages/       # Catalog, ProductDetail, Cart, Checkout, Auth, History
│   │   ├── index.css    # Global Tailwind styles & theme variables
│   │   └── App.jsx      # Route switches & Provider wrapper layout
```

---

## 5. API Endpoints

| Method | Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | No | Creates a new user registry record and sets JWT cookie |
| **POST** | `/api/auth/login` | No | Authenticates credentials and sets JWT cookie |
| **POST** | `/api/auth/logout` | No | Clears the JWT cookie session |
| **GET** | `/api/auth/me` | Yes | Retrieves current logged-in user profile details |
| **GET** | `/api/products` | No | Lists products (supports `category`, `search`, `limit`, `skip` queries) |
| **GET** | `/api/products/:id` | No | Returns detailed records for a single product |
| **GET** | `/api/products/categories` | No | Returns a list of all available product categories |
| **POST** | `/api/orders` | Yes | Places a new order (items verified and recalculated server-side) |
| **GET** | `/api/orders` | Yes | Returns logged-in user's transaction history |
| **GET** | `/api/orders/:id` | Yes (Owner) | Returns detailed receipt for a specific order |

---

## 6. Security Notes

- **Password Security:** User passwords are encrypted using `bcryptjs` before storage in MongoDB. Raw passwords are never stored in the database or returned in API responses.
- **Session Auth:** JWT tokens are stored in secure, `httpOnly`, `sameSite` cookies. This mitigates XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery) attacks.
- **Server Recalculation:** The server does not trust client-submitted prices or totals. Checkout payloads only accept product IDs and quantities; the server fetches fresh price records from DummyJSON to calculate the final order totals.
- **Order Isolation:** The order detail endpoint (`GET /api/orders/:id`) performs ownership validation to ensure users can only access their own invoices.
- **Input Validation:** Backend verifies fields during user registration and checks that checkout payloads contain non-empty cart lists, positive quantities, and valid product IDs.

---

## 7. Features List

- **Interactive Product Catalog:** Paginated grid index displaying product images, specifications, and prices, with category filters and search options.
- **Specifications Sheet:** Product gallery support and technical details.
- **Cart Context Ledger:** Context-based cart supporting quantity increments/decrements and removal actions. Persists during session navigation but resets on reload.
- **Auth-Gated Checkout:** Blocks unauthenticated checkout attempts, redirects users to register/login, and automatically returns them to checkout upon success.
- **Receipt Certification:** Places orders with a customized double-entry bookkeeping summary log.
- **Robust Exception Handling:** Graceful loading, error, and empty catalog/cart screens.
- **Responsive Layout:** Adaptive styles scaling down to mobile viewport sizes.
- **Accessibility features:** Standard keyboard focus states (`:focus-visible`) and reduced-motion compatibility query handlers.
