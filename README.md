# Next.js + MUI + Supabase Template

A modern Next.js application template with Material-UI components and Supabase integration for authentication and database functionality.

## Features

- **Next.js 15** with App Router
- **Material-UI (MUI)** for beautiful, responsive UI components
- **TypeScript** for type safety
- **Supabase** for authentication and database
- **Tailwind CSS** for utility-first styling
- **ESLint** for code quality

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (sign up at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd softlearner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md) to configure your Supabase project
   - Create a `.env.local` file with your Supabase credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Supabase Integration

This template includes a complete Supabase integration with:

- **Authentication**: Email/password sign up and sign in
- **User Management**: User profiles and session management
- **Database Utilities**: Helper functions for common database operations
- **File Storage**: Upload and manage files in Supabase Storage

For detailed setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Stripe Webhook (local)

Follow these steps to receive Stripe events locally and update order statuses via the webhook at `/api/webhooks/stripe`.

- **Prerequisites**
  - Stripe account and [Stripe CLI](https://stripe.com/docs/stripe-cli) installed
  - `.env.local` configured (see `helper-context-files/env.example`)

- **Required environment variables**
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET` (provided by Stripe CLI after listening)

- **Start dev server**
  ```bash
  npm run dev
  ```

- **Start Stripe CLI forwarding** (in a new terminal)
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```
  Copy the displayed "webhook signing secret" and set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`. Restart the dev server after updating envs.

- **Trigger test events (optional)**
  ```bash
  stripe trigger checkout.session.completed
  stripe trigger checkout.session.expired
  ```

- **Production**
  - Create a webhook endpoint in the Stripe Dashboard pointing to `https://<your-domain>/api/webhooks/stripe`
  - Use the production signing secret as `STRIPE_WEBHOOK_SECRET` in your production environment

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication routes
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── AuthForm.tsx       # Authentication form
│   ├── UserProfile.tsx    # User profile component
│   └── ThemeRegistry.tsx  # MUI theme provider
├── contexts/              # React contexts
│   └── SupabaseContext.tsx # Supabase authentication context
└── lib/                   # Utility libraries
    ├── supabase.ts        # Supabase client configuration
    └── database.ts        # Database utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Material-UI](https://mui.com/) - React UI library
- [Supabase](https://supabase.com/) - Backend as a Service
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
