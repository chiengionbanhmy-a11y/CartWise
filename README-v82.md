# CartWise — Bản giao code v82

## Tóm tắt các thay đổi lần này

### 1. Cawi Cố Vấn Chi Tiêu — bổ sung Bộ 5 câu hỏi đánh giá mức độ cần thiết

Trước đây Cố Vấn Chi Tiêu chỉ trả lời được "mua món này có đủ tiền không" (dựa % ngân sách tháng). Giờ bổ sung thêm 1 trục hoàn toàn độc lập: **mức độ cần thiết tại thời điểm mua**, đo bằng bộ 5 câu hỏi trắc nghiệm nhanh (~20 giây).

Sau khi bấm "Hỏi Cawi trước khi mua" và xem lời khuyên theo ngân sách như cũ, giờ có thêm 1 nút phụ tuỳ chọn: **"Trả lời nhanh 5 câu hỏi để Cawi tư vấn chính xác hơn"**. Bấm vào mở widget từng-câu-một, có chấm tròn báo tiến trình, nút quay lại để đổi đáp án, mỗi câu có 1 lựa chọn phụ "Chưa chắc / không rõ" dành cho người thật sự phân vân.

Sau câu 5, CartWise kết hợp **ngân sách** (Phù hợp / Sắp chạm / Đã vượt) với **mức độ cần thiết** (Rất cần thiết / Khá cần thiết / Nên cân nhắc / Mua theo cảm xúc) qua 1 ma trận 3×4 minh bạch để ra lời khuyên cuối cùng, kèm 1 dòng "vì sao" ngắn gọn ghép từ chính câu trả lời. Nếu người dùng chọn "Chưa chắc" từ 3 câu trở lên, CartWise tự nhận biết dữ liệu chưa đủ tin cậy và đổi giọng khuyên sang mềm hơn thay vì vẫn chốt hạ khẳng định mạnh. Cuối kết quả có 2 lựa chọn: "Vẫn mua" hoặc — nếu sản phẩm có dữ liệu xu hướng giá — "Xem Cawi Tín Hiệu Mua" để cân nhắc thêm.

Toàn bộ vẫn giữ đúng nguyên tắc đã cam kết: điểm số tính theo công thức cộng dồn cố định, AI chỉ diễn giải thành câu chữ tự nhiên chứ không tự quyết định kết quả. Chỉ mở khoá ở CartWise Plus, giữ nguyên phạm vi như tính năng gốc.

File chính: `src/data/spendingAdvisorQuestions.js` (mới), `src/components/SpendingAdvisorQuiz.jsx` (mới), `src/components/SpendingAdvisorCard.jsx`, `src/data/purchases.js` (hàm `getBudgetLevel`).

### 2. Cawi Robo không còn hiện trong khung so sánh tổng chi phí

Trước đây khi bấm "So sánh tổng chi phí" để mở khung so sánh sản phẩm, robot Cawi Robo hiện ở góc khung. Theo yêu cầu, giờ robot **không còn hiển thị** ở đây nữa (robot nổi ở các trang khác không đổi, vẫn hoạt động bình thường).

File chính: `src/components/ProductModal.jsx`.

### 3. Đánh giá & Chất lượng sản phẩm — nhiều đánh giá hơn, có ảnh/video minh hoạ

Mỗi sản phẩm giờ tổng hợp **4 đến 5 đánh giá mẫu** (trước đây 3-4), và **tối thiểu 2 đánh giá mỗi sản phẩm có kèm ảnh hoặc video minh hoạ**. Vì CartWise chưa có backend cho khách tự đăng ảnh/video thật kèm đánh giá, ảnh/video minh hoạ dùng lại đúng ảnh sản phẩm đã có sẵn trong hệ thống — và luôn gắn rõ nhãn **"Ảnh minh hoạ (demo)"** / **"Video minh hoạ (demo)"** ngay trên từng thumbnail, kèm 1 dòng ghi chú minh bạch ở cuối khối đánh giá, đúng nguyên tắc minh bạch dữ liệu demo áp dụng xuyên suốt dự án — không trình bày như ảnh/video thật do khách hàng tự chụp.

File chính: `src/data/reviews.js`, `src/components/AIReviewSummary.jsx`.

### 4. Số tiền đã tiết kiệm cập nhật ngay khi bấm "Đã mua"

Trước đây sau khi bấm "Đã mua" ở khung so sánh sản phẩm (tính năng v81), số liệu ghi đúng vào lịch sử mua hàng, nhưng bộ đếm "Số tiền đã tiết kiệm" ở đầu trang chủ chỉ cập nhật sau khi tải lại trang. Giờ bộ đếm **cập nhật ngay lập tức**, không cần tải lại — áp dụng cùng cơ chế sự kiện window tuỳ biến đã dùng cho việc đồng bộ màu robot Cawi.

File chính: `src/data/purchases.js`, `src/components/SavingsCounter.jsx`.

## Đã kiểm tra kỹ trước khi giao

- Build production sạch từ thư mục cô lập hoàn toàn mới, đúng từ chính file zip sắp giao.
- Kiểm thử tự động (Playwright, 18 kiểm tra) — toàn bộ pass:
  - Robot Cawi Robo không còn render trong khung so sánh, khối `modal-advisor-slot` vẫn còn (không vỡ layout/CSS liên quan).
  - Cố Vấn Chi Tiêu: nút "Hỏi Cawi" vẫn hoạt động như cũ, CTA "Trả lời nhanh 5 câu hỏi" hiện đúng sau khi có lời khuyên ngân sách, widget mở đúng 5 câu + 5 chấm tiến trình, trả lời hết ra đúng kết quả kết hợp, nút quay lại hoạt động, CTA "Xem Cawi Tín Hiệu Mua" hiện đúng.
  - Kiểm tra riêng trường hợp chọn "Chưa chắc" ≥3 câu: đúng chuyển sang câu khuyến nghị mềm hơn + hiện dòng ghi chú độ tin cậy thấp.
  - Đánh giá sản phẩm: số đánh giá mẫu đúng 4-5 cho cả 12 sản phẩm, tối thiểu 2 đánh giá có media, caption đều gắn nhãn "demo".
  - Số tiền tiết kiệm: bấm "Đã mua" trong khung so sánh, đóng khung, số tiền ở đầu trang chủ đổi ngay — không cần tải lại trang.
- Kiểm tra thêm bằng ảnh chụp màn hình desktop (1400px) và mobile (390px): widget 5 câu hỏi, khối kết quả (cả trường hợp bình thường và "Chưa chắc" ≥3 câu), ảnh/video minh hoạ trong đánh giá — không vỡ layout ở cả 2 kích thước, không có lỗi console (ngoại trừ icon Google/Facebook bị chặn mạng ngoài trong môi trường kiểm thử — sẽ tải bình thường trên Vercel thật).
