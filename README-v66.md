# CartWise MVP v66 — Thêm tên người trả ngay trên đầu ảnh mã QR (Ghép Đơn Cùng Bạn Bè)

Bản này chỉnh trên nền v65, theo đúng 1 yêu cầu: ở chế độ **"Tự nhập"** của Ghép Đơn Cùng Bạn Bè, khi thành viên trả số tiền khác nhau (ví dụ Ngân trả 100k, Cường chỉ trả 50k), tên người cần chuyển giờ hiện **ngay trong ảnh mã QR**, ở dòng phía trên ô mã QR (ngay dưới phần logo/badge VietQR), chứ không chỉ ở dưới cùng ảnh như trước.

## Đã đổi gì

`src/components/PaymentQr.jsx`: thêm 1 nhãn tên thứ 2 (`.payment-qr-name-tag-top-v66`), đặt ở khoảng trắng giữa phần logo VietQR và ô mã QR của ảnh (`top: 15%` tính theo chiều cao ảnh). Nhãn cũ ở cạnh dưới ảnh (`.payment-qr-name-tag-v64`) **vẫn giữ nguyên**, không xoá — nên tên người nhận giờ hiện 2 lần trên cùng 1 ảnh: 1 lần ngay trên đầu (dễ thấy khi ảnh bị thu nhỏ/xem lướt trong nhóm chat), 1 lần dưới cùng như cũ.

Nhãn mới dùng màu cam thương hiệu (khác màu đen của nhãn cũ) để nổi bật trên nền trắng của phần logo VietQR.

## Vì sao làm vậy — và một lưu ý kỹ thuật cần biết trước ngày thi

Ảnh mã QR (`img.vietqr.io`) là ảnh do **chính VietQR tạo và trả về từ server của họ** — CartWise không tạo ra ảnh đó, chỉ nhúng `<img>` trỏ tới link VietQR. Vì vậy CartWise **không thể chỉnh sửa pixel bên trong ảnh gốc** (không thể "in" chữ thật vào file ảnh PNG đó).

Cách đang làm: nhãn tên là 1 lớp giao diện (chữ + nền màu cam) **đè lên phía trên ảnh QR** bằng CSS, không phải chữ nằm sẵn trong file ảnh. Ưu điểm/nhược điểm:

- **Xem trực tiếp trên web CartWise, hoặc chụp màn hình (screenshot) cả khung mã QR** → nhãn tên hiện đầy đủ, không có vấn đề gì. Đây là cách dùng phù hợp nhất với nhu cầu "gửi vào nhóm để mọi người biết chuyển vào mã nào".
- **Nếu ai đó bấm giữ/chuột phải vào đúng ảnh QR chọn "Lưu ảnh" (Save image)** → chỉ lưu được file ảnh gốc từ VietQR, **không có nhãn tên cam** (vì nhãn đó không nằm trong file ảnh, chỉ là lớp phủ trên web).

→ Nếu nhóm sẽ **chụp màn hình** cả khung QR rồi gửi vào nhóm chat (cách làm tự nhiên nhất, không cần thao tác gì thêm) thì cách hiện tại đã đáp ứng đúng yêu cầu. Nếu muốn người dùng **lưu đúng file ảnh QR** mà vẫn có tên bên trong, sẽ cần một cách làm khác (ghép chữ vào ảnh bằng `<canvas>` phía trình duyệt) — phức tạp hơn và có thể vướng giới hạn CORS khi tải ảnh từ tên miền khác (`img.vietqr.io`). Nếu cần hướng này, cứ báo để mình làm tiếp.

## Không đổi gì khác
Toàn bộ phần còn lại của v65 (mã QR thật theo chuẩn VietQR/NAPAS 247, form nhập ngân hàng, logic 1 mã QR chung khi chia đều đúng/nhiều mã khi lệch làm tròn hoặc tự nhập, ép hiển thị VND, đổi tên menu) giữ nguyên không đổi.

## Lưu ý khi kiểm tra
Vì môi trường chuẩn bị code này bị chặn mạng ra ngoài tới `img.vietqr.io`, mình không tự xem được ảnh QR thật hiển thị ra sao (ảnh bị lỗi "không tải được" khi mình tự kiểm tra bằng script). Vị trí `top: 15%` là ước lượng dựa trên tài liệu chính thức của VietQR (ảnh mẫu `compact2` cỡ 540×640, có phần logo/badge ở trên trước khi tới ô mã QR) — khi mở web thật, nhớ kiểm tra nhãn cam có nằm đúng trong khoảng trắng giữa logo VietQR và ô mã QR không. Nếu nó đè lên logo hoặc đè lên mép ô QR, chỉ cần báo lại (ví dụ "nhãn hơi cao quá" / "hơi thấp quá") là mình chỉnh lại con số `top` trong `src/styles.css` (class `.payment-qr-name-tag-top-v66`) ngay.
