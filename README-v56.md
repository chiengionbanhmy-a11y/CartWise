# CartWise v56 — UI clarity pass

Bản này được chỉnh trực tiếp từ source `cartwise-react-v55-intro-popup-no-slogan`.

## Các điểm đã chỉnh
- Làm hero rõ thông điệp sản phẩm trong vài giây đầu: tìm nơi có tổng chi phí dự kiến tốt hơn.
- Bỏ dấu gạch ngang trong headline.
- Bỏ slogan `Smart cart, smart decisions.` khỏi khu vực logo.
- Làm phần sản phẩm nối liền với hero, giảm cảm giác chia thành quá nhiều khối.
- Bỏ các tiêu đề dư thừa `Gợi ý nổi bật` và `Những sản phẩm được xem nhiều hôm nay`.
- Giữ bộ lọc/sắp xếp ngay trước danh sách sản phẩm nhưng không còn sticky khi cuộn.
- Làm card sản phẩm gọn hơn, ưu tiên 3 thông tin: sản phẩm, tổng chi phí dự kiến, nút so sánh.
- Giảm độ nổi của badge để tránh giao diện bị nhiều nhãn.
- Giữ tìm kiếm và danh sách gợi ý nhưng làm panel gọn, dễ đọc.
- Giảm độ nổi của Cawi Robo để không cạnh tranh với nội dung chính.
- Làm menu/thông báo có độ phân cấp rõ hơn.
- Tinh chỉnh intro popup để hierarchy rõ và ít cảm giác nặng chữ.
- Responsive lại các khu vực hero, bộ lọc và product card cho màn hình nhỏ.

## Lưu ý
Source vẫn giữ nguyên logic và dữ liệu sản phẩm hiện có. Đây là bản chỉnh UI/hierarchy, không thay thế bằng một project mới.

Do môi trường hiện tại không có quyền tải dependency Vite từ registry, bản build production chưa được chạy thành công trong môi trường này. Bạn có thể chạy `npm install` và `npm run build` trong project trước khi deploy.
