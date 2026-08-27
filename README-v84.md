# CartWise — Bản giao code v84

## Bối cảnh lần này

Bạn gửi 10 ảnh chụp màn hình + 6 gạch đầu góp ý sau khi xem bản v83. v84 xử lý đủ cả 6 gạch đầu đó.

## 1. Bỏ nút tự khai "Đã mua / Chưa mua" trong khung so sánh sản phẩm

Khối này (dưới nút "Thêm vào giỏ hàng" trong `ProductModal.jsx`) đã ẨN khỏi giao diện theo đúng ảnh 1 bạn gửi. Cách tự khai chính bây giờ là popup tự động "Bạn đã mua chưa?" hiện ra sau khi bấm "Mua tại đây" rồi quay lại tab CartWise (đã có từ v83) — 1 lối tự khai chủ động là đủ, có 2 lối trùng nhau dễ gây rối. Code cũ không xoá, chỉ đặt trong comment, dễ bật lại nếu cần.

## 2. Nút "Đăng xuất" ở cuối trang Hồ sơ

Trước đây chỉ đăng xuất được qua menu 3 gạch trên navbar. Giờ có thêm 1 nút "Đăng xuất" rõ ràng ở cuối trang Hồ sơ (`Profile.jsx`), bấm vào là đăng xuất và quay về trang chủ ngay.

## 3. Huy hiệu gói tài khoản (Plus / Plus Student) cạnh giỏ hàng

Theo ảnh 2 và ảnh 3: nếu tài khoản đang dùng gói CartWise Plus hoặc CartWise Plus Student, một huy hiệu nhỏ hiện ngay cạnh icon giỏ hàng trên thanh nav — chữ "Plus" hoặc "Plus Student" tương ứng, nền gradient than-vàng giống hệt màu nút "Nâng cấp ứng dụng". Gói Miễn phí thì không hiện gì (đúng yêu cầu "nếu đã mua gói nâng cấp"). Huy hiệu này ẩn trên di động để không chật thanh nav, giống cách các icon khác trên thanh nav chính đã xử lý.

## 4. Số tiền tiết kiệm cập nhật ngay khi mua qua "Mua tại đây"

Kiểm tra lại đúng ví dụ bạn nêu (mua cục sạc, tiết kiệm 100k qua Shopee): khi bấm "Mua tại đây" → quay lại tab → xác nhận "Đã mua" ở popup tự động, số tiền tiết kiệm ở khối "Số tiền đã tiết kiệm" (trang chủ) cập nhật ngay lập tức, không cần tải lại trang — cơ chế này đã có sẵn từ v82/v83 (sự kiện `cartwise-purchase-updated`), lần này kiểm thử tự động lại đúng theo kịch bản "Mua tại đây" (không chỉ nút tự khai thủ công) để chắc chắn không có lỗ hổng. Đã xác nhận bằng Playwright: số tiền đổi từ 410.000đ → 463.610đ ngay sau khi xác nhận, không tải lại trang.

## 5. Tái cấu trúc khung so sánh sản phẩm (ProductModal) theo góp ý UX

Theo đúng bảng đề xuất trong 4 ảnh góp ý (giảm "Cognitive Overload"):

- **Đơn vị hiển thị (tiền tệ)**: trước hiện luôn 1 khối riêng, giờ ẩn sau 1 nút cài đặt gọn ("⚙ Đơn vị hiển thị: VND"), bấm mới mở.
- **Cột trái** giờ chỉ còn: ảnh sản phẩm, nút "Thêm vào giỏ hàng", biểu đồ lịch sử giá, và 1 huy hiệu gọn "Cawi Tín Hiệu Mua" (bấm vào mở thẳng phần phân tích chi tiết) — đúng đề xuất "chỉ nên còn ảnh + nút mua + biểu đồ + huy hiệu tín hiệu mua".
- **Banner giá tốt nhất** và **thẻ "khoản tiết kiệm tối ưu"** (trước đây 2 khối tách rời, lặp thông tin) giờ gộp thành 1 banner hero duy nhất.
- **3 tính năng AI** (Đánh giá & Chất lượng sản phẩm, Cawi Cố Vấn Chi Tiêu, Cawi Tín Hiệu Mua) trước đây nằm rải rác 3 nơi khác nhau trong khung, giờ gộp vào đúng 1 khung duy nhất tên **"Trợ lý Cawi"**.
- **Progressive Disclosure**: khung "Trợ lý Cawi" mặc định THU GỌN, chỉ hiện 1 nút "Xem phân tích AI Cawi" — bấm vào mới hiện đủ cả 3 phần phân tích. Mặc định khi mở khung so sánh, người dùng chỉ thấy: ảnh + biểu đồ, kết quả giá tốt nhất, và bảng so sánh online/trực tiếp — đúng 3 nhóm thông tin theo đề xuất.
- Bỏ hẳn khối "CHÚ Ý — Kết luận dự kiến" ở cuối trang vì lặp lại y hệt câu kết luận đã hiện trong banner hero ở đầu trang.

