# CartWise — Bản giao code v79

## Tóm tắt các thay đổi lần này

Theo đúng 6 yêu cầu (5 điểm góp ý UI kèm ảnh chụp màn hình + yêu cầu bổ sung "xoá game đi"):

### 1. Bỏ ép xem "Sơ qua về CartWise" — chuyển thành hướng dẫn xem theo ý muốn

Trước đây thẻ giới thiệu "Sơ qua về Cartwise" **tự động hiện ngay lần đầu vào web**, chặn hết mọi thao tác khác cho tới khi bấm mũi tên tiếp tục. Giờ:

- Thẻ này **không còn tự hiện nữa**.
- Có thêm mục **"Hướng dẫn sử dụng"** trong menu 3 gạch (icon dấu hỏi) — người dùng tự bấm vào nếu muốn xem lại, không ai ép xem cả.
- Nội dung thẻ giữ nguyên y hệt bản cũ (không đổi chữ), chỉ đổi cách nó xuất hiện.

File chính: `src/App.jsx` (đổi state `introOpen` cố định thành `guideOpen` tắt/mở theo ý người dùng), `src/components/Navbar.jsx` (thêm dòng menu mới), `src/components/IntroPopup.jsx` (đổi nhãn nút đóng cho đúng ngữ cảnh "hướng dẫn" thay vì "cổng vào lần đầu").

### 2. Giỏ hàng so sánh — hiện icon huy hiệu số lượng ngay cạnh icon giỏ hàng

Trước đây số lượng sản phẩm trong giỏ hiện dưới dạng chữ số nhỏ trong ngoặc, rất dễ bị lướt qua không để ý. Giờ đổi thành **1 huy hiệu tròn đỏ đè lên góc icon giỏ hàng**, giống hệt kiểu huy hiệu số ở nút chuông thông báo — nhìn phát biết ngay trong giỏ đang có bao nhiêu sản phẩm, không hiện khi giỏ trống.

File chính: `src/components/Navbar.jsx`, `src/styles.css` (tìm `menu-row-icon-badge-v79`).

### 3. Trang "Nâng cấp ứng dụng" — cập nhật đúng tính năng mới đã gắn theo từng gói

Trang này trước đó vẫn hiện đúng bản danh sách tính năng **cũ**, chưa cập nhật theo 6 tính năng mới đã gắn vào từng gói từ bản v63 (theo báo cáo cải tiến MVP). Giờ đã sửa lại đúng theo dữ liệu **đang thật sự chạy trong code** (`src/data/plans.js`), không bịa thêm số liệu nào:

- **CartWise Plus Student (19.000đ/tháng):** lịch sử kiểm tra giá tới 90 ngày + thống kê mua sắm 30 ngày, cảnh báo giảm giá, Nhóm Góp Tiền không giới hạn số nhóm/tháng, bộ đếm tiết kiệm nổi bật (tối đa 2 huy hiệu), ưu tiên tính năng mới.
- **CartWise Plus (49.000đ/tháng):** lịch sử kiểm tra giá tới 180 ngày + thống kê mua sắm nâng cao tới 1 năm, cảnh báo thông minh, **Cawi Tín Hiệu Mua** (khuyến nghị "Mua ngay"/"Nên chờ" theo lịch sử giá 180 ngày), **Cawi Cố Vấn Chi Tiêu** (hỏi Cawi trước khi mua, dựa trên lịch sử chi tiêu thật), Nhóm Góp Tiền + bộ đếm tiết kiệm không giới hạn, không quảng cáo.

Giá giữ nguyên 19.000đ / 49.000đ — đúng theo Business Plan, không đổi giá.

File chính: `src/pages/Upgrade.jsx`.

### 4. Mã QR thanh toán — hiện dạng popup to, bao trùm toàn màn hình

Trước đây bấm xem mã QR (dù ở chế độ "chia đều" hay "ai góp nấy trả") sẽ hiện **thu nhỏ ngay trong khung nhóm**, khó nhìn khi cần đưa điện thoại ra quét. Giờ bấm vào sẽ mở ra **1 lớp popup phủ toàn màn hình**, mã QR hiện to rõ ràng ở giữa, có nút đóng (X) hoặc bấm ra ngoài vùng tối để đóng — không còn hiện thu gọn trong khung nhỏ nữa. Áp dụng cho cả 2 chế độ (mã QR chung khi chia đều, và mã QR riêng từng người khi ai góp nấy trả).

