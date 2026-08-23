# CartWise v70 — Bỏ ảnh mascot xấu ở icon Cawi Robo trên nav

Sửa nhanh sau phản hồi demo v69: icon Cawi Robo mới thêm trên thanh nav (cạnh icon giỏ hàng) dùng ảnh PNG mascot, nhưng khi lên web thật bị hiện quá to kèm khung nền xám xấu, không đúng như thiết kế ban đầu.

## Đã sửa gì

- Bỏ hẳn ảnh PNG (`/robot-cawi-v4.png`) khỏi icon này.
- Thay bằng icon vẽ sẵn (SVG, không phải ảnh) — cùng kiểu và cùng cỡ với các icon khác trên thanh nav (chuông thông báo, menu...), luôn đúng kích thước, không bao giờ bị vỡ layout hay lộ nền xấu như ảnh PNG.
- Chức năng giữ nguyên: bấm vào icon vẫn mở khung chat Cawi Robo ngay lập tức.

File chính: `src/components/Navbar.jsx`, `src/styles.css` (tìm `cawi-nav-btn-v69`).

## Đã kiểm tra

Build sạch, cài mới hoàn toàn trong thư mục cô lập, build lại trực tiếp từ đúng file zip giao — đều thành công. Chạy lại bộ kiểm thử Playwright cho các tính năng v69 (20 assertion) — tất cả đều pass, xác nhận việc đổi icon không ảnh hưởng gì tới các tính năng khác.

## Lưu ý quan trọng về việc đưa code lên GitHub

Ở 2 vòng vừa rồi, lỗi build trên Vercel lặp lại nhiều lần vì **file hoàn toàn mới bị thiếu khi bạn upload lên GitHub** (file sửa trên file cũ thì luôn lên đủ, chỉ file mới tinh hay bị sót). Với bản v70 này không có file mới nào cả (chỉ sửa file có sẵn), nên nhiều khả năng sẽ không gặp lại kiểu lỗi đó. Nhưng để chắc chắn cho các bản sau, gợi ý: dùng GitHub Desktop (tự liệt kê mọi file mới/đã đổi trước khi commit) hoặc xoá hết rồi kéo thả lại nguyên cả thư mục một lần, thay vì chọn từng file lẻ.
