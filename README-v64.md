# CartWise MVP v64 — Gỡ Giỏ Hàng Tối Ưu, chỉnh QR nhóm góp tiền, dọn modal sản phẩm

Bản này chỉnh sửa trực tiếp trên nền v63, theo 4 yêu cầu cụ thể sau khi xem bản demo:

## 1. Bỏ tính năng "Giỏ Hàng Tối Ưu"
Gỡ hoàn toàn: `pages/OptimalCart.jsx`, `data/optimalCart.js`, mục menu, route trong `App.jsx`, cấu hình `optimalCart` trong `data/plans.js`, và toàn bộ CSS `.optimalcart-*`. Không còn tham chiếu nào trong code.

## 2. Nhóm Góp Tiền — sửa lại cách tạo mã QR
Trước đây mỗi lần "Chốt nhóm & yêu cầu thanh toán" đều tạo một mã QR riêng cho từng thành viên, kể cả khi chọn "Chia đều" (lúc đó ai cũng trả số tiền giống nhau nên nhiều mã QR giống hệt nhau là thừa). Đã sửa lại theo đúng logic:

- **Chia đều**: chỉ tạo **1 mã QR chung** cho cả nhóm — mọi người dùng chung mã này để trả đúng phần của mình.
- **Tự nhập**: mỗi người vẫn có **1 mã QR riêng** (vì số tiền khác nhau), nhưng mặc định chỉ hiện **tên + số tiền dạng thu gọn**; bấm vào tên mới hiện mã QR của đúng người đó. Trên chính ảnh mã QR có dán nhãn tên người ngay bên trong (không chỉ ở phần chữ bên dưới) để không bị lẫn khi nhiều mã hiển thị gần nhau lúc cả nhóm cùng thanh toán.

File chính: `pages/GroupCart.jsx` (logic chọn chế độ hiển thị QR), `components/PaymentQrMock.jsx` (thêm nhãn tên trong ảnh QR, thêm biến thể `shared` cho mã QR dùng chung).

## 3. Bỏ khối đánh giá màu trắng trong popup sản phẩm
Gỡ component `ReviewQuickPreview` (card "⭐ Gộp từ N đánh giá · N sàn" hiện dưới khối giá tốt nhất) khỏi `components/ProductModal.jsx`. Phần tổng hợp đánh giá chi tiết vẫn xem được qua nút "Xem đánh giá chi tiết" trong khối giá như cũ — chỉ bỏ bản xem nhanh hiện sẵn ngay trên màn hình so sánh.

## 4. Vị trí robot Cawi trong popup sản phẩm
Không thay đổi code định vị của Cawi (`components/CawiRobot.jsx` chế độ `modal`) — sau khi gỡ khối đánh giá ở mục 3, robot vẫn giữ đúng vị trí mặc định (góc trên bên phải khối giá) như trước, không bị đẩy lệch.

## Không thêm dependency mới
Vẫn chỉ dùng React + lucide-react + localStorage, không cần biến môi trường mới.
