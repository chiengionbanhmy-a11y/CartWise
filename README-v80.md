# CartWise — Bản giao code v80

## Tóm tắt các thay đổi lần này

### 1. Đưa icon giỏ hàng + cụm đăng nhập/đăng ký ra lại thanh nav chính

Theo yêu cầu, 2 thứ trước đây chỉ nằm trong menu 3 gạch giờ hiện ngay trên thanh nav chính (desktop), sát cạnh nút chuông thông báo:

- **Icon giỏ hàng so sánh** — đứng **bên trái** nút chuông. Dùng chung kiểu hình tròn 48px + huy hiệu số đỏ y hệt nút chuông, bấm vào mở đúng khung giỏ hàng như trước.
- **Đăng nhập / Đăng ký** — đứng **bên phải** nút chuông. "Đăng nhập" vẫn được làm nổi bật (nền gradient cam) vì là hành động quan trọng nhất, "Đăng ký" ở dạng nút phụ đi kèm. Khi đã đăng nhập, khu vực này tự đổi thành 1 thẻ tài khoản nhỏ (avatar + tên) bấm vào để xem hồ sơ.

Vậy thứ tự trên thanh nav từ trái sang phải là: **Giỏ hàng → Chuông thông báo → Đăng nhập/Đăng ký (hoặc tài khoản) → Menu 3 gạch**.

**Về mobile (≤760px):** vẫn giữ nguyên cách truy cập qua menu 3 gạch như bản trước (không hiện 4 nút trên ở thanh trên cùng trên mobile), vì mobile trước đó đã có 1 quyết định responsive cố ý chỉ hiện đúng 1 nút menu 3 gạch để tránh chật chội màn hình nhỏ (đã áp dụng từ v73/v77). Dòng "Giỏ hàng so sánh" và khối đăng nhập/đăng ký trong menu 3 gạch vẫn được **giữ nguyên** để mobile không mất lối vào — trên desktop thì 2 mục này tự ẩn đi trong menu (vì đã có ở thanh nav rồi, tránh lặp lại thông tin 2 lần). Nếu muốn hiện cả trên mobile ở thanh trên cùng thay vì qua menu, nhắn mình chỉnh thêm nhé.

File chính: `src/components/Navbar.jsx`, `src/styles.css` (tìm `cart-nav-btn-v80`, `nav-auth-cluster-v80`).

### 2. Trang "Nâng cấp ứng dụng" — liệt kê rõ mốc lịch sử kiểm tra giá theo từng gói

Theo đúng số liệu bạn cho: **Miễn phí = 7 ngày**, **Plus Student = 1 tháng**, **CartWise Plus = 6 tháng và 1 năm**. Đã:

- Thêm 1 bảng so sánh nhỏ ngay trên 2 thẻ gói, hiện đủ cả 3 bậc trong 1 hàng để nhìn phát hiểu ngay (kể cả bậc Miễn phí, vốn trước đây không có mặt ở trang này).
- Sửa lại đúng câu chữ trong thẻ "CartWise Plus" (giờ ghi "Lịch sử kiểm tra giá 6 tháng và 1 năm") và thẻ "Plus Student" (giờ ghi "Lịch sử kiểm tra giá 1 tháng").
- Đổi luôn số liệu **gốc** đang chạy thật trong code (`src/data/plans.js`) — không chỉ sửa chữ hiển thị — để trang "Lịch sử kiểm tra giá" thật sự khoá/mở đúng như những gì trang Nâng cấp hứa hẹn, tránh tình trạng nói một đằng làm một nẻo khi giám khảo bấm thử thật.
- Trang "Lịch sử kiểm tra giá" (`CheckHistory.jsx`) đổi 4 mốc lọc từ `7 / 30 / 90 / 180 ngày` (cũ) sang `7 ngày / 1 tháng / 6 tháng / 1 năm` (mới) — bỏ hẳn mốc 90 ngày, thêm mới mốc 1 năm (365 ngày) cho gói Plus. Nhãn hiện theo đơn vị dễ hiểu (tháng/năm) thay vì luôn quy hết ra số ngày.

File chính: `src/pages/Upgrade.jsx`, `src/data/plans.js`, `src/pages/CheckHistory.jsx`, `src/styles.css` (tìm `upgrade-history-compare-v80`).

## Đã kiểm tra kỹ trước khi giao

- Build production sạch từ thư mục cô lập hoàn toàn mới, đúng từ chính file zip sắp giao.
- Kiểm thử tự động (Playwright):
  - Thứ tự đúng: giỏ hàng bên trái chuông, đăng nhập/đăng ký bên phải chuông, cả về vị trí DOM lẫn toạ độ hiển thị thật.
  - Bấm icon giỏ hàng ở thanh nav mở đúng khung giỏ hàng; bấm "Đăng nhập" mở đúng khung đăng nhập.
  - Trên mobile (390px): 2 cụm mới tự ẩn đúng như thiết kế, menu 3 gạch vẫn còn đủ "Giỏ hàng so sánh" và đăng nhập/đăng ký, không tràn ngang màn hình.
  - Trên desktop: dòng "Giỏ hàng so sánh" và khối đăng nhập/đăng ký trong menu 3 gạch tự ẩn đi (vì đã trùng với thanh nav), không lặp lại thông tin.
  - Trang Nâng cấp hiện đúng bảng so sánh 3 bậc (7 ngày / 1 tháng / 6 tháng & 1 năm) và đúng câu chữ trong 2 thẻ gói.
  - Trang Lịch sử kiểm tra giá hiện đúng 4 tab mới, gói Miễn phí chỉ mở khoá đúng tab "7 ngày", 3 tab còn lại khoá đúng với thông báo nâng cấp chính xác.
- Không phát sinh lỗi console trong toàn bộ quá trình test.
