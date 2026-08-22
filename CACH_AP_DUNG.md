# Cập nhật: QR chuyển khoản thật cho "Ghép Đơn Cùng Bạn Bè"

Đã sửa trực tiếp trên đúng bản code bạn vừa gửi (`CartWise_v63_VongChungKet_1.zip`), không phải bản viết lại từ đầu. Đã build thử (`npm run build`) và chạy thử toàn bộ luồng bằng trình duyệt thật (Playwright) trước khi gửi — xem mục "Đã tự kiểm tra" bên dưới.

## Cách áp dụng (bạn dùng GitHub)

1. Trong repo local, **xoá** file cũ:
   ```
   src/components/PaymentQrMock.jsx
   ```
2. **Copy đè** các file trong zip này vào đúng vị trí tương ứng trong repo (giữ nguyên đường dẫn `src/...`):
   - `src/utils/vietqr.js` — **file mới**
   - `src/components/PaymentQr.jsx` — **file mới** (thay cho `PaymentQrMock.jsx` đã xoá)
   - `src/components/Navbar.jsx` — **đè lên file cũ**
   - `src/pages/GroupCart.jsx` — **đè lên file cũ**
   - `src/styles.css` — **đè lên file cũ** (file rất dài, chỉ có 1 đoạn ~50 dòng liên quan tới QR/chốt nhóm là thay đổi — `git diff` sẽ cho thấy đúng đoạn đó)
3. Chạy `npm install` (không thêm package mới nào, chỉ để chắc chắn), rồi `npm run dev` để test thử, hoặc thẳng:
   ```
   git checkout -b feature/vietqr-that
   git add -A
   git commit -m "Doi QR mo phong sang QR VietQR that cho Ghep Don Cung Ban Be"
   git push origin feature/vietqr-that
   ```
   rồi tạo Pull Request / merge như bình thường.

## Đã thay đổi những gì

**Mã QR giờ là thật, không còn là ô vuông giả lập.** Khi trưởng nhóm bấm "Chốt nhóm & yêu cầu thanh toán", trước khi chọn chia đều/tự nhập, giờ sẽ có thêm 1 bước nhập **ngân hàng nhận tiền + số tài khoản + tên chủ tài khoản**. Ngân hàng chọn từ danh sách tải trực tiếp từ VietQR (65 ngân hàng, tải trực tiếp khi vào trang; nếu mạng lỗi thì tự dùng sẵn 15 ngân hàng phổ biến để không đứng demo). Sau khi chọn xong, mỗi thành viên có 1 mã QR ảnh thật (từ `img.vietqr.io`), quét được bằng app ngân hàng bất kỳ hỗ trợ VietQR — không riêng Techcombank.

**Đổi tên tính năng trong menu:** "Nhóm Góp Tiền" → "Ghép Đơn Cùng Bạn Bè", khớp với báo cáo cải tiến Vòng 4 (đã đổi ở `Navbar.jsx` và tiêu đề trang `GroupCart.jsx`).

**2 lỗi nhỏ tiện sửa luôn vì đụng đúng chỗ:**
- Chia đều trước đây làm tròn từng người riêng lẻ (`Math.round(total/n)` cho mỗi người) nên tổng cộng dồn có thể lệch vài đồng so với tổng thật. Giờ tính phần nguyên cho tất cả rồi dồn đúng phần dư vào người cuối — tổng luôn khớp 100%.
- Số tiền trong bảng chốt nhóm và trên QR trước đây hiển thị theo đơn vị tiền tệ đang chọn trong Cài đặt (`currency`, có thể là USD...). Nhưng giao dịch chuyển khoản ngân hàng thật luôn phải bằng VND — nếu app đang hiển thị USD mà số trên QR lại là VND thì rất dễ gây hiểu lầm lúc demo. Đã sửa để 2 chỗ này luôn hiển thị VND, bất kể đang để tiền tệ gì.

**Xử lý cho các nhóm đã "chốt" từ trước khi cập nhật này** (nếu bạn đã bấm thử tính năng cũ và có dữ liệu lưu trong trình duyệt): thay vì bị lỗi, app sẽ hiện thông báo "yêu cầu thanh toán này được tạo trước khi có mã QR thật — chốt lại nhóm để nhập tài khoản nhận tiền" kèm nút chốt lại.

## Đã tự kiểm tra trước khi gửi
- `npm run build`: build sạch, không lỗi.
- Playwright (trình duyệt thật): mở trang, đổi tên menu hiển thị đúng, nhập ngân hàng/số TK, bấm "Chia đều" → tạo đúng 3 mã QR với URL đúng ngân hàng/số tiền/tên; tổng chia đều 119.000đ cho 3 người ra đúng 39.666 + 39.666 + 39.668 (khớp tổng, không lệch đồng nào); đánh dấu 1 người đã thanh toán → cập nhật đúng 1/3; test riêng trường hợp đổi tiền tệ hiển thị sang USD thì bảng và QR vẫn hiện đúng VND; test riêng trường hợp có dữ liệu nhóm đã chốt từ bản cũ (không có thông tin ngân hàng) → hiện đúng thông báo cần chốt lại thay vì lỗi trắng trang.
- Ảnh QR thật (`img.vietqr.io`) chưa tự mắt thấy hiện lên trong môi trường mình chạy thử vì bị chặn mạng ra ngoài ở đây — bạn nhớ tự mở app thật và quét thử bằng app ngân hàng ít nhất 1 lần trước ngày thi.

## Lưu ý — chưa đụng tới (nằm ngoài phạm vi yêu cầu lần này)
Code bạn gửi vẫn còn tính năng **"Giỏ Hàng Tối Ưu"** trong menu (`Navbar.jsx` dòng gần "Ghép Đơn Cùng Bạn Bè"). Nhớ lại là bạn từng quyết định bỏ hẳn tính năng này khỏi báo cáo cải tiến Vòng 4 — nếu đúng vậy, bản code trên web hiện đang **không khớp** với báo cáo (giám khảo đối chiếu 2 bên rất dễ thấy). Mình chưa đụng vào phần này vì bạn chỉ yêu cầu cập nhật riêng tính năng QR — nếu muốn, nhắn mình 1 câu là mình gỡ luôn "Giỏ Hàng Tối Ưu" khỏi web cho khớp báo cáo.
