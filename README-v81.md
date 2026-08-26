# CartWise — Bản giao code v81

## Tóm tắt các thay đổi lần này

### 1. Nút tự khai "Đã mua / Chưa mua"

Ở khung so sánh sản phẩm (ngay dưới nút "Thêm vào giỏ hàng"), giờ có thêm 1 khối chọn nhanh gồm 2 lựa chọn: **Đã mua** / **Chưa mua**. Khi bấm "Đã mua", CartWise ghi 1 bản ghi mới vào lịch sử mua hàng demo (dùng đúng mức giá tốt nhất đang hiển thị của sản phẩm đó) — nhờ vậy "Thành tựu tiết kiệm" và bộ đếm "Tổng đã tiết kiệm" sẽ **thật sự nhúc nhích** thay vì luôn đứng yên ở 7 đơn hàng demo cố định như trước. Bấm lại "Chưa mua" sẽ gỡ bản ghi đó ra.

Trang "Thành tựu tiết kiệm" cũng được bổ sung dòng minh bạch dữ liệu, nói rõ đây là demo + tự khai, bản chính thức cần liên kết tài khoản mua sắm/API đối tác để ghi nhận đơn hàng thật tự động.

File chính: `src/components/ProductModal.jsx`, `src/data/purchases.js`, `src/pages/SavingsAchievements.jsx`.

### 2. Giao diện đăng nhập / đăng ký

Làm mới toàn bộ khối bên trái (thay ảnh + 1 câu mô tả chung chung bằng logo nhỏ gọn hơn + 3 gạch đầu dòng nêu đúng giá trị thật của CartWise). Icon "Số điện thoại" đổi từ ký tự ☎ sang icon điện thoại hiện đại (lucide `Phone`). 2 nút "Đăng nhập / Đăng ký" ở đầu form giờ **bấm chuyển được thật** giữa 2 chế độ ngay trong popup (trước đây chỉ là trang trí, không có chức năng).

File chính: `src/components/LoginModal.jsx`, `src/App.jsx`.

### 3. Lưu tài khoản ngân hàng: chuyển thành popup hỏi ngay sau khi chốt nhóm

Trước đây có 1 ô tick "Lưu tài khoản này..." nằm sẵn trong form. Giờ đổi đúng theo yêu cầu: sau khi nhập xong tài khoản nhận tiền và bấm chọn cách chia tiền ("Chia đều" / "Ai góp nấy trả"), CartWise **chốt nhóm luôn**, rồi ngay lập tức hiện 1 popup hỏi "Lưu tài khoản này cho lần sau?" với 2 lựa chọn **Có / Không**.

- Tính năng lưu chỉ hoạt động khi đã **đăng nhập** — chưa đăng nhập thì chốt nhóm bình thường, không hỏi lưu, và trong form có sẵn nút "Đăng nhập" ngay tại chỗ.
- Nếu chọn "Có, lưu lại": trang **Hồ sơ** giờ hiện đầy đủ tên ngân hàng, số tài khoản, tên chủ tài khoản đã lưu, kèm nút **"Xoá tài khoản"** ngay tại đó để xoá khi cần (không cần quay lại Ghép Đơn Cùng Bạn Bè để xoá như trước).

File chính: `src/pages/GroupCart.jsx`, `src/pages/Profile.jsx`, `src/data/savedAccount.js` (mới — tách chung 3 hàm đọc/lưu/xoá tài khoản để 2 trang trên dùng chung).

### 4. Nút "Thử so sánh ngay" nổi bật hơn

To hơn, thêm icon kính lúp, bo tròn hoàn toàn, có bóng đổ màu cam ánh sáng để nổi bật hẳn so với nút phụ "Xem Flash Sale hôm nay" bên cạnh.

File chính: `src/pages/Home.jsx`.

### 5. Thêm Footer cuối trang

Cuối mọi trang giờ có 1 khối chân trang tối màu gồm: logo + tên CartWise + mô tả ngắn, các link điều hướng nhanh (Trang chủ, Flash Sale, Ghép Đơn Cùng Bạn Bè, Thành tựu tiết kiệm, Giới thiệu & Đội ngũ, Nâng cấp ứng dụng), thông tin liên hệ (tên leader) và dòng minh bạch "dự án học sinh THPT... dữ liệu minh hoạ, chưa xử lý thanh toán hay đơn hàng thật". Chỉ hiển thị thông tin đang có thật trong dự án — không thêm số điện thoại, địa chỉ công ty hay mạng xã hội chưa tồn tại.

File chính: `src/components/Footer.jsx` (mới), `src/App.jsx`.

### 6. Robot Cawi Robo dễ thương hơn

