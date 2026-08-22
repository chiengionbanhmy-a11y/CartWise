# CartWise MVP v67 — Nhiều tính năng mới: QR ghép tên vào ảnh, quản lý nhóm ghép đơn, giỏ hàng so sánh, Cawi Robo mở rộng

Bản này gộp một loạt yêu cầu lớn sau khi xem demo v66. Vì có nhiều thay đổi, README này chia theo từng mục để dễ dò lại.

## 1. Mã QR — ghép tên thẳng vào ảnh (không còn dòng chữ tên đứng riêng)

Trước đây (v66) tên người cần chuyển chỉ được **dán đè bằng CSS** lên ảnh QR — cách này để lại 1 dòng chữ tên tách rời, và nếu ai bấm "Lưu ảnh" thì tên không có trong file ảnh.

Giờ CartWise **ghép (burn-in) tên trực tiếp vào file ảnh QR bằng canvas** ngay trên trình duyệt (`src/utils/qrCompose.js`), ở đúng vị trí dưới logo VietQR, phía trên ô mã QR:

- Ảnh nhỏ hiển thị ngay trên trang **và** ảnh mở ra khi bấm vào (tab mới) giờ là **cùng một ảnh đã có tên trong đó** — không còn dòng chữ tên đứng tách riêng bên ngoài khung QR nữa.
- Nếu ai đó lưu ảnh về máy (chuột phải → Lưu ảnh), tên vẫn còn nguyên trong file, vì tên đã nằm trong pixel của ảnh, không phải lớp phủ CSS.

**Lưu ý kỹ thuật quan trọng:** việc ghép tên vào ảnh cần trình duyệt đọc lại được pixel của ảnh do server VietQR (`img.vietqr.io`) trả về — chỉ thực hiện được nếu VietQR gửi kèm header CORS cho phép. Nếu không (hoặc mạng lỗi), CartWise **tự động rơi về cách cũ**: vẫn hiện ảnh QR gốc bình thường + dán nhãn tên bằng CSS như trước, để tính năng QR luôn hoạt động được trong mọi trường hợp, không bao giờ "gãy". Trong môi trường chuẩn bị code của mình (bị chặn mạng ra `img.vietqr.io`) luôn rơi vào trường hợp dự phòng này nên mình chưa tự mắt kiểm tra được bản ghép tên thật — bạn mở web thật và thử ít nhất 1 mã QR xem tên có hiện đúng trong ảnh không nhé. Vị trí `top: 14.5%` (tính theo chiều cao ảnh) là ước lượng theo tài liệu VietQR (ảnh mẫu `compact2` cỡ 540×640) — nếu lệch, báo lại để chỉnh nhanh trong `src/utils/qrCompose.js`.

## 2. Ghép Đơn Cùng Bạn Bè — nhiều thay đổi

**Đổi lại cách chia tiền:** sau khi đã chốt nhóm theo "Chia đều" hoặc "Tự nhập", giờ có nút **"Đổi lại cách chia tiền"** ngay trong phần yêu cầu thanh toán — bấm vào (có xác nhận) để chốt lại từ đầu và chọn chế độ khác.

**Số lượng sản phẩm + tìm kiếm sản phẩm:** khi tạo giỏ chung, ô chọn sản phẩm giờ là **ô tìm kiếm** (gõ tên để lọc nhanh), có thêm ô **Số lượng**. Khi bấm vào ô tìm kiếm mà chưa gõ gì, hiện gợi ý **"Đã xem gần đây"** và **"Gợi ý cho bạn"** (dựa theo lịch sử xem sản phẩm — cùng nguồn dữ liệu với "Lịch sử kiểm tra giá" có sẵn).

**Nút "Xem nhóm" và "Chỉnh sửa" — tách hẳn khỏi thẻ nhóm thu gọn:**
- Thẻ nhóm ngoài danh sách giờ **không còn hiện phần chốt nhóm/QR nữa** — chỉ còn 2 nút "Xem nhóm" và "Chỉnh sửa".
- **Xem nhóm** mở thành 1 trang riêng phóng to (giống các trang khác của web), trong đó mới có đầy đủ danh sách thành viên + nút "Chốt nhóm & yêu cầu thanh toán" + mã QR.
- **Chỉnh sửa** mở màn hình quản lý sản phẩm: đổi số lượng (+/-), thêm sản phẩm mới vào nhóm (ai cũng làm được), và **xoá hẳn 1 thành viên** — mục này chỉ dành cho **chủ nhóm** (người tạo nhóm trên chính trình duyệt đó; nhóm mẫu có sẵn trong web không ai là "chủ" cả nên sẽ không thấy nút xoá thành viên, đúng theo yêu cầu).
- 2 trang này có tab chuyển qua lại ngay trên đầu, không cần quay lại danh sách rồi bấm lại.

