# CartWise v75 — Khung giỏ hàng gọn/to hơn, Cawi Robo mở chat đè lên giỏ hàng, thêm ảnh + nhiệm vụ đội ngũ, bỏ mục Cawi Robo khỏi menu

Bản này xử lý toàn bộ góp ý mới nhất gửi kèm 7 ảnh chụp (khung giỏ hàng, menu 3 gạch, 5 ảnh thành viên). Không có trang hoàn toàn mới nào — sửa file có sẵn (`src/components/CartPanel.jsx` không đổi code, chỉ đổi CSS; `src/components/Navbar.jsx`, `src/components/CawiRobot.css`, `src/pages/About.jsx`, `src/styles.css`) và thêm 5 ảnh thành viên vào `public/team/`.

## 1. Khung giỏ hàng — chữ to hơn, nút "Sửa" dịch trái + nền tròn luôn hiện, bỏ nền/viền quanh sản phẩm, phóng to tổng thể

- Chữ "Giỏ hàng (N)" tăng từ 18px lên 21px, dễ đọc hơn.
- Nút "Sửa" dịch nhẹ sang trái (thêm khoảng cách với mép phải) và có nền tròn cam nhạt **luôn hiện sẵn** (trước đây chỉ hiện khi rê chuột), padding cân đối hai bên để nền tròn căn đúng giữa chữ.
- Từng dòng sản phẩm trong giỏ hàng: bỏ hẳn viền xám quanh từng dòng, các dòng giờ nối liền nhau chỉ có 1 đường kẻ mảnh phân cách (không còn kiểu "từng khung card" như trước) — nhìn gọn và hiện đại hơn. Ảnh sản phẩm tăng từ 52px lên 68px, tên sản phẩm tăng lên 16px, giá tăng lên 14.5px, nút xoá to hơn — đúng góp ý "giao diện hơi nhỏ, chỉnh to hơn".

File chính: `src/styles.css` (tìm đoạn có ghi chú "v75" ngay sau `.cart-row-confirm-v67`).

## 2. Cawi Robo — mở chat đè lên trước khung giỏ hàng, không cần đóng giỏ hàng

Trước đây khung chat của Cawi Robo có độ ưu tiên hiển thị (z-index) thấp hơn khung giỏ hàng, nên khi mở giỏ hàng rồi bấm icon robot trong đó, khung chat tuy vẫn mở nhưng bị **giỏ hàng che mất một phần / không bấm được**. Giờ khi khung chat đang mở, độ ưu tiên hiển thị của Cawi Robo được nâng lên trên hẳn khung giỏ hàng (nhưng vẫn thấp hơn các khung quan trọng khác như đăng nhập, cài đặt) — khung chat hiện thành **1 lớp nổi hẳn phía trước, che giỏ hàng phía sau**, gõ câu hỏi được ngay, không cần đóng giỏ hàng trước như yêu cầu. Đã kiểm tra bằng cách bấm thật vào ô nhập chat và gõ chữ trong khi giỏ hàng vẫn mở phía sau — hoạt động đúng, không chỉ so sánh số z-index suông (bài học từ lỗi tương tự ở bản v73).

File chính: `src/components/CawiRobot.css` (tìm `.cw22-widget.chat-open`).

## 3. Bỏ mục "Trợ lý Cawi Robo" khỏi menu 3 gạch

Dòng "Trợ lý Cawi Robo" trong menu 3 gạch đã được bỏ hẳn theo đúng yêu cầu. Robot vẫn mở chat bình thường qua icon nổi trên trang hoặc icon bên trong khung giỏ hàng, chỉ là không còn lối tắt riêng trong menu nữa.

File chính: `src/components/Navbar.jsx`.

## 4. "Về chúng tôi" → "Đội ngũ" — thêm ảnh thật + nhiệm vụ cụ thể cho từng thành viên

Thiết kế lại hoàn toàn phần đội ngũ: mỗi thành viên giờ có 1 thẻ hiện đại gồm ảnh thật (đã cắt nền, nền thay bằng dải gradient xanh than–vàng đồng bộ cho cả 5 ảnh dù ảnh gốc mỗi người chụp một kiểu khác nhau), họ tên đầy đủ, nhãn vai trò màu cam, và danh sách 3 nhiệm vụ cụ thể ứng với vai trò đó — thay cho bản cũ chỉ có tên + 1 dòng vai trò ngắn gọn, trông đơn sơ.

