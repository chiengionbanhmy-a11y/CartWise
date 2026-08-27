# CartWise — Nhật ký thay đổi

Trước đây mỗi bản giao có 1 file `README-vNN.md` riêng — dồn hết vào 1 file `CHANGELOG.md` duy nhất này cho gọn (đỡ nhiều mục khi đưa lên GitHub). Bản mới nhất ở trên cùng.

## v84 — Góp ý UX vòng chung kết (bản hiện tại)

Xử lý 6 góp ý gửi kèm ảnh chụp màn hình sau khi xem v83:

1. Bỏ nút tự khai "Đã mua / Chưa mua" trong khung so sánh sản phẩm (đã ẩn, giữ code).
2. Thêm nút "Đăng xuất" ở cuối trang Hồ sơ.
3. Huy hiệu gói tài khoản (Plus / Plus Student) cạnh icon giỏ hàng, nền gradient than-vàng giống nút "Nâng cấp ứng dụng".
4. Xác nhận số tiền tiết kiệm cập nhật ngay khi mua qua "Mua tại đây" — không cần tải lại trang.
5. Tái cấu trúc khung so sánh sản phẩm: ẩn đơn vị hiển thị sau icon cài đặt, gộp banner giá tốt nhất + khoản tiết kiệm, gộp cả 3 tính năng AI vào 1 khung "Trợ lý Cawi" mặc định thu gọn, bỏ khối kết luận lặp ở cuối.
6. Tái cấu trúc trang "Thành tựu tiết kiệm": bỏ bản đồ game nền tối, đưa danh sách mốc thành khối chính, thu gọn ghi chú demo thành huy hiệu nhỏ.

File chính: `src/components/ProductModal.jsx`, `src/components/Navbar.jsx`, `src/pages/Profile.jsx`, `src/pages/SavingsAchievements.jsx`, `src/styles.css` (khối `v84`).

Đã kiểm tra: build sạch từ thư mục cô lập hoàn toàn mới; Playwright 27/27 pass (đủ 6 mục trên + hồi quy v81–v83).

**Dọn dẹp repo lần này:** gỡ 12 ảnh PNG cũ không còn được code nào tham chiếu tới (các phiên bản thử nghiệm trước đây của mascot Cawi Robo và icon logo — `cartwise-cartbot-v8` đến `v16`, `robot-cawi.png`, `robot-cawi-v2.png`, `robot-cawi-v4.png`, `cartwise-logo-icon.png` bản không có hậu tố `-v4`) — giảm dung lượng repo từ ~9.9MB xuống ~4.2MB. Robot Cawi trên giao diện hiện vẽ hoàn toàn bằng SVG/CSS trong code, không dùng các ảnh này.

## Lịch sử các bản trước (tóm tắt)

- **v83** — Ghép lại từ bản "sửa lỗi so sánh": giá/link mua hàng thật cho 4 sản phẩm, popup tự động hỏi "đã mua chưa?" sau khi bấm "Mua tại đây", ngân sách tháng tự khai (sửa 1 lần).
- **v82** — Cố Vấn Chi Tiêu: bổ sung bộ 5 câu hỏi đánh giá mức độ cần thiết; ẩn Cawi Robo trong khung so sánh; đánh giá sản phẩm có ảnh/video minh hoạ; số tiền tiết kiệm cập nhật live.
- **v81** — Nút tự khai "Đã mua/Chưa mua"; làm mới giao diện đăng nhập/đăng ký; lưu tài khoản ngân hàng qua popup; nút "Thử so sánh ngay" nổi bật hơn; thêm Footer.
- **v80** — Đưa icon giỏ hàng + cụm đăng nhập/đăng ký ra lại thanh nav chính; trang "Nâng cấp ứng dụng" liệt kê rõ mốc lịch sử kiểm tra giá theo từng gói.
- **v79** — Bỏ ép xem "Sơ qua về CartWise"; huy hiệu số lượng giỏ hàng; QR thanh toán dạng popup toàn màn hình; đổi tên "Ai góp nấy trả".
- **v78** — Game "Thử Thách Săn Deal" thay cho "Cawi Đố Giá" (thiết thực hơn, luyện đúng hành vi so sánh giá + ngân sách).
- **v77** — Dời đăng nhập/đăng ký/đăng xuất vào menu 3 gạch.
- **v76** — Minigame "Cawi Đố Giá".
- **v75** — Khung giỏ hàng rõ hơn; Cawi Robo mở chat đè lên giỏ hàng; trang "Đội ngũ" có ảnh thật + nhiệm vụ từng thành viên.
- **v74** — Sửa lỗi phát sinh từ v73 (kiểm tra kỹ trước khi giao).
- **v73** — Bỏ icon giỏ hàng khỏi nav (nhường chỗ thông báo/menu); bỏ mục "Điểm bán"; sửa lỗi Cawi Robo che khung mở từ nav.
- **v72** — Trang "Thành tựu tiết kiệm" thêm bản đồ hành trình kiểu game (đã bỏ lại ở v84); thanh tiến trình trực quan; GroupCart chỉnh sửa dạng modal.
- **v71** — Icon Cawi Robo chỉ hiện khi mở giỏ hàng; icon giỏ hàng đổi màu gradient; giỏ hàng trống vẫn mở được.
- **v70** — Sửa lỗi phát sinh, lưu ý khi đưa code lên GitHub.
- **v69** — Icon giỏ hàng thật hơn; màn hình giỏ hàng kiểu app có chế độ "Sửa"; trang "Thành tựu tiết kiệm" ra mắt lần đầu.
- **v68** — Sửa lỗi phát sinh từ v67.
- **v67** — Mã QR ghép tên vào ảnh; nhiều cải tiến "Ghép Đơn Cùng Bạn Bè"; giỏ hàng so sánh (tính năng mới); Cawi Robo thêm câu hỏi.
- **v66** — Sửa lỗi kỹ thuật cần biết trước ngày thi.
- **v65** — Điều chỉnh nhỏ, lưu ý khi deploy.
- **v64** — Bỏ "Giỏ Hàng Tối Ưu"; sửa cách tạo mã QR "Nhóm Góp Tiền"; bỏ khối đánh giá trắng trong popup sản phẩm; đổi vị trí Cawi Robo.
- **v63** — 6 tính năng mới (Mục 3–4 báo cáo); bỏ "Dạo siêu thị"; sửa lỗi dịch ngôn ngữ.
- **v58** — Tóm tắt đánh giá bằng AI; "Ghép đơn cùng bạn" (Freeship); ghim version cụ thể trong `package.json`.
- **v57** — Xác định mục tiêu, các gói, route chính của dự án.
- **v56** — Các điều chỉnh ban đầu.

Chi tiết đầy đủ từng bản (trước v84) vẫn được lưu trong Claude Project của đội, có thể xem lại bất cứ lúc nào nếu cần.
