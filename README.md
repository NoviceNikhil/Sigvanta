# Product & Order Management System
(E-Commerce Domain)

A scalable, secure, and production-ready full-stack e-commerce platform that unifies product management, order lifecycle tracking, inventory control, user authentication, and activity logging in one centralized system — tested on a real Amazon 2023 sales dataset.

![Homepage](images/homepage.png)
## 🌟 Features

### User Authentication & Management

![Signup Page](images/signup.png)

![Login Page](images/userlogin.png)

![OTP Verification](images/otp.png)

- 🔐 **Login / Signup** - Role-based login system with User / Admin toggle
- 🔑 **Google OAuth** - One-click Google sign-in via Passport.js
- 📧 **OTP Verification** - Email-based OTP for user and admin accounts
- 🔄 **Forgot & Reset Password** - Secure password recovery with tokenized reset links
- 👤 **Admin Request System** - Users can request admin access; admins can approve or reject with reason
- 🛡️ **Role-Based Access Control** - Middleware-enforced separation of customer and admin routes
- 🔒 **JWT Authentication** - Stateless token-based authentication on all protected endpoints

### Home Page & Product Discovery
- 🏠 **Landing Hub** - Serves as the central discovery engine for the entire application
- 🎠 **Animated Banner Carousel** - Seamless right-to-left animated banners showcasing deals and categories
- 🔍 **Advanced Weighted Search** - Custom search engine with dynamic ranking across the Amazon product catalog
- 🗂️ **Interactive Category Bar** - Browse products by curated categories with one click
- 👤 **Role-Aware Header** - Navigation adapts dynamically based on whether the user is a customer or admin

### Product Catalog

![All Products](images/AllProducts.png)

- 📦 **Universal Catalog** - Browse all products or filter by specific category
- ⚖️ **Weighted Search Engine** - Products ranked by multiple relevance factors
- 🔢 **Dynamic Pagination** - Server-side pagination for fast load times at scale
- 📊 **Advanced Sorting** - Sort by price, discount, rating, and more
- 🛒 **Quick Add to Cart** - Add items directly from catalog cards
- ❤️ **Quick Wishlist** - Tap the heart icon on any product card to save for later

### Wishlist
- 💾 **Persistent Wishlist** - Items saved across sessions per user
- ➕ **Add from Anywhere** - Add items from Homepage or Product Catalog pages
- 🔀 **Move to Cart** - Move individual wishlist items to cart with a single click
- 🗑️ **Remove Items** - Remove individual items with real-time UI updates
- 🔄 **Real-Time Updates** - UI reflects additions and removals instantly without page reload

### Category Management
- 🗂️ **Admin CRUD** - Create, read, update, and delete categories via REST APIs
- 🔎 **Debounced Search** - Search categories with 400ms debounce to minimize API calls
- 📄 **Sorting & Pagination** - Server-side pagination and multi-column sorting
- ✅ **Validation** - Joi-powered request validation with centralized error handling middleware
- ⚡ **Optimized Rendering** - `useMemo` used to prevent unnecessary re-renders
- 🔔 **Loading & Toast States** - Skeleton loaders, toast notifications, and empty state handling

### Inventory Management
- 📦 **Full CRUD via REST APIs** - Create, read, update, delete products and inventory records
- 🔍 **Search & Filters** - Debounced search, category filters, and sorting with Apply Filters button
- 🏷️ **Stock Level Badges** - Real-time Low / Medium / High stock indicators per product
- 🖼️ **Image Upload** - Multer parses file buffer, streams to Cloudinary, returns secure URL
- 👁️ **Instant Image Preview** - Preview uploaded image before saving using `createObjectURL`
- 🔢 **Server-Side Pagination** - Paginated responses via AdminAPIFeatures utility
- 💀 **Skeleton Loaders** - Loading skeletons and inline error banners for better UX

