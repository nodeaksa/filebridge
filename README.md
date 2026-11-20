<div align="center">

<img src="./app/icon.svg" alt="azurefile logo" width="80" height="80"/>

# azurefile

**Your minimal, private file locker — upload, download, and manage files from anywhere.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Storage_%26_Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/Live_Demo-azurefile.vercel.app-blue?logo=vercel&logoColor=white)](https://azurefile.vercel.app)

[**→ Open Live Demo**](https://azurefile.vercel.app)

</div>

---

## About

**azurefile** is a lightweight personal file locker built on [Next.js](https://nextjs.org) and [Supabase](https://supabase.com). Log in once, then drag-and-drop or select multiple files to upload them to your private storage bucket. Download or delete them from any browser, any device.

No third-party tracking. No ads. Just your files.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | Email/password login via Supabase Auth. Supports plain username (auto-mapped to `@bridge.local`) or full email. |
| 📂 **Batch Upload** | Select or drag-and-drop multiple files at once — each stored as a separate object. |
| 📊 **Live Progress** | Real-time upload counter (`2/5 files…`) with per-file success/failure reporting. |
| ⬇️ **Signed Download** | Secure 60-second signed URLs — files are never publicly exposed. |
| 🗑️ **Delete** | One-click delete with instant optimistic UI update. |
| 🌑 **Dark UI** | Full dark theme, mobile-friendly, built with Tailwind CSS. |
| 🛡️ **50 MB Guard** | Per-file size validation before attempting any upload. |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **Backend / Storage** | [Supabase](https://supabase.com) — Auth + Storage |
| **Deployment** | [Vercel](https://vercel.com) |

### Project Structure

```
filebridge/
├── app/
│   ├── favicon.ico       # Custom black "A" favicon
│   ├── icon.svg          # SVG version of the logo
│   ├── globals.css       # Global Tailwind base styles
│   ├── layout.tsx        # Root layout & metadata
│   └── page.tsx          # Main app UI (login + locker)
├── lib/
│   └── supabase.ts       # Supabase client singleton
├── public/               # Static assets
├── .env.example          # Required environment variables (template)
├── CHANGELOG.md
└── LICENSE
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/nodeaksa/filebridge.git
cd filebridge
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```

> Find these at **Supabase Dashboard → Project Settings → API**.

### 3. Supabase Setup

1. **Create a Storage bucket** named `loker-file`.
2. Set the bucket to **private** (no public access).
3. Add a **Row Level Security (RLS) policy** on the bucket so only authenticated users can read/write.

> You can use the SQL Editor in Supabase to apply policies. Example:
> ```sql
> -- Allow authenticated users to upload
> CREATE POLICY "auth_upload" ON storage.objects FOR INSERT
>   TO authenticated WITH CHECK (bucket_id = 'loker-file');
>
> -- Allow authenticated users to read
> CREATE POLICY "auth_select" ON storage.objects FOR SELECT
>   TO authenticated USING (bucket_id = 'loker-file');
>
> -- Allow authenticated users to delete
> CREATE POLICY "auth_delete" ON storage.objects FOR DELETE
>   TO authenticated USING (bucket_id = 'loker-file');
> ```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 Preview

> _Add a screenshot of the app here._
> 
> ```bash
> # Take a screenshot and save it to:
> public/preview.png
> ```
> 
> Then replace this section with:
> ```md
> ![azurefile preview](./public/preview.png)
> ```

---

## 📄 License

Distributed under the [MIT License](./LICENSE). © 2024 nodeaksa.
