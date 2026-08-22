import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// v68 — Cấu hình Vite tường minh (trước đây chạy hoàn toàn theo mặc định, không có
// file này). Thêm @vitejs/plugin-react để đảm bảo JSX được biên dịch đúng theo
// "automatic runtime" của React 19 (không cần `import React` thủ công trong từng
// file) — đây là cách cấu hình chuẩn, ổn định nhất cho Vite + React, tránh phụ
// thuộc vào hành vi mặc định có thể khác nhau giữa các phiên bản Vite.
export default defineConfig({
  plugins: [react()]
});