### Cart Interface
- 🛒 **Personalized Cart** - Each user has their own isolated cart stored in MySQL
- ➕ **Add from Multiple Sources** - Add items from Products page or directly from Wishlist
- 🔢 **Quantity Controls** - Increase or decrease quantity with inventory validation checks
- 💰 **Real-Time Total** - Cart total recalculates instantly on any quantity change
- 🗑️ **Remove Items** - Remove individual items or empty the entire cart
- ✅ **Checkout Flow** - Confirmation modal with full order summary before placing
- 🔀 **Redirect to Orders** - Automatically redirects to Order History page after successful checkout

### Orders Management (Admin)
- 📋 **Admin Panel** - Monitor and manage all customer orders in real time
- 📄 **Paginated Table** - Displays Order ID, User ID, items, total amount, status, and date
- ✅ **Accept / Reject** - Instantly accept or reject incoming customer orders with a single click
- 🔍 **Search by User ID** - Quickly locate any order by searching with the customer's User ID
- 🔄 **Status Updates** - Update delivery status: Pending → Placed → Shipped → Delivered → Cancelled
- 🏷️ **Filter by Status** - Filter orders by: Pending, Placed, Shipped, Delivered, or Cancelled
- 💰 **Amount Range Filter** - Narrow results by minimum to maximum order amount
- 📅 **Date Range Filter** - Filter orders within a specific date window

### Order History (Customer)
- 📜 **Customer-Facing Panel** - View, track, and cancel pending orders in real time
- 🏷️ **Filter by Status** - Filter order history by All, Pending, Placed, Shipped, Delivered, or Cancelled
- 🪪 **Order Cards** - Each card shows Order ID, Date, Total Amount, Item Count, and Status Badge
- 📈 **Step-by-Step Timeline** - Visual order progress tracker: Pending → Placed → Shipped → Delivered
- 🛍️ **Itemized Breakdown** - Each order card shows Product Image, Name, Quantity, and Price
- 💰 **Order Total** - Displayed at the bottom of each order card
- ❌ **Cancel Orders** - Cancel option available for orders still in Pending status

### Admin Dashboard
- 📊 **Aggregated Stats** - Total Users, Total Orders, Total Sales, and Total Products at a glance
- 📋 **Recent Orders Table** - Shows product image, amount, status badge, and date
- 📦 **Recently Added Products** - Quick price snapshot of newly added inventory
- 👤 **New Users Table** - Displays avatar, role badge, and join date for recent registrations
- 💰 **INR Currency Formatting** - All monetary values formatted in Indian locale (₹)
- 🎨 **Color-Coded Badges** - Status badges with distinct colors: pending, placed, shipped, delivered, cancelled

### Audit & Activity Logging
- 📝 **Complete Logging** - Auth events, admin actions, and order lifecycle events all captured
- 🔧 **Non-Blocking** - Logging is best-effort and does not interrupt core application operations
- 💾 **MongoDB Storage** - Logs stored in structured MongoDB collections for monitoring and audits
- 🔐 **JWT + Role-Based Access** - Log endpoints protected — admin-only access enforced
- 👁️ **Admin Log Monitor** - Admins can view all activity logs directly from the dashboard panel

### UI/UX & Performance
- ⚡ **Debounced Search** - All search inputs debounced across Inventory, Category, and Product pages
- 🧠 **React Memoization** - `useMemo` and `useCallback` used throughout to reduce re-renders
- 📄 **Server-Side Pagination** - Applied on products, categories, and orders for faster loads
- 💀 **Skeleton Loaders** - Smooth loading skeletons instead of blank screens
- 🔔 **Toast Notifications** - Real-time feedback across all create, update, and delete operations
- 📱 **Responsive Design** - Clean, modern layout that adapts across all screen sizes
- 🔁 **Smooth Transitions** - Loading states with opacity and blur transitions

---

## 🛠️ Tech Stack

