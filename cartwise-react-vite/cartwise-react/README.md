# CartWise v13 - Navy Chat + Cawi Robo cũ (Vercel fixed)

Bản này đã được làm sạch để deploy lên Vercel:

- Không kèm `node_modules`.
- Không kèm `dist`.
- Không kèm `package-lock.json` cũ để tránh lỗi registry khi `npm install` trên Vercel.
- Có `.npmrc` ép dùng registry public của npm.
- Có `vercel.json` đặt sẵn cấu hình deploy.

## Deploy Vercel

Upload toàn bộ thư mục đã giải nén, không upload file zip trực tiếp.

Cấu hình nếu Vercel hỏi:

- Framework Preset: Vite
- Install Command: npm install
- Build Command: npm run build
- Output Directory: dist

## Chạy local

```bash
npm install
npm run dev
```