**Xác thực số tài khoản + lưu tài khoản cho lần sau:** ô "Số tài khoản" giờ tự kiểm tra định dạng (6-19 chữ số), báo đỏ + yêu cầu nhập lại nếu sai. Có thêm ô tích "Lưu tài khoản này cho những lần chia tiền sau" — lần chốt nhóm kế tiếp (nhóm bất kỳ) sẽ tự điền lại ngân hàng/số tài khoản/tên chủ tài khoản đã lưu, có nút xoá tài khoản đã lưu.

**Lưu ý quan trọng đã ghi rõ trong web:** CartWise chỉ kiểm tra được *định dạng* số tài khoản, **không thể xác minh tài khoản có thật sự tồn tại hay không** — việc đó cần kết nối API riêng (có phí) của từng ngân hàng, ngoài khả năng của 1 web demo học sinh làm không cần backend. Mình đã ghi chú thẳng trong giao diện để không gây hiểu lầm với ban giám khảo.

**Giới hạn gói Free:** đổi từ 3 nhóm/tháng thành **2 nhóm/tháng**, và dòng thông báo giới hạn giờ tách thành 1 banner cam riêng, to và nổi bật hơn hẳn (không còn là 1 câu nhỏ lẫn trong đoạn mô tả demo). Banner này **tự động biến mất** với gói có tạo nhóm không giới hạn (Student/Plus) — phần này vốn đã đúng logic từ trước, giờ chỉ làm nó dễ thấy hơn.

## 3. Giỏ hàng so sánh (tính năng mới, tách riêng với Ghép Đơn Cùng Bạn Bè)

Thêm icon giỏ hàng cạnh nút "Đăng nhập" ở thanh trên cùng, có số đếm sản phẩm. Trong khung so sánh sản phẩm (bấm "So sánh tổng chi phí" từ trang chủ), giờ có nút **"Thêm vào giỏ hàng"**. Giỏ hàng mở dạng khung trượt từ bên phải, liệt kê sản phẩm đã thêm.

**Vuốt để xoá:** vuốt (hoặc kéo bằng chuột) 1 sản phẩm sang trái, hoặc bấm nút thùng rác — cả 2 cách đều **luôn hiện hộp thoại xác nhận "Đồng ý xoá / Huỷ"** trước khi xoá thật, đúng theo yêu cầu không xoá nhầm.

File chính: `src/data/cart.js`, `src/components/CartPanel.jsx`.

## 4. Cawi Robo — thêm câu hỏi cho các tính năng mới

Danh sách gợi ý mặc định giữ nguyên 5 câu quen thuộc, thêm nút **"Xem thêm"** để mở rộng thêm các câu hỏi mới (ghép đơn, tên trong QR, đổi cách chia tiền, giới hạn gói Free, giỏ hàng, lưu tài khoản, chỉnh sửa nhóm...) — tránh làm rối khung chat mặc định.

Với câu hỏi ngoài phạm vi hỗ trợ, Cawi Robo trả lời rõ: *"Câu này mình chưa hỗ trợ được — Cawi Robo hiện chỉ trả lời được các câu hỏi có sẵn..."* thay vì cố trả lời chung chung — đúng theo yêu cầu chỉ trả lời câu hỏi có sẵn.

## Kiểm thử đã chạy

`npm run build` sạch không lỗi; build lại từ đầu trong thư mục cô lập (fresh install) cũng thành công. Đã chạy bộ kiểm thử Playwright bao trùm: thêm/xoá giỏ hàng (kèm luồng vuốt-xác nhận), tạo nhóm kèm số lượng + tìm sản phẩm, thẻ nhóm không còn phần chốt nhóm, "Xem nhóm" hiện đúng phần thanh toán, xác thực số tài khoản sai/đúng định dạng, nút đổi lại cách chia tiền, tài khoản đã lưu tự điền lại, chỉnh sửa số lượng, thêm sản phẩm trong chế độ chỉnh sửa, nút xoá thành viên chỉ hiện với nhóm do chính trình duyệt tạo, danh sách câu hỏi Cawi Robo giới hạn + nút Xem thêm, và banner giới hạn gói Free hiện đúng số 2 và tự ẩn với gói không giới hạn.

## Việc cần tự kiểm tra thêm trên web thật trước ngày thi
Thử quét ít nhất 1 mã QR thật để xem tên có ghép đúng vào ảnh không (mục 1) — sandbox chuẩn bị code của mình không có mạng ra `img.vietqr.io` nên chưa tự mắt xác nhận được, dù cơ chế dự phòng đảm bảo tính năng vẫn chạy được kể cả khi việc ghép ảnh không thực hiện được.