File chính: `src/pages/GroupCart.jsx`, `src/styles.css` (tìm `groupcart-qr-popup-backdrop-v79`).

### 5. Đổi tên "Tự nhập (giữ số tiền đã góp)" thành "Ai góp nấy trả"

Tên cũ "Tự nhập" dễ gây hiểu lầm là phải tự gõ số tiền — trong khi thực chất chế độ này **tự động tính đúng số mỗi người đã góp thực tế** (ví dụ: Lan mua mì 8k, Tuấn mua nước 10k → ai mua gì trả đúng số đó, không chia đều). Đã đổi tên hiển thị thành **"Ai góp nấy trả"** ở mọi nơi xuất hiện (nút chọn chế độ, đoạn giới thiệu, nhãn trạng thái) — không đổi tên biến/logic nội bộ để tránh rủi ro ảnh hưởng chức năng đang chạy tốt.

File chính: `src/pages/GroupCart.jsx`.

### 6. Bỏ hẳn phần game khỏi thanh nav

Theo yêu cầu bổ sung, đã gỡ mục game **"Thử Thách Săn Deal"** khỏi thanh điều hướng (và menu 3 gạch dùng chung danh sách). Thanh nav giờ còn **5 mục**: Trang chủ, Flash Sale, Ghép Đơn Cùng Bạn Bè, Thành tựu tiết kiệm, Về chúng tôi.

Đúng theo cách đã làm với các tính năng gỡ trước đây (trang Stores — v73, trang Cawi Đố Giá — v78): trang `DealHuntGame.jsx` (route `deal-hunt`) **vẫn còn nguyên trong code**, chỉ là không còn link dẫn tới nữa — dễ khôi phục lại sau nếu cần, không cần viết lại từ đầu.

File chính: `src/components/Navbar.jsx`.

## Đã kiểm tra kỹ trước khi giao

- Build production sạch từ thư mục cô lập hoàn toàn mới (`npm install` + `npm run build`), không lỗi.
- Kiểm thử tự động (Playwright) trên bản build thật:
  - Thẻ giới thiệu không còn tự hiện khi vào web lần đầu; mở đúng qua mục "Hướng dẫn sử dụng" trong menu; đóng lại đúng cách.
  - Thanh nav không còn "Thử Thách Săn Deal"; menu 3 gạch cũng vậy; không còn "Cawi Đố Giá".
  - Huy hiệu số lượng giỏ hàng: không hiện khi giỏ trống, hiện đúng số "1" sau khi thêm 1 sản phẩm.
  - Trang "Nâng cấp ứng dụng" hiện đúng đủ các tính năng mới theo từng gói (Cawi Tín Hiệu Mua, Cawi Cố Vấn Chi Tiêu, Nhóm Góp Tiền, Bộ đếm tiết kiệm...).
  - Mã QR thanh toán: mở đúng dạng popup phủ toàn màn hình cho cả chế độ "chia đều" (1 mã QR chung) và "ai góp nấy trả" (mã QR riêng từng người); đóng đúng qua nút X và qua bấm ra ngoài vùng tối; kiểm tra bằng toạ độ thật (`elementFromPoint`) xác nhận popup luôn nổi trên khung chi tiết nhóm, không bị che khuất.
  - Chữ "Ai góp nấy trả" hiện đúng ở mọi vị trí thay cho "Tự nhập" cũ.
- Kiểm tra không phát sinh lỗi console trong toàn bộ quá trình test.
- Kiểm tra CSS mã QR popup theo công thức `width: min(380px, 100%)` trong khung có padding 20px hai bên — đảm bảo không tràn ngang ở màn hình 390px (đã đo tay theo công thức, khớp với kiểm tra không tràn ngang trên trang chủ mobile).
- Kiểm tra lại toàn bộ luồng đăng nhập/đăng xuất, giỏ hàng, ghép đơn — không bị ảnh hưởng bởi các thay đổi trên.
