# Sweet Shop Management System

A comprehensive e-commerce platform for managing a sweet shop with advanced features including inventory management, order processing, user authentication, and AI-assisted search.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** via Supabase Auth (access + refresh tokens)
- **Role-based access control**: Admin and User roles
- **Protected routes** (frontend + backend)
- **Auto logout** on token expiry
- Secure session management

### 🍬 Sweet Management (CRUD)
- ✅ Add new sweets (Admin only)
- ✅ Update sweet details (price, category, quantity)
- ✅ Delete sweets (Admin only)
- ✅ Unique ID validation
- ✅ Server-side + client-side validation
- ✅ Image upload support

### 📦 Inventory Management
- ✅ **Concurrency-safe inventory updates** using PostgreSQL row-level locking
- ✅ Purchase sweet → quantity decreases automatically
- ✅ Disable "Purchase" button if quantity = 0
- ✅ Restock sweet (Admin only)
- ✅ Prevent negative inventory
- ✅ Real-time stock updates

### 🔍 Search & Filters
- ✅ Search by name and description
- ✅ Filter by category
- ✅ Price range filter with slider
- ✅ In-stock only filter
- ✅ **Debounced search** for optimal performance
- ✅ Combined filters support

### 🧾 Purchase History & Audit Logs
- ✅ Complete purchase history for users
- ✅ Admin view of all orders
- ✅ **Audit logs** for inventory changes
- ✅ Restock history tracking
- ✅ Action logging (create, update, delete)

### 🖥️ Professional Frontend UX
- ✅ Clean dashboard layout
- ✅ Loading states & skeletons
- ✅ Toast notifications (success/error)
- ✅ Form validation messages
- ✅ Responsive design (mobile + desktop)
- ✅ Dark mode support (via next-themes)

### ⚠️ Error Handling
- ✅ Centralized error middleware
- ✅ Meaningful API error responses
- ✅ Frontend error boundaries
- ✅ User-friendly error messages

### 🤖 AI-Assisted Search
- ✅ Natural language search queries
- ✅ AI-generated query parsing
- ✅ Examples: "Show me cheap sweets under $10"
- ✅ Intelligent category detection
- ✅ Price range extraction from natural language

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Form Validation**: Zod + React Hook Form
- **Notifications**: Sonner

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm (pnpm recommended)
- Supabase account

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd sweet-shop-management
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional: redirect URL used during signup confirmation
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/
```

### 4. Set up Supabase database

1. Create a new Supabase project at https://supabase.com
2. Run the SQL scripts in order (files are located in the `scripts/` directory):
   - `scripts/001_create_tables.sql`
   - `scripts/002_seed_data.sql`
   - `scripts/003_fix_rls_policies.sql`
   - `scripts/004_complete_rls_fix.sql`
   - `scripts/005_add_sweet_images.sql`
   - `scripts/006_themed_sweet_names.sql`
   - `scripts/007_update_profiles_schema.sql`

### 5. Run the development server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
sweet-shop-management/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── client/            # Client-facing pages
│   └── dashboard/         # User dashboard
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and types
│   ├── supabase/          # Supabase client setup
│   └── utils/             # Utility functions
├── scripts/               # SQL migration scripts
└── public/                # Static assets
```

## 🧪 Testing

```bash
npm run test
# or
pnpm test
```

## 📝 API Endpoints

### Sweets
- `GET /api/sweets` - Get all available sweets
- `GET /api/sweets/search` - Search sweets with filters
- `POST /api/sweets` - Create sweet (Admin only)
- `PATCH /api/sweets/[id]` - Update sweet (Admin only)
- `DELETE /api/sweets/[id]` - Delete sweet (Admin only)
- `POST /api/sweets/[id]/restock` - Restock sweet (Admin only)

### Orders
- `GET /api/orders` - Get orders (user's own or all if admin)
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details
- `PATCH /api/orders/[id]` - Update order status

### Audit Logs
- `GET /api/audit-logs` - Get audit logs (Admin only)

### AI Search
- `POST /api/ai/search` - Natural language search

## 🤖 AI Usage Transparency

### My AI Usage

This project was developed with assistance from AI tools. Below is a transparent breakdown of AI usage:

#### Tools Used
- **Cursor AI** (Primary assistant)
- **GitHub Copilot** (Code suggestions)

#### What I Used AI For

1. **Code Generation & Structure**
   - Initial project scaffolding and file structure
   - Component templates and boilerplate code
   - API route implementations
   - Database schema design

2. **Problem Solving**
   - Debugging complex issues
   - Optimizing database queries
   - Implementing concurrency-safe inventory updates
   - Error handling patterns

3. **Code Review & Refactoring**
   - Code quality improvements
   - Performance optimizations
   - Best practices implementation

4. **Documentation**
   - Code comments
   - API documentation

#### What I Wrote Manually

1. **Business Logic**
   - Core application logic
   - Inventory management algorithms
   - Order processing workflows
   - Search and filter implementations

2. **Architecture Decisions**
   - Project structure
   - Database schema design
   - API endpoint design
   - Component organization

3. **Custom Features**
   - AI-assisted search implementation
   - Audit logging system
   - Error handling middleware
   - Concurrency-safe inventory updates

4. **Testing**
   - Test cases
   - Test data setup
   - Integration test scenarios


---

**Note**: This project demonstrates production-ready code with proper error handling, security measures, and scalable architecture.
