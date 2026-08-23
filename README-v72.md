# CartWise v72 — Icon giỏ hàng to hơn, bản đồ "Thành tựu tiết kiệm" kiểu game, GroupCart hiện dạng modal + căn thẳng hàng

Bản này gộp toàn bộ góp ý sau khi xem demo v71 (6 ảnh chụp màn hình + góp ý chi tiết). Không có file hoàn toàn mới nào — chỉ sửa file có sẵn (`src/components/Navbar.jsx`, `src/pages/SavingsAchievements.jsx`, `src/pages/GroupCart.jsx`, `src/styles.css`).

## 1. Về dòng chữ "giỏ hàng trống" hiện ở cuối trang và nền đen sau icon giỏ hàng

Đã kiểm tra kỹ lại toàn bộ code hiện tại: **không tìm thấy đoạn nào khiến dòng chữ "giỏ hàng trống" tự hiện ở cuối trang** — khung giỏ hàng (kể cả trạng thái trống) chỉ được dựng lên trong DOM khi người dùng bấm mở icon giỏ hàng, đúng như yêu cầu. Icon giỏ hàng trên thanh nav trong code hiện tại cũng **không có nền đen** — nền đã là trong suốt/trắng từ trước.

Nhiều khả năng 2 ảnh chụp màn hình gửi kèm là chụp từ **bản deploy cũ trên Vercel/GitHub**, chưa cập nhật đúng code mới nhất (lỗi này đã từng gặp ở các bản trước — do upload thiếu file khi kéo thả thư mục lên GitHub). Khuyến nghị: lần này dùng **GitHub Desktop** để đồng bộ, hoặc xoá sạch toàn bộ file trên GitHub rồi kéo thả lại nguyên cả thư mục `v72` một lần, để chắc chắn Vercel build đúng bản mới nhất.

## 2. Icon giỏ hàng trên thanh nav — nền trắng, viền dày hơn, icon to hơn

Nút giỏ hàng đổi từ nền trong suốt/viền mảnh sang: nền trắng trùng màu thanh nav, viền dày 2.5px, kích thước nút tăng lên 60x60px, icon giỏ hàng tăng từ 27px lên 32px — nhìn rõ và nổi bật hơn hẳn trên thanh nav.

File chính: `src/components/Navbar.jsx`, `src/styles.css` (tìm `cart-nav-btn-v69`).

## 3. Trang "Thành tựu tiết kiệm" — thêm bản đồ hành trình kiểu game

Phía trên danh sách các mốc tiết kiệm (vẫn giữ nguyên dạng danh sách dọc chi tiết như bản cũ), thêm hẳn **1 khung bản đồ trò chơi sinh động**, lấy cảm hứng từ ảnh tham khảo (kiểu bản đồ game "Study GPS"):

- Nền trời đêm: sao lấp lánh, trăng, dãy núi mờ phía xa.
- 1 con đường cong (SVG) chạy ngoằn ngoèo qua 5 điểm mốc, tô sáng dần bằng gradient xanh lá → tím → vàng đúng theo % tiến trình thật của người dùng (không phải hình tĩnh — mốc đạt càng nhiều, đường sáng càng dài).
- 5 nút tròn đánh số ở đúng vị trí mốc: mốc đã đạt có dấu tích, mốc đang hướng tới có ghim "📍 BẠN Ở ĐÂY", mốc chưa tới có khoá.
- Toà lâu đài 🏰 + cúp 🏆 ở đích đến cuối bản đồ, sáng rực và nhấp nháy khi đã đạt mốc cao nhất.
- Góc dưới-trái hiện nhanh "Bậc N/5" và % tổng tiến trình.

File chính: `src/pages/SavingsAchievements.jsx`, `src/styles.css` (tìm `savings-achv-map-v72`).

## 4. Thanh tiến trình trực quan cho dòng "Tổng đã tiết kiệm ... % chặng đường"

Dòng tổng kết ở đầu trang (trước đây chỉ có chữ, không có thanh) giờ có **thanh ngang hiển thị % tiến trình thật**, tô đậm hơn với gradient 3 màu xanh lá → tím → vàng kèm hiệu ứng phát sáng, để người dùng nhìn ngay được còn bao xa nữa tới mốc cao nhất mà không cần đọc số.

File chính: `src/styles.css` (tìm `savings-achv-overview-bar-v69`).

## 5. GroupCart — các nút hành động thẳng hàng giữa các thẻ nhóm