Thêm 1 lượt chỉnh ngoại hình nữa: mắt to tròn hơn kèm 2 lớp ánh sáng lấp lánh (long lanh hơn), lông mày cong mềm kiểu cười thay vì xếch thẳng, má hồng đậm và rộng hơn, nụ cười cong rõ 2 khoé. Mọi hành vi/tương tác (kéo thả, chat, đổi màu, ngủ...) giữ nguyên, chỉ đổi ngoại hình.

File chính: `src/components/CawiRobot.css`.

### 7. Popup chào mừng tự động — chỉ hiện ở lần mở web thứ 1 và thứ 2

Đưa trở lại 1 popup tự động hiện khi mở web, nhưng đổi khác bản cũ: nội dung giờ là "Bạn muốn xem hướng dẫn sử dụng web, hay so sánh giá ngay?" kèm 2 nút **Hướng dẫn sử dụng** / **So sánh ngay**. CartWise đếm số lần mở web trên máy (lưu trong localStorage) — **chỉ tự hiện ở lần 1 và lần 2**, từ lần thứ 3 trở đi sẽ không tự hiện nữa (người dùng vẫn luôn xem lại hướng dẫn qua mục "Hướng dẫn sử dụng" trong menu 3 gạch bất cứ lúc nào).

Lưu ý: đây là **popup khác** với popup "Sơ qua về CartWise" cũ (`IntroPopup.jsx`, vẫn giữ nguyên, mở qua menu 3 gạch) — popup mới này (`FirstVisitPopup.jsx`) chỉ lo phần tự động hiện theo số lần mở web.

File chính: `src/components/FirstVisitPopup.jsx` (mới), `src/App.jsx`.

### 8. Khoảng cách tới điểm bán trực tiếp

Trong khung so sánh sản phẩm, khi xem "Mua trực tiếp" và bạn đã cho phép CartWise lấy vị trí, mỗi cửa hàng trực tiếp giờ hiện thêm 1 nhãn nhỏ kèm icon định vị, ví dụ "Cách bạn 850 m" hoặc "Cách bạn 2.8 km" — dựa trên đúng vị trí bạn đã cấp quyền. CartWise chưa có toạ độ thật của từng chi nhánh cửa hàng (cần API bản đồ/đối tác riêng ở bản chính thức), nên khoảng cách hiện tại được tính **mô phỏng nhưng ổn định** — cùng 1 vị trí + cùng 1 cửa hàng luôn ra đúng 1 khoảng cách, không đổi lung tung mỗi lần mở lại.

File chính: `src/components/ProductModal.jsx`, `src/data/products.js`.

### 9. Đơn giản hoá Cawi Tín Hiệu Mua

Bỏ hẳn thanh ngang "Thấp nhất — Cao nhất" (vì đã có biểu đồ lịch sử giá lên xuống ngay phía trên rồi, để cả 2 là dư thừa). Câu khuyến nghị **Mua ngay / Nên chờ / Có thể mua** giờ là 1 khối to, đậm, nằm giữa, ngay dưới biểu đồ — nhìn phát hiểu ngay. Vẫn giữ nguyên chỉ mở khoá ở gói CartWise Plus.

File chính: `src/components/BuySignalCard.jsx`.

## Đã kiểm tra kỹ trước khi giao

- Build production sạch từ thư mục cô lập hoàn toàn mới, đúng từ chính file zip sắp giao.
- Kiểm thử tự động (Playwright) — toàn bộ pass:
  - Popup chào mừng: hiện đúng lần 1 và lần 2, không hiện lần 3; 2 nút bấm đúng chức năng (mở hướng dẫn / về trang chủ tìm kiếm).
  - Footer hiện đúng, chỉ chứa thông tin thật của CartWise.
  - Nút CTA trang chủ có class/kiểu dáng nổi bật mới.
  - Nút "Đã mua" ghi đúng bản ghi vào lịch sử mua hàng, cập nhật đúng dữ liệu.
  - Cawi Tín Hiệu Mua: đã bỏ thanh min/max, hiện đúng khối khuyến nghị to/giữa mới.
  - LoginModal: giao diện mới đúng class, icon điện thoại là SVG thật (không còn ký tự ☎), 2 nút chuyển đăng nhập/đăng ký hoạt động thật.
  - GroupCart: popup hỏi lưu tài khoản hiện đúng lúc (chỉ khi đã đăng nhập), lưu đúng dữ liệu; trang Hồ sơ hiện đúng số tài khoản đã lưu và nút xoá hoạt động đúng.
  - Khoảng cách tới cửa hàng trực tiếp hiện đúng, có số liệu hợp lệ khi đã cấp quyền vị trí.
- Kiểm tra thêm bằng ảnh chụp màn hình (desktop + mobile 390px): giao diện mới không vỡ layout, footer xếp gọn 1 cột trên mobile, không có lỗi console (ngoại trừ ảnh icon Google/Facebook không tải được do môi trường kiểm thử chặn mạng ngoài — sẽ tải bình thường khi chạy trên Vercel thật).
