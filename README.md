# Common Time E-commerce

Premium coffee brand merchandise ordering system — "designed for the moments between."

## Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS, React Router
- **Backend**: Supabase (Auth, PostgreSQL, Edge Functions)
- **Payments**: Razorpay
- **State**: Context API, localStorage (cart)

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 3. Supabase project

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations:

```bash
# Link project (first time)
npx supabase link --project-ref your-project-ref

# Push schema and seed
npx supabase db push
```

Or run the SQL files manually in Supabase SQL Editor:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_seed_products.sql`

### 4. Edge Functions

Deploy the Edge Functions and set Razorpay secrets:

```bash
npx supabase functions deploy create-order
npx supabase functions deploy verify-payment

npx supabase secrets set RAZORPAY_KEY_ID=rzp_xxx RAZORPAY_KEY_SECRET=your_secret
```

**Optional Edge Function secret:** `DEV_MODE` — when set to `true`, checkout skips Razorpay and marks orders as paid. Use only for local or test environments. See [Dev Mode (No Razorpay)](#dev-mode-no-razorpay) below.

### 5. Razorpay

1. Create an account at [razorpay.com](https://razorpay.com)
2. Get API keys from Dashboard → Settings → API Keys
3. Use Test keys for development

### Dev Mode (No Razorpay)

To run checkout without Razorpay (for testing without a Razorpay account):

```bash
npx supabase secrets set DEV_MODE=true
npx supabase functions deploy create-order
```

With `DEV_MODE=true`, the create-order Edge Function will:
- Skip Razorpay payment flow
- Create the order and mark it as paid
- Decrement product stock
- Return success so the frontend completes checkout

**Use only for local or test environments.** Do not enable in production.

When Razorpay keys are missing and `DEV_MODE` is not set, users see: *"Payment not configured. Set up Razorpay or enable dev mode to test checkout."*

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

### Frontend (Vercel)

1. Connect the repo to Vercel
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
3. Build command: `npm run build`
4. Output directory: `dist`

### Supabase

- Migrations: run via Supabase Dashboard or `supabase db push`
- Edge Functions: `supabase functions deploy create-order` and `supabase functions deploy verify-payment`
- Secrets: `supabase secrets set RAZORPAY_KEY_ID=... RAZORPAY_KEY_SECRET=...`
- Optional: `supabase secrets set DEV_MODE=true` for testing without Razorpay

## Routes

| Route        | Description          | Auth  |
|-------------|----------------------|-------|
| `/`         | Home                 | No    |
| `/shop`     | Product grid         | No    |
| `/shop/:id` | Product detail       | No    |
| `/cart`     | Cart                 | No    |
| `/checkout` | Checkout + Razorpay  | Yes   |
| `/orders`   | Order history        | Yes   |
| `/login`    | Sign in              | No    |
| `/signup`   | Create account       | No    |

## Security

- Cart validated server-side; never trust frontend prices
- Stock checked and decremented only after verified payment
- RLS policies enforce user isolation for orders
- Razorpay secret only in Edge Functions (env), never in frontend
