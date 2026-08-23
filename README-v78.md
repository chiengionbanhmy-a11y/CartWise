# CartWise — Bản giao code v78

## Game mới: "Thử Thách Săn Deal" (thay cho "Cawi Đố Giá")

Theo yêu cầu: làm 1 game khác **thiết thực hơn**, không "vô tri", vừa giữ chân người dùng vừa có lợi thật cho mục tiêu của web (so sánh giá, mua sắm thông minh).

### 1. Vì sao game này "thiết thực" hơn "Cawi Đố Giá" (v76)

"Cawi Đố Giá" là 1 trò đoán số mang tính trivia — vui nhưng tách rời khỏi hành vi thật mà CartWise muốn người dùng làm. "Thử Thách Săn Deal" thì ngược lại: **chính trò chơi là bản mô phỏng thu nhỏ của việc dùng CartWise thật** — mỗi lượt chơi bắt người chơi luyện đúng 1 kỹ năng: so sánh tổng chi phí (giá + phí vận chuyển) thật giữa các sàn để chọn ra lựa chọn tối ưu trong 1 ngân sách giới hạn. Đây trực tiếp là giá trị cốt lõi sản phẩm — rất dễ dùng để demo trước ban giám khảo ("trò chơi này chính là cách sản phẩm dạy người dùng tiết kiệm tiền thật").

### 2. Cách chơi

- Mỗi lượt chơi nhận 1 **nhiệm vụ mua sắm thật** ngẫu nhiên trong 6 nhiệm vụ (ví dụ: "Trang bị góc học tập đầu năm", "Sắm đồ cho phòng trọ mới"...), mỗi nhiệm vụ gồm 2 sản phẩm thật trong CartWise và 1 ngân sách giới hạn (tự tính từ đúng giá thật rẻ nhất của 2 sản phẩm đó, luôn có thể hoàn thành nhưng có áp lực thật nếu chọn sai sàn).
- Với từng sản phẩm, người chơi chọn 1 trong 3 sàn (Shopee / Lazada / Tiki) — mỗi nút hiện đúng giá niêm yết + phí vận chuyển thật (hoặc "Hết hàng" nếu sàn đó không có sản phẩm, dùng đúng dữ liệu thật trong `products.js`).
- Tổng chi phí dự kiến cập nhật ngay theo thời gian thực ở thanh ngân sách phía trên, đổi màu cam sang đỏ nếu vượt ngân sách — tạo áp lực quyết định thật như khi mua sắm thật.
- Sau khi chọn đủ sàn cho cả 2 món, bấm "Chốt đơn" để xem kết quả: tổng chi phí thật, % mức tối ưu đạt được so với phương án rẻ nhất tuyệt đối, có trong ngân sách hay không, và **số tiền tiết kiệm được ở lượt này** so với nếu chọn sàn đắt nhất cho mỗi món.
- Điểm số = tối đa 800 điểm theo % tối ưu + 200 điểm thưởng nếu hoàn thành trong ngân sách (tối đa 1000 điểm/lượt).

### 3. Con số thật để demo trước ban giám khảo

**"Tổng tiền đã tiết kiệm"** được cộng dồn qua `localStorage` sau mỗi lượt chơi, tính từ chênh lệch giá **thật** giữa lựa chọn của người chơi và sàn đắt nhất trong 3 lựa chọn — không phải số bịa. Con số này hiện ngay ở màn hình giới thiệu mỗi khi quay lại chơi, và ở màn hình kết quả mỗi lượt. Đây là 1 chỉ số rất mạnh để trình bày: "chỉ riêng qua minigame, người dùng của chúng tôi đã tiết kiệm được X đồng nhờ so sánh giá đúng."

### 4. Vị trí truy cập

Thay thế đúng vị trí mục "Cawi Đố Giá" trên thanh nav trên cùng (vẫn giữ 6 mục như cũ, không thêm mục nào để không lo xuống thêm hàng) — tự động có cả ở menu 3 gạch (mobile) vì dùng chung danh sách nav. Trang "Cawi Đố Giá" (v76) **vẫn còn nguyên trong code**, chỉ là không còn link dẫn tới từ thanh nav nữa (giống cách đã làm trước đây với trang Stores).

### 5. Các file đã thêm/sửa

- **Mới:** `src/pages/DealHuntGame.jsx` — component chính (3 màn hình: giới thiệu / đang chơi nhiệm vụ / kết quả).
- **Sửa:** `src/App.jsx` — thêm import + route `page === 'deal-hunt'`, giữ nguyên route `price-game` cũ.
- **Sửa:** `src/components/Navbar.jsx` — đổi mục nav từ `['price-game', 'Cawi Đố Giá']` thành `['deal-hunt', 'Thử Thách Săn Deal']`.
- **Sửa:** `src/styles.css` — thêm toàn bộ khối CSS mới cho game (cuối file, đánh dấu v78), tái dùng đúng ngôn ngữ thiết kế của v76 (thẻ luật chơi, khung thống kê nền tối, màn kết quả gradient) để đồng bộ giao diện toàn app, có responsive cho mobile (≤760px, các nút chọn sàn xếp dọc thành 1 cột thay vì 3 cột chật).

### 6. Đã kiểm tra kỹ trước khi giao

- Build production sạch, không lỗi — kiểm tra 2 lần: 1 lần ngay sau khi viết xong, 1 lần cuối từ chính file zip sắp giao (giải nén hoàn toàn mới).
- Kiểm thử tự động (Playwright) 22/22 bước pass: nav hiện đúng "Thử Thách Săn Deal" (không còn "Cawi Đố Giá"), màn giới thiệu đúng luật + không hiện khung thống kê khi chưa chơi lần nào, nhiệm vụ hiện đúng 2 sản phẩm với các nút sàn thật (kể cả trạng thái "Hết hàng" khi 1 sàn không có hàng), nút "Chốt đơn" chỉ bật khi đã chọn đủ, kết quả hiện đúng điểm số + số tiền tiết kiệm + trạng thái ngân sách, lưu đúng thống kê cộng dồn vào localStorage, "Thử nhiệm vụ khác" load nhiệm vụ mới sạch sẽ, khung thống kê hiện đúng ở lần vào sau, menu 3 gạch cũng có mục mới, không phát sinh lỗi console.
- Kiểm tra lại toàn bộ luồng đăng nhập/đăng xuất (v77) trên đúng bản build này — không bị ảnh hưởng.
- Kiểm tra mobile (390px): không tràn ngang, các nút chọn sàn tự chuyển thành danh sách dọc dễ bấm.
