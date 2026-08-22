# CartWise MVP v65 — Tích hợp mã QR VietQR thật cho "Ghép Đơn Cùng Bạn Bè"

Bản này gộp một bản vá riêng (do bạn tự chuẩn bị, đính kèm file `CartWise_capnhat_VietQR.zip`) vào code v64 — thay mã QR minh hoạ (hình vuông giả lập) bằng **mã QR chuyển khoản thật theo chuẩn VietQR liên ngân hàng (NAPAS 247)**.

## Đã đổi những gì

**Mã QR giờ là thật, quét được bằng app ngân hàng.** Khi trưởng nhóm bấm "Chốt nhóm & yêu cầu thanh toán", trước khi chọn chia đều/tự nhập, giờ có thêm bước nhập **ngân hàng nhận tiền + số tài khoản + tên chủ tài khoản**. Danh sách ngân hàng tải trực tiếp từ VietQR (API công khai, không cần key); nếu mạng lỗi thì tự dùng 15 ngân hàng phổ biến để không đứng demo. Ảnh QR tạo qua `img.vietqr.io`, không riêng ngân hàng nào.

File chính: `src/utils/vietqr.js` (tiện ích tạo URL QR + tải danh sách ngân hàng), `src/components/PaymentQr.jsx` (thay `PaymentQrMock.jsx` đã xoá).

**Đổi tên tính năng trong menu:** "Nhóm Góp Tiền" → "Ghép Đơn Cùng Bạn Bè", khớp đúng tên trong báo cáo cải tiến Vòng 4.

**Giữ lại cách hiển thị QR đã thống nhất trước đó, áp dụng cho cả 2 chế độ:**
- **Chia đều**, khi tổng chia hết đúng cho số thành viên (mọi người trả đúng cùng 1 số tiền) → chỉ 1 mã QR chung duy nhất.
- **Chia đều nhưng tổng không chia hết** (lệch vài đồng do làm tròn — người cuối nhận phần dư) **hoặc Tự nhập** → mỗi người 1 mã QR riêng, mặc định thu gọn chỉ hiện tên, bấm vào mới hiện mã QR của đúng người đó, tên được dán nhãn ngay trên ảnh QR để phân biệt.

**2 lỗi được sửa kèm theo:**
- Chia đều trước đây làm tròn từng người riêng lẻ nên tổng dồn có thể lệch vài đồng. Giờ tính phần nguyên chung rồi dồn đúng phần dư vào người cuối — tổng luôn khớp 100% với số tiền cả nhóm.
- Số tiền trong bảng chốt nhóm và trên QR giờ luôn hiển thị VND, bất kể đơn vị tiền tệ đang chọn trong Cài đặt (USD/khác) — vì chuyển khoản ngân hàng thật luôn phải là VND.

**Xử lý cho các nhóm đã "chốt" từ bản trước khi có QR thật:** thay vì lỗi, app hiện thông báo cần chốt lại nhóm để nhập tài khoản nhận tiền.

## Vẫn giữ nguyên từ v64
Đã bỏ Giỏ Hàng Tối Ưu, đã bỏ khối đánh giá trắng trong popup sản phẩm, robot Cawi vẫn ở vị trí mặc định — không có gì trong 3 mục này bị ảnh hưởng bởi bản vá QR này.

## Lưu ý khi deploy
`img.vietqr.io` và `api.vietqr.io` là dịch vụ công khai, không cần API key — nhưng cần mạng ra ngoài internet bình thường lúc chạy (không hoạt động nếu môi trường chặn mạng ra ngoài). Nhớ tự mở web thật và quét thử QR bằng app ngân hàng ít nhất 1 lần trước ngày thi.