Trước đây, các thẻ nhóm có số dòng thành viên khác nhau (nhóm 2 người, nhóm 3 người...) khiến hàng nút "Xem nhóm / Chỉnh sửa / Mời bạn bè tham gia" bị lệch nhau theo chiều dọc giữa các thẻ. Giờ hàng nút này luôn được **neo xuống đúng đáy thẻ**, nên dù nội dung phía trên dài ngắn khác nhau, tất cả các thẻ trong cùng 1 hàng vẫn có nút thẳng hàng tuyệt đối — đã đo bằng script, toạ độ Y của các hàng nút trùng khớp 100%.

File chính: `src/styles.css` (tìm `groupcart-card-actions-v67`).

## 6. GroupCart — bấm "Chỉnh sửa"/"Xem nhóm" hiện dạng modal phóng to, không chuyển trang

Đây là thay đổi quan trọng nhất của bản này. Trước đây bấm "Chỉnh sửa" sẽ **chuyển hẳn sang một trang khác** — đúng như góp ý đã chỉ ra là chưa đúng ý. Giờ khi bấm "Xem nhóm" hoặc "Chỉnh sửa", nhóm đó sẽ **phóng to hiện ra ngay trên trang hiện tại dưới dạng modal**, có lớp nền mờ/tối phủ lên danh sách nhóm phía sau (danh sách nhóm vẫn còn nguyên trong nền, chỉ bị làm mờ đi), bấm ra ngoài vùng mờ hoặc bấm nút đóng (X) ở góc là quay lại danh sách — không còn cảm giác "nhảy trang" nữa.

File chính: `src/pages/GroupCart.jsx`, `src/styles.css` (tìm `groupcart-detail-backdrop-v72`).

## 7. GroupCart — làm mới giao diện hiện đại hơn

Thẻ nhóm giờ có dải màu gradient mảnh phía trên (xanh than → xanh lá, chuyển xanh → vàng khi nhóm đã hoàn tất), hiệu ứng nhấc nhẹ + đổ bóng khi rê chuột qua, avatar chữ cái đầu tên đổi từ nền cam phẳng sang gradient xanh than-xanh lá có đổ bóng — tổng thể trông đầy đặn và hiện đại hơn so với bản phẳng/đơn sắc trước đây.

File chính: `src/styles.css` (tìm `groupcart-card-v58`, `groupcart-avatar-v58`).

## 8. Lỗi phát sinh đã phát hiện và sửa thêm khi kiểm thử: icon Cawi Robo che khuất nội dung modal

Trong lúc chụp ảnh kiểm thử trên điện thoại, phát hiện: khi khung chat chào hỏi của Cawi Robo (icon robot nổi ở góc màn hình) bật lên đúng lúc modal chi tiết nhóm đang mở, icon này **đè lên trên modal** và che mất một phần số tiền của thành viên — do modal mới có độ ưu tiên hiển thị (z-index) thấp hơn icon Cawi Robo. Đã sửa để modal luôn nổi trên icon Cawi Robo, giống cách khung giỏ hàng đã làm từ trước — kiểm tra lại bằng ảnh chụp màn hình, không còn bị che nữa.

## Đã kiểm tra

Build sạch, cài mới hoàn toàn trong thư mục cô lập (`npm install && npm run build`) — không lỗi. Chạy lại toàn bộ 3 bộ kiểm thử Playwright: bộ kiểm thử nền tảng từ bản v69 (23 assertion), bộ kiểm thử riêng của bản v71 (9 assertion), và bộ kiểm thử mới cho toàn bộ thay đổi của bản v72 (15 assertion: icon giỏ hàng to/viền dày/nền trắng, giỏ hàng chỉ hiện khi mở, bản đồ game hiện đủ 5 mốc không bị cắt hình, thanh tiến trình có chiều cao rõ ràng, nút hành động thẳng hàng giữa các thẻ, modal nhóm mở/đóng đúng và không điều hướng trang, không có lỗi runtime) — tổng cộng **47/47 pass**. Đã chụp ảnh đối chiếu trên cả máy tính và điện thoại (390px), phát hiện và sửa thêm lỗi tràn ngang trên di động ở modal chỉnh sửa nhóm (dùng `min-width: 0` cho các khung Grid/Flex lồng nhau) và lỗi icon Cawi Robo che modal (mục 8 ở trên) — cả hai đã xác nhận hết lỗi bằng cả script đo và ảnh chụp màn hình thực tế.

## Lưu ý quan trọng về việc đưa code lên GitHub

Không có file hoàn toàn mới nào ở bản này (chỉ sửa file có sẵn), nhưng vì mục 1 ở trên nghi ngờ bản deploy hiện tại trên Vercel đã lệch so với code nguồn, lần này **rất khuyến khích** dùng GitHub Desktop hoặc xoá sạch toàn bộ file trên GitHub rồi kéo thả lại nguyên cả thư mục `v72` một lần, để đảm bảo bản demo trên mạng khớp 100% với code đã kiểm thử ở đây.