### Frontend
- **React** 19+ - UI library
- **Redux Toolkit** - Global state management
- **React Router DOM** v7 - Client-side navigation
- **Axios** - HTTP client with interceptors
- **Lucide React + React Icons** - Icon libraries
- **Tailwind CSS** v4 - Utility-first styling
- **React Toastify** - Toast notification system
- **Vite** v8 - Build tool and development server
- **ESLint** - Code linting and quality enforcement

### Backend
- **Node.js + Express** v5 - REST API server
- **MySQL + Sequelize** v6 - Relational database for products, categories, orders, cart, wishlist
- **MongoDB + Mongoose** - Document store for activity logs and user schema
- **Passport.js + Google OAuth 2.0** - Third-party authentication
- **JWT + bcryptjs** - Stateless token auth and password hashing
- **Nodemailer** - OTP and transactional email delivery
- **Multer + Cloudinary** - File upload handling with cloud storage
- **Joi** - Schema-based request validation
- **express-rate-limit** - API rate limiting middleware
- **cookie-parser** - Cookie management
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Nodemon** - Auto-restart development server

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8+
- MongoDB 6+
- Cloudinary account
- Google OAuth 2.0 credentials
- Gmail account (for Nodemailer OTP)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd CODEBASE
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file inside `/backend`:
```env
PORT=5000

# MySQL
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=ecommerce_db

# MongoDB
MONGO_URI=mongodb://localhost:27017/ecommerce_logs

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Nodemailer
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Start the Backend Server
```bash
npm start
```

### 5. Seed the Database (Optional)
```bash
node seed.js
```

### 6. Install Frontend Dependencies
```bash
cd frontend/react-app
npm install
```

### 7. Start the Frontend Dev Server
```bash
npm run dev
```

### 8. Open your browser
```
http://localhost:5173
```

---

## 🚀 Usage

### Browsing Products
1. Visit the **Home Page** to see featured categories and the animated product banner
2. Use the **Category Bar** to jump to a specific product category
3. Use the **Search Bar** to find products by name across the entire catalog
4. Click **Add to Cart** or the ❤️ icon directly on any product card

### Managing Your Cart
1. Click the **Cart icon** in the header to open your cart
2. Adjust quantities using the **+ / −** controls — inventory limits are enforced automatically
3. Click **Remove** to delete a specific item or **Clear Cart** to empty everything
4. Click **Checkout** to open the order summary modal and confirm your purchase

### Tracking Your Orders
1. Navigate to **My Orders** to see your full order history
2. Use the **status filter** to view only Pending, Shipped, Delivered, or Cancelled orders
3. Expand any order card to see the full **itemized breakdown and step-by-step timeline**
4. Click **Cancel** on any Pending order to cancel it before it is processed by the admin

### Admin — Managing Inventory
1. Log in with an admin account and navigate to **Admin → Inventory** in the sidebar
2. Click **Add Product** to open the inventory modal
3. Fill in product details and **upload an image** — an instant preview appears before saving
4. Click **Save** to push the product live; it appears in the customer catalog immediately
5. Use the **search bar** and **filters** to locate existing products; edit or delete from the table

### Admin — Managing Orders
1. Navigate to **Admin → Orders** in the sidebar
2. Use **status filters**, **date range**, and **amount range** to locate specific orders
3. Click **Accept** or **Reject** on any incoming Pending order
4. Use the **status dropdown** to progress an order through: Placed → Shipped → Delivered

### Admin — Managing Categories
1. Navigate to **Admin → Categories** in the sidebar
2. Click **Add Category** to create a new category
3. Use the **search bar** to quickly find an existing category
4. Click the **edit icon** to rename a category or the **delete icon** to remove it

---

## 📁 Project Structure

```
CODEBASE/
├── backend/
│   ├── app.js                           # Express app entry point
│   ├── seed.js                          # Database seeder script
│   ├── process_data.py                  # Amazon dataset processing script
│   ├── final_seed.json                  # Processed seed data
│   ├── archive/                         # Raw Amazon 2023 CSV dataset files
│   ├── config/
│   │   ├── db.js                        # MongoDB connection setup
│   │   ├── sql.js                       # Sequelize / MySQL connection setup
│   │   └── passport.js                  # Google OAuth 2.0 strategy config
│   ├── controllers/
│   │   ├── authController.js            # Login, signup, password reset
│   │   ├── authController.verifyOTP.js  # OTP verification logic
│   │   ├── googleAuthController.js      # Google OAuth callback handler
│   │   ├── userController.js            # User profile CRUD
│   │   ├── adminRequestController.js    # Admin access request handling
│   │   ├── inventoryController.js       # Product + inventory CRUD
│   │   ├── categoryController.js        # Category CRUD
│   │   ├── productController.js         # Product read endpoints
│   │   ├── cartController.js            # Cart operations
│   │   ├── wishlistController.js        # Wishlist operations
│   │   ├── orderController.js           # Order placement + management
│   │   ├── dashboardController.js       # Admin dashboard stats
│   │   └── adminLogsController.js       # Activity log retrieval
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT token verification
│   │   ├── authenticate_middlewere.js   # Auth middleware alias
│   │   ├── authorize.js                 # Role-based route guard
│   │   ├── rateLimiter.js               # express-rate-limit config
│   │   ├── categoryValidator.js         # Joi schema for categories
│   │   ├── productValidator.js          # Joi schema for products
│   │   ├── validateAuth.js              # Joi schema for auth inputs
│   │   ├── errorHandler.js              # Centralized error handler
│   │   ├── mockAuth.js                  # Mock auth for testing
│   │   ├── roleVerifyMiddlewere.js      # Role verification middleware
│   │   └── logger.js                    # Request logger middleware
│   ├── models/
│   │   ├── userSchema.js                # Mongoose user schema (MongoDB)
│   │   ├── adminRequestModel.js         # Mongoose admin request schema
│   │   ├── user.sql.js                  # Sequelize User model
│   │   ├── product.sql.js               # Sequelize Product model
│   │   ├── category.sql.js              # Sequelize Category model
│   │   ├── inventory.sql.js             # Sequelize Inventory model
│   │   ├── cart.sql.js                  # Sequelize Cart model
│   │   ├── wishlist.sql.js              # Sequelize Wishlist model
│   │   ├── order.sql.js                 # Sequelize Order model
│   │   ├── orderItem.sql.js             # Sequelize OrderItem model
│   │   └── index.sql.js                 # Sequelize associations setup
│   ├── routes/
│   │   ├── authRoute.js                 # Auth routes
│   │   ├── UserRoute.js                 # User profile routes
│   │   ├── adminRequestRoutes.js        # Admin request routes
│   │   ├── inventoryRoutes.js           # Inventory routes
│   │   ├── categoryRoutes.js            # Category routes
│   │   ├── productRoutes.js             # Product routes
│   │   ├── cartRoutes.js                # Cart routes
│   │   ├── wishlistRoutes.js            # Wishlist routes
│   │   ├── orderRoutes.js               # Order routes
│   │   ├── dashboardRoutes.js           # Dashboard routes
│   │   └── adminLogRoutes.js            # Activity log routes
│   ├── services/
│   │   ├── authServices.js              # Auth business logic
│   │   ├── authServices.verifyOTP.js    # OTP generation and validation
│   │   ├── userServices.js              # User profile logic
│   │   ├── inventoryService.js          # Inventory business logic
│   │   ├── categoryServices.js          # Category business logic
│   │   ├── productServices.js           # Product read logic
│   │   ├── cartServices.js              # Cart business logic
│   │   ├── wishlistServices.js          # Wishlist business logic
│   │   ├── orderServices.js             # Order business logic
│   │   └── dashboardService.js          # Dashboard aggregation logic
│   └── utils/
│       ├── APIfeatures.js               # Customer filter/sort/paginate helper
│       ├── AdminaAPIFeatures.js         # Admin filter/sort/paginate helper
│       ├── AppError.js                  # Custom error class
│       ├── apiResponce.js               # Standardized API response wrapper
│       ├── Cloudinary.js                # Cloudinary upload helper
│       ├── multer.js                    # Multer memory storage config
│       ├── mongoLogs.js                 # MongoDB activity log writer
│       └── sendotp.js                   # Nodemailer OTP sender
│
└── frontend/react-app/
    ├── index.html                       # HTML entry point
    ├── vite.config.js                   # Vite configuration
    ├── tailwind.config.js               # Tailwind CSS configuration
    ├── eslint.config.js                 # ESLint configuration
    ├── hooks/
    │   └── useAuthInit.js               # Auth initialization custom hook
    └── src/
        ├── main.jsx                     # React app entry point
        ├── App.jsx                      # Root component with all routes
        ├── index.css                    # Global styles
        ├── api/
        │   ├── axios.js                 # Axios instance with base URL + interceptors
        │   └── auth.js                  # Auth-specific Axios calls
        ├── store/
        │   ├── store.js                 # Redux store configuration
        │   └── authSlice.js             # Auth state slice (login, logout, user data)
        ├── components/
        │   ├── AdminHeader.jsx          # Admin top navigation bar
        │   ├── AdminLogsPanel.jsx       # Admin activity logs display panel
        │   ├── Card.jsx                 # Reusable product card component
        │   ├── CategoryBar.jsx          # Horizontal category navigation bar
        │   ├── CategoryFilters.jsx      # Category page search + filter controls
        │   ├── CategoryModal.jsx        # Add / Edit category modal
        │   ├── CategoryTable.jsx        # Admin category data table
        │   ├── Footer.jsx               # Global footer component
        │   ├── InventoryFilters.jsx     # Inventory page search + filter controls
        │   ├── InventoryModel.jsx       # Add / Edit inventory modal with image upload
        │   ├── InventoryTable.jsx       # Admin inventory data table
        │   ├── Layout.jsx               # Admin layout wrapper with sidebar
        │   ├── OrdersTable.jsx          # Admin orders data table
        │   ├── OrderStatusModal.jsx     # Order status update modal
        │   ├── ProtectedRoute.jsx       # Admin route guard component
        │   ├── Sidebar.jsx              # Admin sidebar navigation
        │   └── StaticCategorySection.jsx # Static homepage category grid
        ├── componentsUser/
        │   ├── CustomInput.jsx          # Reusable form input field
        │   ├── GoogleIcon.jsx           # Google OAuth button icon
        │   ├── ProtectedRoute.jsx       # Customer route guard component
        │   └── ToggleSwitch.jsx         # User / Admin login role toggle
        ├── pages/
        │   ├── admin/
        │   │   ├── Dashboard.jsx        # Admin dashboard with stats and recent tables
        │   │   ├── Inventory.jsx        # Admin inventory management page
        │   │   ├── Category.jsx         # Admin category management page
        │   │   ├── OrdersManagement.jsx # Admin orders management page
        │   │   └── AdminLogs.jsx        # Admin activity log viewer
        │   ├── Home.jsx                 # Customer homepage with banner and categories
        │   ├── Login.jsx                # Login page with role toggle
        │   ├── Signup.jsx               # Signup page
        │   ├── UserOtp.jsx              # User OTP verification page
        │   ├── AdminOtp.jsx             # Admin OTP verification page
        │   ├── ForgetPass.jsx           # Forgot password request page
        │   ├── ResetPassword.jsx        # Password reset page
        │   ├── AuthRedirect.jsx         # Post-OAuth redirect handler
        │   ├── Products.jsx             # All products catalog page
        │   ├── Categoryproducts.jsx     # Category-specific product listing page
        │   ├── Cart.jsx                 # Customer cart page
        │   ├── Wishlist.jsx             # Customer wishlist page
        │   ├── Orders.jsx               # Customer order history page
        │   └── Profile.jsx              # Customer / Admin profile page
        ├── services/
        │   ├── authServices.js          # Auth API calls (login, signup, OTP)
        │   ├── inventoryService.js      # Inventory API calls
        │   ├── categoryServices.js      # Category API calls
        │   ├── productServices.js       # Product API calls
        │   ├── cartServices.js          # Cart API calls
        │   ├── wishlistServices.js      # Wishlist API calls
        │   ├── orderService.js          # Order API calls
        │   ├── dashboardService.js      # Dashboard stats API calls
        │   └── logService.js            # Admin log API calls
        └── utils/
            ├── debounce.js              # Reusable debounce utility function
            └── fetchAndStoreUser.js     # Fetch logged-in user and populate Redux store