Thứ tự trái sang phải đúng theo yêu cầu:

1. **Trần Nguyễn Nhật Linh** — AI & Media Lead / Leader: điều phối tiến độ chung, định hướng chiến lược sản phẩm, phụ trách xây dựng Cawi Robo và nội dung truyền thông.
2. **Dương Quý Đức** — Researcher: nghiên cứu thị trường, khảo sát người dùng, phân tích đối thủ cạnh tranh.
3. **Đỗ Vũ Lê Minh** — Designer: thiết kế giao diện UI/UX, xây dựng bộ nhận diện thương hiệu.
4. **Nguyễn Hà An** — Business Analyst: phân tích mô hình kinh doanh, đánh giá tính khả thi, chuẩn bị số liệu cho phần gọi vốn.
5. **Nguyễn Minh Hữu** — Product Manager: quản lý lộ trình phát triển, kết nối công việc giữa các thành viên.

Ảnh gốc được xử lý qua 2 bước: (1) sửa hướng ảnh bị xoay ngang của 1 tấm (do điện thoại lưu sai chiều), (2) cắt nền tự động bằng AI rồi crop/canh chỉnh lại cho cả 5 ảnh có cùng khung hình (từ ngực trở lên) để nhìn đồng bộ trên cùng 1 hàng, dù ảnh gốc khác nhau về góc chụp, khoảng cách, tỉ lệ khung hình.

Ở màn hình rộng (máy tính), 5 thẻ luôn nằm gọn trên đúng 1 hàng. Ở màn hình hẹp hơn (điện thoại), tự động xuống 1 cột, không bị tràn ngang.

File chính: `src/pages/About.jsx` (mảng `teamMembers`), `src/styles.css` (tìm `.team-grid-v75`), 5 ảnh mới trong `public/team/`.

## Đã kiểm tra

Build sạch, cài mới hoàn toàn trong thư mục cô lập (`npm install && npm run build`) — không lỗi, kể cả từ file zip export ra thư mục trắng. Kiểm thử Playwright:

- Menu 3 gạch: xác nhận không còn dòng "Trợ lý Cawi Robo", vẫn còn "Giỏ hàng so sánh".
- Mở giỏ hàng → bấm icon Cawi Robo trong khung giỏ hàng → khung chat mở ra, giỏ hàng vẫn mở phía sau, **gõ thật chữ vào ô nhập chat** và xác nhận gõ được (không chỉ kiểm tra khung chat "có mặt" mà đo bằng `document.elementFromPoint` xem đúng là khung chat nằm trên cùng tại toạ độ đó, tránh lặp lại lỗi so sánh z-index suông của bản trước).
- Thêm sản phẩm vào giỏ hàng thật, chụp ảnh khung giỏ hàng để xác nhận bằng mắt: chữ "Giỏ hàng (1)" to rõ, nút "Sửa" có nền tròn cam nhạt luôn hiện, dòng sản phẩm không còn viền/nền xám riêng từng dòng.
- Trang "Về chúng tôi" → tab "Đội ngũ": xác nhận cả 5 ảnh load thành công (không lỗi ảnh vỡ), đúng 5 thẻ, đúng thứ tự tên/vai trò/nhiệm vụ, không có lỗi runtime. Chụp ảnh đối chiếu ở màn hình rộng (5 thẻ 1 hàng) và điện thoại 390px (xuống 1 cột, không tràn ngang — đo `scrollWidth` bằng 0px chênh lệch).

Tổng cộng test lần này **9/9 assertion** ở kịch bản giỏ hàng + chat, cộng kiểm tra ảnh/trang đội ngũ riêng — không lỗi runtime nào ở console trong suốt quá trình test.

## Lưu ý khi đưa code lên GitHub

Nhớ dùng đúng quy trình GitHub Desktop đã dùng thành công ở bản v73–v74: copy đè toàn bộ file mới (bao gồm cả thư mục `public/team/` mới thêm) vào thư mục đã clone, xem GitHub Desktop hiện đúng danh sách file thay đổi/thêm mới, Commit rồi Push — rồi vào tab Domains trong Vercel lấy đúng link Production để xem bản mới nhất.
