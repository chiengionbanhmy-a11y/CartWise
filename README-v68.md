# CartWise v68 — Sửa lỗi build trên Vercel (không đổi tính năng)

Bản này **không thêm/đổi tính năng nào** so với v67 — chỉ sửa lỗi khiến Vercel build thất bại (log lỗi: `aggregateBindingErrorsIntoJsError`, `unwrapBindingResult`, `Error: Command "npm run build" exited with 1`).

## Nguyên nhân

Bản v67 trở về trước dùng **Vite 8** — bản Vite rất mới đang chuyển sang dùng lõi bundler tên là **Rolldown** (viết bằng Rust, nạp qua 1 file nhị phân riêng theo từng hệ điều hành/kiến trúc máy). Đây là công nghệ còn khá mới (từ khi Vite 8 ra mắt), vẫn còn lỗi vặt chưa ổn định. Trên máy chuẩn bị code của mình thì build vẫn chạy được bình thường, nhưng máy build của Vercel dùng môi trường khác (kiến trúc/hệ điều hành khác) nên phần nạp file nhị phân đó bị lỗi, làm cả bước build gãy — không phải do sai code trong các tính năng của web.

## Đã sửa gì

- **Hạ `vite` từ bản 8 xuống bản 5 (bản ổn định lâu năm, không dùng Rolldown)** — dùng lại lõi bundler cũ (esbuild + Rollup) đã được hàng triệu dự án dùng qua nhiều năm, không có kiểu lỗi nạp file nhị phân như trên.
- Thêm lại gói `@vitejs/plugin-react` (bản ổn định, tương thích Vite 5) + file cấu hình `vite.config.js` (trước đây web chạy hoàn toàn theo mặc định, không có file cấu hình nào) — đây là cách cấu hình chuẩn cho mọi dự án Vite + React, giúp JSX biên dịch đúng và ổn định.
- Không đổi bất kỳ file nào trong `src/` — toàn bộ tính năng của v67 (QR ghép tên vào ảnh, quản lý nhóm ghép đơn, giỏ hàng so sánh, Cawi Robo mở rộng...) giữ nguyên y hệt.

## Đã kiểm tra

- `npm run build` sạch, không lỗi, không còn cảnh báo lạ.
- Build lại từ đầu trong thư mục cô lập (xoá sạch `node_modules`, cài lại từ đầu) — thành công.
- Chạy lại toàn bộ 30 bài kiểm thử Playwright đã dùng cho v67 (giỏ hàng, ghép đơn, QR, Cawi Robo...) trên bản build mới — tất cả đều pass, xác nhận không có tính năng nào bị ảnh hưởng bởi việc đổi công cụ build.

## Cần làm gì tiếp theo

Xoá project cũ trên Vercel (nếu cần) và **upload lại/deploy lại bằng file zip mới này** — cấu hình build trên Vercel giữ nguyên như trước (`npm run build`, thư mục output `dist`), không cần đổi gì thêm trên Vercel. Nếu vẫn còn lỗi sau khi deploy bản này, gửi lại toàn bộ đoạn log lỗi (kéo lên đầu log, chụp luôn cả dòng lỗi đầu tiên) để mình xem chính xác lỗi gì.
