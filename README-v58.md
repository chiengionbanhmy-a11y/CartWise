# CartWise MVP v58 — Mở rộng AI có kiểm soát + Ghép đơn Freeship

## Mục tiêu
Bản này thêm 2 tính năng mới cho Vòng 4, đúng theo cập nhật "trước – sau – vì sao" trong Kế hoạch kinh doanh:

1. **Tóm tắt đánh giá ưu/nhược bằng AI** — bài toán AI thứ 2 của CartWise (bên cạnh nhận diện sản phẩm trùng).
2. **Ghép đơn cùng bạn (Freeship)** — công cụ tăng trưởng/viral loop, gộp giỏ hàng để đạt ngưỡng miễn phí vận chuyển.

## 1. Tóm tắt đánh giá bằng AI

- Dữ liệu: `src/data/reviews.js` — review mẫu (đa nguồn: Shopee/Lazada/Tiki/cửa hàng offline) + tóm tắt ưu/nhược điểm cho **cả 12 sản phẩm** trong catalog.
- Component: `src/components/AIReviewSummary.jsx`.
- Vị trí hiển thị: **Phần 3** trong `ProductModal.jsx`, ngay dưới "Phần 2 — Tùy chỉnh theo tài khoản".

**Kiến trúc (đúng nguyên tắc kỷ luật AI của CartWise):** tóm tắt được xem như được AI tạo **1 lần** khi hệ thống thu thập đủ review cho một sản phẩm, sau đó lưu lại (cache) và tái sử dụng cho mọi lượt xem — không gọi AI lại mỗi lượt truy cập. Trong bản demo, "cache" này là dữ liệu tĩnh viết sẵn trong `reviews.js`: **không gọi API AI thật, không cần API key, không phát sinh chi phí** — giữ đúng triết lý "không phát sinh chi phí AI" mà bản v37 (Cawi Robo) đã đặt ra.

## 2. Ghép đơn cùng bạn (Freeship)

- Dữ liệu: `src/data/groupCarts.js` — ngưỡng freeship mẫu theo từng sàn (Shopee/Lazada/Tiki) + 3 giỏ chung mẫu có sẵn.
- Trang: `src/pages/GroupCart.jsx`, route `group-cart`.
- Truy cập: menu hamburger (góc phải Navbar) → **"Ghép đơn cùng bạn (Freeship)"**.

**Cơ chế demo không cần backend:**
- Tiến trình mỗi giỏ chung (thành viên đã tham gia) lưu trong `localStorage` của trình duyệt.
- Nút "Mời bạn bè tham gia" tạo link dạng `<domain>/?join=<mã nhóm>`.
- Khi link được mở (kể cả reload/trình duyệt khác), trang tự động **mô phỏng một người bạn vừa tham gia** với sản phẩm + số tiền ngẫu nhiên từ danh sách mẫu, cập nhật thanh tiến độ ngay lập tức — dùng để demo trực quan hiệu ứng viral trước BGK (ví dụ: mở link mời trên điện thoại trong lúc thuyết trình).
- Có thể tạo giỏ chung mới ngay trong giao diện (chọn sàn + sản phẩm), lưu lại trên trình duyệt.

> Đây là logic demo MVP. Việc ghép đơn thật sự đồng bộ giữa nhiều người dùng cần backend/tài khoản thật ở giai đoạn tiếp theo.

## Không thêm dependency mới
Cả 2 tính năng chỉ dùng React + lucide-react (đã có sẵn) + localStorage — không cài thêm package nào, không cần biến môi trường, build/deploy trên Vercel như bình thường.

## Ghim version cụ thể trong package.json (quan trọng)
Bản trước dùng `"latest"` cho toàn bộ dependency — mỗi lần cài đặt lại (kể cả trên máy Vercel) sẽ tự kéo bản mới nhất tại đúng thời điểm đó, dễ gây:
- **Kết quả không nhất quán** giữa máy các thành viên trong nhóm và máy Vercel.
- **Xung đột (merge conflict)** trên `package-lock.json` nếu nhiều người từng chạy `npm install` riêng trên máy mình rồi push cùng lúc — đây là nguyên nhân phổ biến khiến code mới không thực sự lên được GitHub dù đã push.

Bản v58 đã ghim cứng: `vite@8.2.2`, `react@19.2.8`, `react-dom@19.2.8`, `@vitejs/plugin-react@6.1.0`, `lucide-react@1.33.0` — và `package-lock.json` đi kèm được build/test lại từ đầu, đảm bảo `npm ci` (lệnh Vercel dùng khi thấy có lockfile) chạy sạch không lỗi.

**Nếu trước đó bạn từng gặp merge conflict trên `package-lock.json`:** hãy để nguyên bản mới này, và nhắc cả nhóm **không tự chạy `npm install` rồi tạo lockfile riêng nữa** — chỉ cần `npm install` bình thường để chạy local (không đổi version gì), không cần commit lại lockfile nếu không đổi dependency.
