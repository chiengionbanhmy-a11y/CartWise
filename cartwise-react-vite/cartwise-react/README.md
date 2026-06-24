# HƯỚNG DẪN SỬA LỖI ROBOT WIDGET - CARTWISE

Tập tin này chứa mã nguồn đã được sửa các lỗi nghiêm trọng xuất hiện trong ảnh:
1. Sửa lỗi bong bóng thoại bị bóp nghẹt thành một dải trắng dọc (do thiếu thuộc tính width và white-space).
2. Sửa lỗi che khuất nội dung bằng cách đưa widget về góc cố định (position: fixed) với kích thước chuẩn hóa.
3. Loại bỏ chữ "zzz" gây phiền toái gần đầu robot.

## Cách áp dụng vào dự án GitHub của bạn:

### Cách 1: Thay thế trực tiếp vào file CSS hiện tại của bạn
- Mở file `style.css` (hoặc file css chứa phần robot của bạn).
- Copy toàn bộ nội dung trong file `style.css` được cung cấp trong thư mục này và dán đè/bổ sung vào file CSS của bạn.
- Đảm bảo các class như `.robot-chat-bubble` trùng khớp với các thẻ HTML bạn đặt tên.

### Cách 2: Sử dụng bộ khung HTML/CSS mẫu đính kèm
- File `index.html` chứa cấu trúc chuẩn và sạch để hiển thị widget này ở góc màn hình đúng chuẩn UX của các website thương mại điện tử hiện đại.

Sau khi sửa xong, bạn chỉ cần commit và push lên GitHub, Vercel sẽ tự động cập nhật bản sửa lỗi này lên trang web live của bạn!