```

---

## 🔧 API Endpoints

### Auth
- `POST /api/v1/auth/signup` — Register a new user
- `POST /api/v1/auth/login` — Login with email and password
- `POST /api/v1/auth/verify-otp` — Verify email OTP for user
- `POST /api/v1/auth/verify-admin-otp` — Verify email OTP for admin
- `POST /api/v1/auth/forgot-password` — Trigger password reset email
- `POST /api/v1/auth/reset-password/:token` — Reset password using reset token
- `GET /auth/google` — Initiate Google OAuth login
- `GET /auth/google/callback` — Google OAuth callback redirect

### Users
- `GET /api/v1/users/profile` — Get logged-in user's profile
- `PUT /api/v1/users/profile` — Update name, email, or avatar
- `DELETE /api/v1/users/profile` — Delete user account
- `GET /api/v1/users` — Get all users (admin only)

### Admin Requests
- `POST /api/v1/admin-requests` — Submit an admin access request with reason
- `GET /api/v1/admin-requests` — Get all pending requests (admin only)
- `PATCH /api/v1/admin-requests/:id` — Accept or reject a request (admin only)

### Products
- `GET /api/v1/products` — Get all products with search, filter, sort, and pagination
- `GET /api/v1/products/:id` — Get a single product by ID
- `GET /api/v1/products/category/:categoryId` — Get products filtered by category

### Inventory (Admin)
- `GET /api/v1/inventory` — Get all inventory items (admin)
- `POST /api/v1/inventory` — Create a new product and inventory record
- `PUT /api/v1/inventory/:id` — Update a product and its inventory details
- `DELETE /api/v1/inventory/:id` — Delete a product
- `POST /api/v1/inventory/uploadImage` — Upload product image to Cloudinary

### Categories
- `GET /api/v1/category` — Get all categories
- `POST /api/v1/category` — Create a new category (admin)
- `PUT /api/v1/category/:id` — Update a category (admin)
- `DELETE /api/v1/category/:id` — Delete a category (admin)

### Cart
- `GET /api/v1/cart` — Get the current user's cart
- `POST /api/v1/cart` — Add an item to the cart
- `PUT /api/v1/cart/:id` — Update item quantity in cart
- `DELETE /api/v1/cart/:id` — Remove a specific item from cart
- `DELETE /api/v1/cart` — Clear the entire cart

### Wishlist
- `GET /api/v1/wishlist` — Get the current user's wishlist
- `POST /api/v1/wishlist` — Add an item to the wishlist
- `DELETE /api/v1/wishlist/:id` — Remove an item from the wishlist

### Orders
- `POST /api/v1/orders` — Place a new order (checkout)
- `GET /api/v1/orders` — Get all orders with filters (admin)
- `GET /api/v1/orders/my` — Get the logged-in customer's order history
- `PATCH /api/v1/orders/:id/accept` — Accept an incoming order (admin)
- `PATCH /api/v1/orders/:id/reject` — Reject an incoming order (admin)
- `PATCH /api/v1/orders/:id/status` — Update order delivery status (admin)
- `DELETE /api/v1/orders/:id` — Cancel a pending order (customer)

### Dashboard (Admin)
- `GET /api/v1/dashboard/stats` — Aggregated totals: users, orders, sales, products
- `GET /api/v1/dashboard/recent-orders` — Recent orders with product info
- `GET /api/v1/dashboard/recent-products` — Recently added inventory
- `GET /api/v1/dashboard/recent-users` — Newly registered users with role badges

### Activity Logs (Admin)
- `GET /api/v1/logs` — Get all activity logs (admin only)

---

## 🎨 Features in Detail

### Advanced Weighted Search Engine
The product search system is built on a custom weighted ranking algorithm trained on the Amazon 2023 dataset:
- **Multi-Field Matching** — Searches simultaneously across product name, category, brand, and description fields
- **Weighted Scoring** — Each matching field contributes a different weight to the final relevance score, so a name match ranks higher than a description match
- **Dynamic Pagination** — Results are paginated server-side; even catalogs with thousands of items respond quickly
- **Real-Time Updates** — Search results re-render as the user types with no full-page reload required
- **Category Scoping** — On category-specific pages, search is automatically scoped to that category only, keeping results relevant

### Order Lifecycle State Machine
The order system implements a strict, traceable, one-way state machine:
- **Pending** — Order placed by customer, awaiting admin review
- **Placed** — Admin accepted the order and confirmed it for processing
- **Shipped** — Order dispatched; status updated by admin in the orders panel
- **Delivered** — Order marked as successfully received by the customer
- **Cancelled** — Cancelled by the customer (only while Pending) or rejected by the admin at any stage
- Each transition is validated on the backend to prevent illegal state jumps (e.g. Delivered → Pending)
- Every status change is written to MongoDB as an activity log for a complete, timestamped audit trail

### Inventory Image Upload Pipeline
The image upload flow is fully integrated across frontend, backend, and cloud:
- **Multer** is configured with memory storage so the uploaded file is held in a buffer — no temporary disk writes
- The buffer is streamed directly to **Cloudinary** via the upload stream API
- Cloudinary processes the image and returns a `secure_url` which is persisted to the product record in MySQL
- On the frontend, an **instant image preview** is rendered using `URL.createObjectURL` before the API call even completes, giving the admin immediate visual feedback
- On product update, the old Cloudinary asset is replaced cleanly without leaving orphaned files in the cloud

### Category Management System
The admin category interface is optimized for high-volume, low-friction management:
- **Debounced Search** — A reusable `debounce.js` utility delays the API call by 400ms after each keystroke, batching rapid input into a single request
- **useMemo Optimization** — The filtered and sorted category list is memoized so the table component only re-renders when the underlying data actually changes, not on every parent render
- **Joi Validation** — Every create and update request passes through a Joi schema on the backend before any database interaction begins
- **Centralized Error Handler** — All validation errors bubble up through a single Express `errorHandler.js` middleware that returns consistent, structured error responses across the entire API

### Audit Logging Architecture
The logging system is designed to be comprehensive, structured, and non-intrusive:
- **Non-Blocking Writes** — Log writes use fire-and-forget calls so a MongoDB write failure never crashes a user-facing request or rolls back a transaction
- **Event Coverage** — Captures: user login, logout, signup, admin CRUD actions on inventory and categories, and every order status change
- **Structured Documents** — Each log document in MongoDB contains: event type, actor ID, actor role, target resource ID, action performed, timestamp, and any relevant metadata
- **Admin-Only Retrieval** — Log read endpoints are protected by both JWT middleware and role-check middleware so only authenticated admins can access the log history
- **Dashboard Integration** — The `AdminLogsPanel` component is embedded directly in the admin dashboard, so admins can review recent activity without navigating to a separate page

### Smart Pagination System
Pagination is applied consistently across every data-heavy view in the application:
- **Server-Side Slicing** — Data is sliced at the database query level using `LIMIT` and `OFFSET`, not filtered in memory, ensuring consistent performance regardless of total record count
- **Reusable Utility Classes** — `APIfeatures.js` (customer-facing) and `AdminaAPIFeatures.js` (admin-facing) are chainable builder classes that attach filtering, sorting, and pagination to any Sequelize query before execution
- **Boundary Handling** — Previous/Next navigation buttons are automatically disabled at the first and last pages, preventing out-of-range API calls
- **Configurable Page Size** — Items-per-page is configurable per endpoint, allowing different limits for products (larger) versus categories (smaller)

### Role-Based Access Control
Role separation is enforced at every layer of the stack — frontend, API, and database:
- **Frontend Route Guards** — Separate `ProtectedRoute` components for customer and admin pages check the Redux auth state and redirect unauthorized users to login before rendering any protected page
- **JWT Middleware** — `authenticate_middlewere.js` extracts and verifies the JWT on every protected request; expired or malformed tokens are rejected with a 401 before reaching any controller
- **Role Middleware** — `authorize.js` checks the decoded token's role against the required permission for that route; a customer hitting an admin endpoint receives a 403
- **Admin Request Flow** — Regular users can apply for admin access via a form with a stated reason; the request is stored in MongoDB and only activates after explicit approval by an existing admin, preventing any form of self-promotion or privilege escalation

### Additional Features Implemented
- **Amount Range Filtering** — Min and max price filters on both the product catalog and orders management table
- **Responsive Modal Forms** — All create and edit modals are fully responsive and accessible
- **Form Validation** — Client-side validation on all forms before API calls are made
- **Error Messaging** — Inline and toast error messages throughout the UI for failed operations
- **Multiple Sort Options** — Sort by price (asc/desc), newest first, and discount percentage across catalog pages
- **Delete Confirmation Dialogs** — Confirmation prompt before any irreversible delete operation
- **Clean and Modern UI** — Consistent design language with card layouts, status badges, and icon-led actions
- **Loading Spinners** — Spinner overlays on all async operations to prevent double-submission
- **Real-Time Cart Totals** — Grand total recalculates on every cart change without any user interaction

---

## 👥 Team

| Member | Responsibilities |
|--------|-----------------|
| **Mohammad Rustam** | Designed and developed the complete Inventory Management system (frontend + backend), dashboard architecture, initial UI/UX design, frontend routing, project architecture, and end-to-end module integration |
| **Nikhil CS** | Engineered core shopping interfaces (Homepage, Catalog, Wishlist) powered by a custom weighted search engine with dynamic pagination and real-time discount sorting using the Amazon sales dataset |
| **Om Jadhav** | Built REST APIs for order management with full lifecycle tracking and admin controls; developed customer order history and admin orders page with search, filters, sorting, and pagination |
| **Madhur Suresh Rao** | Developed the Cart interface end-to-end (backend logic, API integration, frontend UI), ensuring seamless interaction with Wishlist and Orders modules |
| **Kalpana Meena** | Implemented admin Category Management with full CRUD via backend APIs, debounced search, sorting, and pagination for optimized performance |
| **Mohammed Faizan** | Engineered the scalable audit and activity logging system capturing auth, admin actions, and order lifecycle events; implemented non-blocking logging and integrated log monitoring into the admin dashboard |
| **Nikhil Kumar Gupta** | Developed all user-related backend routes, authentication, and middleware — JWT, OTP verification, role-based access, and overall request flow management |
| **Pankaj Kumar Rai** | Developed frontend for Login, User Profile, and Admin Profile with role-based functionality; implemented user CRUD including profile update, account deletion, and data retrieval |

---

## 🔮 Future Enhancements

- [ ] Real-time order tracking with live location updates via Maps API
- [ ] Payment gateway integration (Stripe / Razorpay) with secure transaction handling
- [ ] AI-powered recommendation system based on user behavior and purchase history
- [ ] Microservices architecture with containerization via Docker + Kubernetes
- [ ] Real-time notifications via email, SMS, and push for every order update
- [ ] Advanced analytics dashboard with sales trend graphs and user activity heatmaps
- [ ] Mobile application built with React Native
- [ ] Multi-language and multi-currency support

## 🐛 Known Issues

- None reported

---

**Built with ❤️ by the Sigmoid Batch — Macro Project 2026**
