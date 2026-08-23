# CartWise v69 — Giỏ hàng kiểu app thật, icon Cawi Robo trên nav, làm rõ khối tiết kiệm, thêm "Thành tựu tiết kiệm"

Bản này gộp các yêu cầu chỉnh sửa sau khi xem demo v68. Không đổi gì về cách build/deploy (v68 đã ổn định) — toàn bộ thay đổi ở đây chỉ nằm trong `src/`.

## 1. Icon giỏ hàng — to hơn, bỏ nền, chân thực hơn

Icon giỏ hàng cạnh nút "Đăng nhập" trước đây bị đóng khung trong 1 khoanh tròn viền — giờ **bỏ hẳn nền/viền phía sau**, icon to hơn và tô màu cam thương hiệu (có đổ bóng nhẹ) để nhìn rõ và thật hơn, không còn cảm giác bị nhốt trong khung.

## 2. Bấm vào icon giỏ hàng — mở màn hình giỏ hàng kiểu app thật, có chế độ "Sửa"

Giỏ hàng giờ có thêm nút **"Sửa"** ở góc trên bên phải (giống các app mua sắm thật):

- Bấm "Sửa" → mỗi sản phẩm hiện thêm 1 ô tích chọn, có thể chọn nhiều sản phẩm cùng lúc.
- Thanh dưới cùng có **"Chọn tất cả"** và nút xoá: hiện "Xoá (N) đã chọn" nếu có chọn, hoặc **"Xoá hết giỏ hàng"** nếu chưa chọn gì.
- Dù xoá 1 sản phẩm (vuốt/nút thùng rác, giữ nguyên từ bản trước) hay xoá nhiều/xoá hết ở chế độ Sửa, **đều luôn hiện hộp xác nhận "Đồng ý xoá / Huỷ"** trước khi xoá thật — không xoá nhầm.

File chính: `src/components/CartPanel.jsx`, xử lý xoá nhiều/xoá hết ở `src/App.jsx`.

## 3. Icon Cawi Robo cố định trên thanh nav

Thêm 1 icon hình Cawi Robo (đúng mascot của CartWise) cố định trên thanh nav, cạnh icon giỏ hàng. Bấm vào là mở khung chat Cawi Robo ngay lập tức, dù lúc đó robot đang trôi nổi ở vị trí nào trên màn hình — không cần phải tự đi tìm và bấm đúng vào robot nữa.

File chính: `src/components/Navbar.jsx` (icon + gửi sự kiện `cawi-open-chat`), `src/components/CawiRobot.jsx` (lắng nghe sự kiện để mở chat).

## 4. Làm rõ khối "Số tiền đã tiết kiệm" ở trang chủ

Trước đây khối này bị lỗi hiển thị **2 lớp nền chồng lên nhau** (1 khung ngoài + 1 khung trong, nhìn như khung lồng khung) và liệt kê nguyên dãy huy hiệu đã đạt trông khá rối.

Giờ sửa lại đúng theo yêu cầu:
- Chỉ còn **1 lớp nền duy nhất**.
- Thứ tự từ trên xuống: **số tiền đã tiết kiệm** (to nhất, căn giữa, nổi bật nhất) → **thanh tiến trình** → **tên thành tựu hiện tại** (chỉ hiện đúng 1 cái — mốc mới nhất vừa đạt được, không liệt kê cả dãy như trước).
- Thêm liên kết "Xem bản đồ thành tựu" dẫn sang trang mới ở mục 5.

File chính: `src/components/SavingsCounter.jsx`, CSS trong `src/styles.css` (tìm `v69-centered`).

## 5. Trang mới: "Thành tựu tiết kiệm" (bản đồ cột mốc kiểu game)

Thêm mục **"Thành tựu tiết kiệm"** ngay cạnh "Ghép Đơn Cùng Bạn Bè" trên thanh nav. Trang này hiển thị:

- Tổng số tiền đã tiết kiệm + thanh tiến trình tổng thể tới mốc cao nhất.
- Bản đồ dọc gồm 5 mốc thành tựu (🌱 Bước đầu tiết kiệm → 💡 Tiết kiệm thông thái → 🎯 Săn giá cừ khôi → 🏆 Bậc thầy so sánh giá → 👑 Huyền thoại tiết kiệm), mỗi mốc là 1 điểm trên đường đi:
  - **Đã đạt**: tô xanh, có dấu tích.
  - **Đang hướng tới**: tô cam, có hiệu ứng nhấp nháy nhẹ (pulse) + thanh tiến trình riêng cho đúng mốc đó.
  - **Sắp tới**: mờ, có icon ổ khoá, hiện rõ số tiền cần đạt.

File chính: `src/pages/SavingsAchievements.jsx` (trang mới), mốc dữ liệu lấy từ `SAVINGS_MILESTONES` có sẵn trong `src/data/purchases.js`.

## Kiểm thử đã chạy

Build sạch không lỗi (`npm run build`, cài mới hoàn toàn trong thư mục cô lập). Chạy bộ kiểm thử Playwright riêng cho bản này (20 assertion): icon nav mới hiện đúng, bấm icon Cawi Robo mở đúng khung chat, bấm icon giỏ hàng mở đúng màn hình giỏ hàng toàn màn hình, chế độ "Sửa" hiện đúng ô tích chọn, chọn 1 sản phẩm rồi xoá có hộp xác nhận và xoá đúng sản phẩm, "Xoá hết giỏ hàng" xoá sạch và hiện đúng trạng thái rỗng, trang "Thành tựu tiết kiệm" hiện đủ 5 mốc với đúng trạng thái đã đạt/đang hướng tới/khoá, khối tiết kiệm ở trang chủ chỉ còn 1 lớp nền và chỉ hiện 1 tên thành tựu. Toàn bộ pass.
