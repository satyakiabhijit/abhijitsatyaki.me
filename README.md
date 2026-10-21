This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Admin Panel (`/admin`)

The admin panel manages role-specific resume PDFs. Resumes are stored in the
Neon PostgreSQL database, so they survive redeploys.

### One-time setup

Create the admin user (the password is salted + hashed with scrypt before it
is stored):

```bash
npm run setup-admin -- you@example.com "your-password"
```

The script also creates the required tables. The app creates/updates them
automatically on first use, so running it is optional.

### Roles

| Role           | Public URL        |
| -------------- | ----------------- |
| `frontend`     | `/resume/frontend`  |
| `backend`      | `/resume/backend`   |
| `fullstack`    | `/resume/fullstack` |
| `software-dev` | `/resume/software-dev` |

`/resume` serves whichever role is currently marked as the default. Add
`?download=1` to any of these to force a download instead of inline viewing.

### Behaviour

- Uploading a PDF for a role **replaces** that role's resume. Other roles are
  left untouched.
- Exactly one role can be the default at a time. Setting a new default
  un-defaults the previous one.
- Only PDFs are accepted (validated by the `%PDF-` magic number), capped at
  10 MB.

### Tests

```bash
npm run test-admin
```

Runs the API flow end-to-end against an in-memory database — no shared
resources are touched.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
