# CartWise v71 — Icon Cawi Robo chuyển vào trong giỏ hàng, icon giỏ hàng đổi gradient xanh than–xanh lá

Bản này gộp 3 yêu cầu chỉnh sửa sau khi xem demo v70. Không có file hoàn toàn mới nào — chỉ sửa file có sẵn (`src/App.jsx`, `src/components/Navbar.jsx`, `src/components/CartPanel.jsx`, `src/styles.css`).

## 1. Icon Cawi Robo không còn cố định trên nav — chỉ hiện khi mở giỏ hàng, đứng ngay cạnh giỏ hàng

Trước đây icon Cawi Robo (hình robot vẽ sẵn) nằm cố định trên thanh nav, cạnh icon giỏ hàng, hiện thường trực. Giờ icon này **chỉ xuất hiện khi người dùng bấm mở giỏ hàng**, và đứng ngay trong khung tiêu đề của giỏ hàng vừa mở ra (cạnh chữ "Giỏ hàng (N)"), bấm vào vẫn mở khung chat Cawi Robo như cũ.

Lưu ý kỹ thuật: icon này được đặt bên trong header của khung giỏ hàng (không phải 1 nút nổi tự do đặt đè lên trên) — cách này đảm bảo icon luôn nằm gọn trong bố cục, không bao giờ bị chồng/che lên nút đóng, kể cả trên điện thoại khi khung giỏ hàng chiếm hết chiều rộng màn hình. Đã kiểm tra riêng trên cả màn hình máy tính và màn hình điện thoại (390px) để chắc chắn không bị đè icon.

File chính: `src/components/CartPanel.jsx` (icon + sự kiện mở chat), `src/components/Navbar.jsx` (bỏ icon cố định khỏi thanh nav), `src/styles.css` (tìm `cawi-cart-side-btn-v71`).

## 2. Icon giỏ hàng đổi màu — gradient xanh than + xanh lá

Icon giỏ hàng trên thanh nav trước đây màu cam thương hiệu, giờ đổi sang **gradient 2 màu xanh than (`#172033`) chuyển sang xanh lá (`#16a34a`)** theo đúng yêu cầu, đi chéo từ góc trên-trái sang góc dưới-phải icon.

File chính: `src/components/Navbar.jsx` (tìm `cartwise-cart-gradient-v71`).

## 3. Giỏ hàng trống vẫn mở được, hiện đúng thông báo

Đã kiểm tra lại: khi chưa có sản phẩm nào trong giỏ hàng, bấm vào icon giỏ hàng **vẫn mở được bình thường** (hành vi này đã có sẵn từ trước, không cần sửa thêm) — bên trong hiện dòng chữ "Giỏ hàng đang trống. Mở một sản phẩm bất kỳ và bấm 'Thêm vào giỏ hàng' ngay trong khung so sánh nhé." thay vì màn hình trống trơn.

## Đã kiểm tra

Build sạch, cài mới hoàn toàn trong thư mục cô lập (`npm install && npm run build`) — không lỗi. Chạy lại toàn bộ bộ kiểm thử Playwright cho các tính năng từ bản v69 (23 assertion, đã cập nhật theo hành vi mới của icon Cawi Robo) và bộ kiểm thử riêng cho 3 thay đổi của bản v71 (9 assertion: icon robot ẩn/hiện đúng lúc, màu gradient áp dụng đúng, giỏ hàng trống hiện đúng thông báo, bấm icon robot không làm đóng giỏ hàng, icon robot không bị đè/che ở cả 2 kích thước màn hình) — tổng cộng 32/32 pass. Có chụp ảnh màn hình đối chiếu trên cả máy tính và điện thoại.

## Lưu ý quan trọng về việc đưa code lên GitHub

Bản v71 này không có file hoàn toàn mới nào (chỉ sửa file có sẵn), nên khả năng cao sẽ không gặp lại lỗi "thiếu file mới" như các bản trước. Nhưng vẫn khuyến khích dùng GitHub Desktop hoặc xoá hết rồi kéo thả lại nguyên cả thư mục một lần khi upload, để chắc chắn.
