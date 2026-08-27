# CartWise — Bản giao code v83

## Bối cảnh lần này

Bạn gửi 2 file: bản "sửa lỗi so sánh" (`CartWise_v83_1_SuaLoiSoSanh.zip`) và bản `CartWise_v82_VongChungKet.zip` đã giao trước đó, yêu cầu ghép lại thành 1 bản đầy đủ. Sau khi so sánh kỹ 2 file, bản "sửa lỗi so sánh" hoá ra có 3 phần nội dung thật (không chỉ 1 lỗi), nhưng lại KHÔNG có toàn bộ 4 tính năng của v82 (Cố Vấn Chi Tiêu 5 câu hỏi, ẩn robot trong khung so sánh, đánh giá kèm ảnh/video, số tiền tiết kiệm cập nhật live). v83 là bản ghép đầy đủ cả 2 — không mất tính năng nào của bên nào.

## Những gì lấy từ bản "sửa lỗi so sánh" (mới, chưa từng có ở v82)

### 1. Giá & link mua hàng thật cho 4 sản phẩm

`mouse-logitech`, `powerbank-anker`, `sunscreen`, `lipstick` giờ dùng đúng link Shopee/Lazada/Tiki/CellphoneS/Pharmacity/... và giá đội đã tự kiểm tra ngày 26/08/2026, thay vì link tìm kiếm chung chung + giá ước tính như trước — đây có lẽ chính là "lỗi so sánh" cần sửa: so sánh giá dựa trên link/giá không xác thực. Một vài link được giữ nguyên dù khác biến thể/màu (có ghi chú rõ `accountStatus` từng dòng) — nên kiểm tra lại SKU nếu dùng số liệu này cho bản có dữ liệu thật.

File chính: `src/data/products.js` (khối `exactStoreSets`).

### 2. Tự động hỏi "Bạn đã mua chưa?" sau khi bấm "Mua tại đây"

Trước đây chỉ có cách tự khai thủ công (nút "Đã mua/Chưa mua" trong khung so sánh, từ v81). Giờ thêm 1 cách nữa: khi bấm "Mua tại đây" (mở sàn ở tab mới) rồi quay lại tab CartWise, CartWise tự hiện popup hỏi "Bạn đã mua sản phẩm này trên [sàn] chưa?" — chọn "Đã mua" mới thật sự ghi vào lịch sử mua hàng, không suy đoán chỉ vì đã bấm link. Cả 2 cách (thủ công + tự động sau khi quay lại tab) cùng tồn tại, không cách nào thay cách nào, và không bị ghi trùng nếu dùng cả 2.

File chính: `src/components/PurchaseConfirmationModal.jsx` (mới), `src/App.jsx`, `src/components/ProductModal.jsx`.

### 3. Ngân sách tháng tự khai (thay vì luôn dùng mức demo cố định)

Sau khi đăng nhập lần đầu (chưa khai ngân sách), CartWise hỏi "Bạn dự kiến chi bao nhiêu trong tháng này?" — chỉ lưu được 1 lần, sau đó còn đúng 1 lần chỉnh sửa duy nhất (chỉnh ở trang Hồ sơ, mục "Ngân sách chi tiêu tháng này"), tránh việc đổi qua đổi lại để "né" lời khuyên của Cawi. Ngân sách thật này giờ được Cố Vấn Chi Tiêu ưu tiên dùng (cả lời khuyên gốc theo ngân sách lẫn trục ngân sách trong Bộ 5 câu hỏi ở v82) — chỉ rơi về mức demo 1.500.000đ khi người dùng chưa khai.

**Quyết định thiết kế khi ghép:** khối ngân sách ở trang Hồ sơ hiển thị đúng số tiền tự khai "Đã mua" trong tháng dương lịch hiện tại (không tính dữ liệu demo dựng sẵn, để khớp đúng 100% với ngân sách thật vừa nhập). Nhưng phần "% ngân sách đã dùng" bên trong Cố Vấn Chi Tiêu vẫn tính theo cách cũ (gộp cả dữ liệu demo, cửa sổ 30 ngày gần nhất) để tính năng luôn có số liệu demo ngay cả khi người dùng chưa tự báo cáo đơn nào — tránh Cố Vấn Chi Tiêu "im lặng" (luôn báo 0%) khi mới vào app.

File chính: `src/components/BudgetSetupModal.jsx` (mới), `src/App.jsx`, `src/pages/Profile.jsx`, `src/data/purchases.js`.

## Việc của v82 vẫn giữ nguyên, không đổi

Cố Vấn Chi Tiêu — Bộ 5 câu hỏi, Cawi Robo ẩn trong khung so sánh, đánh giá 4-5/sản phẩm kèm ảnh/video minh hoạ, số tiền tiết kiệm cập nhật live — xem đầy đủ ở `README-v82.md`.

## Đã kiểm tra kỹ trước khi giao

- Build production sạch từ thư mục cô lập hoàn toàn mới, đúng từ chính file zip sắp giao.
- Kiểm thử tự động (Playwright, 16 kiểm tra) — toàn bộ pass, bao gồm cả kiểm tra hồi quy (regression) cho toàn bộ tính năng v82 lẫn tính năng mới ghép từ bản "sửa lỗi so sánh":
  - Không có tính năng nào của v82 bị mất sau khi ghép (robot ẩn trong modal, quiz 5 câu, đánh giá kèm media đều còn nguyên).
  - Link/giá thật cho 4 sản phẩm hiển thị đúng trong khung so sánh.
  - Popup thiết lập ngân sách hiện đúng sau khi đăng nhập lần đầu, lưu đúng, khoá sau khi dùng hết 1 lần chỉnh sửa; khối ngân sách ở Hồ sơ hiện đúng số đã lưu.
  - Bấm "Mua tại đây" rồi quay lại tab: popup xác nhận đã mua hiện đúng, chọn "Đã mua" ghi đúng vào lịch sử mua hàng.
- Kiểm tra thêm bằng ảnh chụp màn hình: khối ngân sách ở Hồ sơ, popup xác nhận mua hàng — giao diện khớp đúng phong cách chung của app (đã bỏ 1 chi tiết lệch tông trong CSS gốc của bản "sửa lỗi so sánh": font chữ Times New Roman trên 2 popup mới, không khớp font Inter/sans-serif toàn bộ phần còn lại — đã đổi về font mặc định cho đồng bộ).
