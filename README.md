This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Variables

Create a `.env.local` file in the root directory with the following environment variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/buildapi
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/buildapi

# JWT Secret (generate a random string for production)
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Paystack API Keys
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

**Important:**
- `MONGODB_URI` - MongoDB connection string. Use local MongoDB or MongoDB Atlas
- `JWT_SECRET` - Secret key for JWT token signing. Use a strong random string in production
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Used in the frontend (public key - safe to expose)
- `PAYSTACK_SECRET_KEY` - Used only in the backend API routes (secret key - never expose)
- Use test keys (`pk_test_...` and `sk_test_...`) for development
- Use live keys (`pk_live_...` and `sk_live_...`) for production
- Get Paystack keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer) under API Keys & Webhooks

### Database Setup

1. Make sure MongoDB is running locally, or have a MongoDB Atlas connection string ready.

2. Seed the database with initial data (pricing plans and industries):

```bash
npm run seed
```

This will create:
- Default pricing plans (Starter, Professional, Enterprise)
- Default industries (Banking, CRM, E-commerce, CMS)

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
