# 📘 Logo Canvas

## 🧭 Table of Contents

1. [Project Description](#project-description)
2. [Technologies and Libraries](#technologies-and-libraries)
3. [System Requirements](#system-requirements)
4. [Installation and Setup](#installation-and-setup)
5. [Project Structure](#project-structure)
6. [Database and Prisma](#database-and-prisma)
7. [Seeding Data](#seeding-data)
8. [Features](#features)
9. [Logo Handling](#logo-handling)
10. [Responsive Interface and UX](#responsive-interface-and-ux)
11. [TODO / Roadmap](#todo--roadmap)

## 📝 Project Description

**Logo Canvas** is an advanced web application for comprehensive client and industry management, as well as for generating custom logo sets. Users can create, edit, and filter clients and industries, then select the logos they need and arrange them interactively on a canvas.

**Key features include:**

- Full client and industry management: Complete CRUD for both clients and industries.
- Advanced filtering and searching: Filter clients by name or industry; infinite scroll ensures a smooth experience even with large datasets.
- Bulk actions: Select multiple clients and generate a logo set from chosen companies.

**Powerful canvas generator:**

- Drag, resize, and arrange selected logos freely.
- Group logos by industry or distribute them randomly across the canvas.
- Change the background color of the canvas and individual logos (white/black).
- Export the final composition to a PNG file with a single click.
- Save and restore the canvas layout and configuration between sessions.

**Modern frontend:**

- Responsive UI built with Next.js 15, React 19, and TailwindCSS 4
- Combines SSR and CSR for fast, fluid interactions
- Clean component architecture and efficient global state management (Zustand).

This project is ideal as an internal tool for design or marketing agencies, or as a showcase of real-world **Fullstack/Frontend development skills.**

## ⚙️ Technologies and Libraries

- **Next.js** 15+
- **React** 19
- **TypeScript**
- **TailwindCSS** 4
- **Prisma** (ORM + PostgreSQL)
- **ts-node** (for seeding)
- **html-to-image** (image generation)
- **lodash.debounce** (search input optimization)
- **react-rnd** (resizing and positioning logos)
- **lucide-react** (icon library)
- **framer-motion** (animations)
- **zustand** (global state for checkbox selection)

## 💻 System Requirements

- Node.js `>=18.x` (20+ recommended)
- PostgreSQL (local or remote)
- pnpm / npm / yarn
- Command line interface (bash, zsh, etc.)

## 🚀 Installation and Setup

```bash
git clone https://github.com/your-username/logo-generator.git
cd logo-generator
npm install
# or use yarn / pnpm instead
```

Configure your `.env` file:  
Before running the project, copy `.env.example` to `.env` and fill in your database credentials.

```bash
cp .env.example .env
```

Then edit the `.env` file and set your database URL:

```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/logo_generator
```

Create the database and run the initial migration:

```bash
npx prisma migrate dev --name init
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 📁 Project Structure

```
.
├── prisma/
│ ├── migrations/
│ ├── schema.prisma
│ └── seed.ts
├── public/
│ └── Tux_Default.png
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── auth/
│ │ │ ├── clients/
│ │ │ └── industries/
│ │ ├── clients/
│ │ │ ├── [id]/
│ │ │ │ ├── edit/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── page.tsx
│ │ │ ├── new/
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │ └── page.tsx
│ │ ├── generate/
│ │ ├── industries/
│ │ ├── AppProviders.tsx
│ │ ├── favicon.ico
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ └── page.tsx
│ ├── components/
│ │ ├── ui/
│ │ ├── ClientCard.tsx
│ │ ├── ClientList.tsx
│ │ └── ...
│ ├── context/
│ ├── hooks/
│ ├── store/
│ ├── utils/
│ ├── lib/
│ │ └── db.ts
│ └── middleware.ts
├── types/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── components.json
```

## 🗃️ Database and Prisma

```prisma

model Industry {
  id      Int      @id @default(autoincrement())
  name    String   @unique
  clients Client[]
}

model Client {
  id         Int      @id @default(autoincrement())
  name       String
  address    String?
  logoBlob   Bytes?
  logoType   String?
  createdAt  DateTime @default(now())
  industry   Industry? @relation(fields: [industryId], references: [id])
  industryId Int?
}

```

**Client belongs to one Industry.**

## 🌱 Seeding Data

```bash
npm run seed
```

The default logo file (`Tux_Default.png`) is automatically assigned to each client.

## 🔍 Features

- Customer CRUD
- CRUD Industries
- Infinite scroll (IntersectionObserver)
- Filtering by name and industry
- SSR and CSR logically linked (e.g., list of industries with SSR)
- Select multiple customers and redirect to generate selected logos on canvas
- Adding and deleting privileged logos on canvas via modal
- Option to display logos on canvas in groups according to industries or mixing
- Storing of logo layout and status on canvas
- Manipulate the size of each logo, its background and canvas background

## 🖼️ Logo Handling

Each logo is stored in the database as a `logoBlob` (`Bytes`) and `logoType`.
If no file is uploaded, a default PNG is assigned by the backend.
In the frontend, logos are decoded into `data:image/png;base64,...` .

## 📱 Responsive Interface and UX

- Components optimized for Tailwind scaling
- Smooth UX with debounced inputs and no reloads

## 📦 Installed Packages

List of key dependencies:

- `next`, `react`, `typescript`
- `prisma`, `@prisma/client`, `ts-node`
- `tailwindcss`, `postcss`
- `html-to-image`, `react-rnd`, `lodash.debounce`
- `lucide-react`, `framer-motion`
- `zustand` – lightweight global state (used to persist checkbox selection)

(See `package.json` for full details)

## 🧩 TODO / Roadmap

- [ ] Import from CSV / Excel
- [ ] Export logos as ZIP
- [ ] Cloud storage integration (e.g., Supabase)
