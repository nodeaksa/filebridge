# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.6] - 2026-11-20

### Changed
- Memperbarui logo utama dan favicon aplikasi **FileBridge.** dengan ilustrasi maskot kucing transfer lintas perangkat (*desktop-to-mobile*). Logo baru disimpan sebagai `public/logo.jpeg` dan digunakan sebagai ikon tab browser (`app/icon.png`, `app/favicon.ico`).
- Mengganti indikator titik hijau pada header dengan gambar logo maskot berukuran `32×32px` agar branding lebih kuat.

### Added
- Menambahkan indikator versi `v1.1.6` sebagai badge minimalis monokrom (`bg-zinc-800/80 text-zinc-400`) di sebelah kanan teks brand `FileBridge.` pada header aplikasi.
- Memperbarui badge versi di `README.md` menjadi `v1.1.6`.
- Memperbarui `package.json` version ke `1.1.6`.

---

## [1.0.0] — 2024-11-20

### Added
- Initial release of **azurefile** — a minimal personal file locker built with Next.js 16 and Supabase Storage.
- Authentication via Supabase Auth (email/password). Supports plain username (auto-mapped to `@bridge.local`) or full email address.
- **Batch file upload** — select or drag-and-drop multiple files simultaneously; each file is stored as a separate object in Supabase Storage (`loker-file` bucket).
- Real-time upload progress counter (`n/total` feedback during parallel uploads).
- Per-file size validation (50 MB maximum per file).
- Unique filename collision prevention using timestamp + index + random salt prefix.
- Signed-URL download with 60-second expiry per file.
- One-click file deletion with optimistic UI update.
- Fully dark-themed UI with Tailwind CSS (zinc palette).
- Custom **azurefile** tab title and black-circle "A" favicon (SVG + ICO).
- `.env.example` documenting required Supabase environment variables.
- MIT License.

### Changed
- Replaced boilerplate `create-next-app` title and description with project branding.
- Replaced default Next.js favicon with a custom black-circle "A" logo (`app/icon.svg`, `app/favicon.ico`).

[1.0.0]: https://github.com/nodeaksa/filebridge/releases/tag/v1.0.0
