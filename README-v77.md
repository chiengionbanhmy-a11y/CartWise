# CartWise — Bản giao code v77

## Dời đăng nhập/đăng ký/đăng xuất vào menu 3 gạch

Theo yêu cầu: bỏ hẳn cụm đăng nhập/đăng ký (khi chưa đăng nhập) hoặc hồ sơ/đăng xuất (khi đã đăng nhập) khỏi thanh nav chính — vì trông thừa, đồng thời làm nút "Đăng nhập" nổi bật hơn hẳn các mục khác.

### 1. Đã thay đổi gì

- **Thanh nav trên cùng:** không còn hiện nút "Đăng nhập" / "Đăng ký" (chưa đăng nhập) hay thẻ hồ sơ + "Đăng xuất" (đã đăng nhập) nữa. Thanh nav giờ chỉ còn: các mục điều hướng, chuông thông báo, và nút menu 3 gạch — gọn hơn hẳn.
- **Menu 3 gạch:** thêm khối tài khoản ngay đầu menu (dưới tiêu đề "CartWise"), trước cả danh sách các trang:
  - **Chưa đăng nhập:** nút **"Đăng nhập"** cố tình làm nổi bật — nền gradient cam giống các nút hành động chính trong app (ví dụ nút "Bắt đầu chơi" ở minigame), to và nằm trên cùng khối. Ngay dưới là nút "Đăng ký" ở dạng phụ (nền xám nhạt, giống các mục khác trong menu).
  - **Đã đăng nhập:** một thẻ tài khoản hiện avatar + tên (bấm vào để mở trang Hồ sơ), và ngay dưới là dòng "Đăng xuất" ở dạng phụ.
- Hành vi này áp dụng **cả trên desktop lẫn mobile** — vì menu 3 gạch dùng chung 1 component cho cả 2 kích thước màn hình, chỉ khác cách hiển thị (menu nhỏ nổi ở góc trên desktop, toàn màn hình trên mobile).

### 2. Vì sao đúng ý định ban đầu

Trước v77, trên **màn hình mobile (≤760px)**, cụm đăng nhập/đăng ký ở thanh nav trên cùng thực ra đã bị ẩn hoàn toàn theo CSS cũ (chỉ hiện trên desktop), nghĩa là người dùng mobile trước đó **không có cách nào đăng nhập được**. Việc dời cụm này vào menu 3 gạch vừa đáp ứng đúng yêu cầu (bớt thừa trên thanh nav chính, làm đăng nhập nổi bật hơn), vừa tiện thể khắc phục luôn lỗ hổng đó cho người dùng mobile.

### 3. Các file đã sửa

- `src/components/Navbar.jsx` — bỏ cụm đăng nhập/đăng ký/hồ sơ/đăng xuất khỏi `nav-actions`, thêm khối `mobile-auth-block-v77` (nút "Đăng nhập" nổi bật hoặc thẻ tài khoản + "Đăng xuất") vào đầu menu 3 gạch.
- `src/styles.css` — thêm các class mới `.mobile-auth-block-v77`, `.auth-login-row-v77` (nút nổi bật, nền gradient cam), `.auth-account-row-v77` + `.auth-account-avatar-v77` + `.auth-account-info-v77` (thẻ tài khoản), kèm điều chỉnh riêng cho màn hình mobile để khớp phong cách các mục khác trong menu.

### 4. Đã kiểm tra kỹ trước khi giao

- Build production sạch, không lỗi — kiểm tra 2 lần: 1 lần ngay sau khi sửa, 1 lần cuối từ chính file zip sắp giao (giải nén hoàn toàn mới).
- Kiểm thử tự động (Playwright): xác nhận thanh nav trên cùng không còn chữ "Đăng nhập/Đăng ký/Đăng xuất" và không còn nút hồ sơ; mở menu 3 gạch khi chưa đăng nhập thấy đúng nút "Đăng nhập" nổi bật (nền gradient) + "Đăng ký"; bấm "Đăng nhập" mở đúng hộp thoại đăng nhập; sau khi đăng nhập thành công, menu 3 gạch chuyển đúng sang hiện thẻ tài khoản + "Đăng xuất"; bấm "Đăng xuất" quay lại đúng trạng thái ban đầu — không phát sinh lỗi runtime.
- Kiểm tra lại toàn bộ 24 bước kiểm thử của minigame "Cawi Đố Giá" (v76) trên đúng bản build này — vẫn pass 24/24, không có gì bị ảnh hưởng.
- Kiểm tra mobile (390px): khối đăng nhập/đăng ký hiển thị gọn gàng, không tràn ngang, không phát sinh lỗi.
