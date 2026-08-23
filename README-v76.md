# CartWise — Bản giao code v76

## Tính năng mới: Minigame "Cawi Đố Giá"

Theo yêu cầu, đã xây dựng hoàn chỉnh minigame đoán giá sản phẩm thật trong CartWise, truy cập qua **mục mới trên thanh nav** (không phải nút ở trang chủ, không chỉ nằm trong menu 3 gạch).

### 1. Cách chơi

- Người chơi bấm vào mục **"Cawi Đố Giá"** trên thanh nav trên cùng (hoặc trong menu 3 gạch trên mobile).
- Trang giới thiệu (intro) hiện luật chơi: 8 câu hỏi mỗi ván, +100 điểm/câu đúng, điểm thưởng chuỗi đúng liên tiếp (tối đa +100/câu).
- Mỗi ván chơi random 8 sản phẩm thật khác nhau trong CartWise (không lặp lại trong cùng 1 ván).
- Với mỗi sản phẩm, người chơi phải đoán **tổng chi phí dự kiến rẻ nhất khi mua online** (giá sản phẩm + phí vận chuyển ước tính, tính từ đúng dữ liệu `products.js` và hàm `getBestFinalStore`/`getFinalCost` đã có sẵn trong app — không phải số bịa).
- 4 lựa chọn hiển thị dạng lưới 2x2, 1 đáp án đúng + 3 đáp án nhiễu được sinh tự động (nhân hệ số ngẫu nhiên rồi làm tròn về số "đẹp" theo thói quen nhìn giá tại Việt Nam, để trông tự nhiên như giá thật chứ không phải số random thô).
- Sau khi chọn, hệ thống hiện ngay đáp án đúng (tô xanh), đáp án sai người chơi chọn (tô đỏ), kèm giải thích ngắn gọn.
- Sau câu 8, vào màn hình kết quả: tổng điểm, số câu đúng, chuỗi đúng dài nhất, có badge "Kỷ lục mới!" nếu phá kỷ lục điểm cao nhất từ trước, và có 2 nút "Chơi lại" / "Về trang chủ".
- Điểm cao nhất, chuỗi đúng dài nhất và số lần đã chơi được **lưu lại** (localStorage) — lần sau vào trang sẽ thấy ngay khung "kỷ lục" của bản thân trước khi bắt đầu ván mới.
- Giá trong game luôn hiển thị theo **VNĐ** (không đổi theo đơn vị tiền tệ người dùng chọn ở Cài đặt), để số liệu trong game luôn tròn, dễ đọc, không lệch do làm tròn quy đổi.

### 2. Vì sao phù hợp để demo trước ban giám khảo

- Dùng đúng dữ liệu sản phẩm thật của CartWise (không phải nội dung minh hoạ tách biệt) — vừa giải trí, vừa **gián tiếp chứng minh trực quan** giá trị cốt lõi của sản phẩm (so sánh tổng chi phí thật giữa các nền tảng) ngay trong lúc chơi.
- Có thể chơi thử trực tiếp trên sân khấu trong 5 phút pitch hoặc phần Q&A để tăng tính tương tác, thay vì chỉ nói chay.

### 3. Vị trí truy cập

Đã thêm mục **"Cawi Đố Giá"** làm mục thứ 6 trên thanh nav trên cùng (cùng hàng với Trang chủ, Flash Sale, Ghép Đơn Cùng Bạn Bè, Thành tựu tiết kiệm, Về chúng tôi), đồng thời mục này cũng tự động xuất hiện trong menu 3 gạch (mobile) vì dùng chung danh sách nav.

Đã kiểm tra thực tế ở màn hình 1280px và 1440px: đủ chỗ hiển thị đầy đủ chữ tất cả 6 mục trên 1 hàng, không bị xuống dòng hay cắt chữ.

### 4. Các file đã thêm/sửa

- **Mới:** `src/pages/PriceGuessGame.jsx` — component chính của minigame (3 màn hình: intro / đang chơi / kết quả).
- **Sửa:** `src/App.jsx` — thêm import + route `page === 'price-game'`.
- **Sửa:** `src/components/Navbar.jsx` — thêm `['price-game', 'Cawi Đố Giá']` vào mảng `navs` (tự động có mặt ở cả thanh nav trên cùng và menu 3 gạch).
- **Sửa:** `src/styles.css` — thêm toàn bộ khối CSS mới cho minigame (cuối file), có responsive cho mobile (≤760px).

### 5. Đã kiểm tra kỹ trước khi giao

- Build production sạch, không lỗi (`npm run build` thành công, kiểm tra lại từ file zip giải nén hoàn toàn mới).
- Kiểm thử tự động (Playwright) 24/24 bước pass: mở đúng trang qua thanh nav, hiện đúng luật chơi, chơi đủ 8 câu, 4 đáp án luôn khác nhau, tô đúng màu đúng/sai, ra đúng màn hình kết quả với điểm số hợp lệ, lưu đúng kỷ lục vào localStorage, "Chơi lại" hoạt động, khung kỷ lục hiện đúng ở lần vào sau, mục menu 3 gạch cũng có, không phát sinh lỗi console.
- Phát hiện và sửa 1 lỗi giao diện trước khi giao: khi sản phẩm có ảnh cao mà chỉ có 4 nút đáp án, cột đáp án bên phải bị "trắng trống" một khoảng lớn phía dưới do CSS grid kéo giãn đều 2 cột theo cột cao nhất. Đã sửa bằng cách canh giữa theo chiều dọc (`align-items: center`) để phần dư chia đều cân đối trên/dưới thay vì dồn hết xuống dưới, nhìn chỉn chu hơn hẳn.
- Kiểm tra responsive ở màn hình mobile (390px): không bị tràn ngang, chuyển bố cục ảnh + đáp án về 1 cột dọc, chữ vẫn đọc rõ.