File chính: `src/components/ProductModal.jsx`, `src/components/Navbar.jsx` (không đổi ở đây), CSS mới trong `src/styles.css` (khối `v84`).

**Lưu ý về cách giữ code cũ:** với thay đổi cấu trúc lớn ở file này, thay vì để lại toàn bộ JSX cũ dạng comment (sẽ khiến file rất khó đọc), phần lớn thay đổi được ghi rõ bằng 1 đoạn giải thích ngắn ngay tại chỗ thay đổi; 2 khối nhỏ hơn (nút tự khai đã mua, khối kết luận cuối trang) vẫn giữ nguyên dạng comment như quy ước cũ của dự án.

## 6. Tái cấu trúc trang "Thành tựu tiết kiệm" theo góp ý UX

Theo đúng 2 ảnh góp ý cuối:

- **Bỏ hẳn bản đồ trò chơi nền tối** (ngôi sao, trăng, lâu đài, đường đi zigzag) — không hợp với phong cách sáng/tối giản của phần còn lại trong app. Code giữ nguyên trong `{false && (...)}`, không render, dễ bật lại nếu cần.
- **Danh sách các mốc thành tựu** (trước đây chỉ là phần chi tiết phụ bên dưới bản đồ) giờ là khối hiển thị CHÍNH của trang — mốc "đang hướng tới" được làm nổi bật hơn hẳn bằng khung nền cam nhạt, mốc "đã đạt" có dấu tích xanh, mốc "sắp tới" mờ + khoá — 3 trạng thái rõ ràng, dễ phân biệt.
- **Ghi chú "dữ liệu minh hoạ"** trước đây là 1 đoạn văn dài luôn hiện ngay đầu trang, giờ thu gọn thành 1 huy hiệu nhỏ có icon (i) — bấm/di chuột vào mới hiện chú thích đầy đủ, nội dung giữ nguyên 100%.

File chính: `src/pages/SavingsAchievements.jsx`, CSS mới trong `src/styles.css` (khối `v84`).

## Đã kiểm tra kỹ trước khi giao

- Build production sạch từ thư mục cô lập hoàn toàn mới, đúng từ chính file zip sắp giao.
- Kiểm thử tự động (Playwright, 27 kiểm tra) — toàn bộ pass:
  - Nút tự khai "Đã mua/Chưa mua" không còn hiện trong khung so sánh.
  - Nút "Đăng xuất" hiện đúng ở trang Hồ sơ, bấm vào đăng xuất đúng (xoá phiên đăng nhập, navbar hiện lại nút "Đăng nhập").
  - Huy hiệu "Plus"/"Plus Student" hiện đúng theo từng gói, không hiện ở gói Miễn phí.
  - Số tiền tiết kiệm cập nhật ngay sau khi xác nhận mua qua "Mua tại đây" — không cần tải lại trang.
  - Khung so sánh sản phẩm: đơn vị hiển thị ẩn mặc định (mở đúng khi bấm), huy hiệu tín hiệu mua gọn hiện ở cột trái, banner hero gộp đúng, khung "Trợ lý Cawi" thu gọn mặc định và mở đúng ra đủ cả 3 phần (đánh giá, cố vấn chi tiêu, tín hiệu mua) khi bấm, khối "CHÚ Ý — Kết luận dự kiến" không còn hiện.
  - Trang Thành tựu tiết kiệm: bản đồ nền tối không còn hiện, ghi chú demo đã thu gọn thành huy hiệu, danh sách mốc thành tựu là khối chính.
- Kiểm tra thêm bằng ảnh chụp màn hình: khung so sánh sản phẩm (thu gọn/mở rộng), huy hiệu gói tài khoản trên navbar, trang Thành tựu tiết kiệm — giao diện khớp đúng phong cách chung của app, không vỡ layout.

## Việc của các bản trước vẫn giữ nguyên, không đổi

Toàn bộ tính năng v81/v82/v83 (Cố Vấn Chi Tiêu 5 câu hỏi, đánh giá kèm ảnh/video, ngân sách tháng tự khai, popup xác nhận mua hàng, giá/link thật cho 4 sản phẩm...) vẫn hoạt động như cũ — xem `README-v82.md` và `README-v83.md`.
