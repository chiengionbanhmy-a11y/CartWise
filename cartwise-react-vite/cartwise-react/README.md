# CartWise Demo Website

Đây là bản web demo CartWise bằng React + Vite, dễ chỉnh sửa và có thể deploy lên Vercel/Netlify để lấy link web thật.

## Tính năng có sẵn

- Trang chủ có tìm kiếm sản phẩm.
- Flash Sale dạng tab hàng ngang.
- Điểm bán có nút “Xem”, mở sản phẩm theo nhóm.
- Popup chi tiết/so sánh sản phẩm có ảnh, bảng giá, nơi rẻ nhất, dòng “Tiết kiệm lên tới...”, đếm ngược ưu đãi.
- Quy đổi tiền tệ nhanh trong chi tiết sản phẩm: VND, USD, CNY, EUR, JPY, KRW.
- Cawi Robo: mascot riêng bằng CSS, nhìn theo chuột, click 3 lần đổi ngoại hình, tự đổi vị trí sau 10 giây không tương tác.
- Phần “Về chúng tôi” có tab: Tổng quan, Đội ngũ, Liên hệ, Robot CartWise.
- Cài đặt tài khoản: đổi tên, avatar, ngôn ngữ, đơn vị tiền tệ; yêu cầu đăng nhập demo trước khi chỉnh.
- Popup quảng cáo khi vừa vào trang.

## Cách chạy trên máy

```bash
npm install
npm run dev
```

Sau đó mở link Vite hiển thị trong terminal, thường là:

```bash
http://localhost:5173
```

## Cách sửa nhanh

- Sửa sản phẩm: `src/data/products.js`
- Sửa tỷ giá: `src/data/products.js`, biến `exchangeRates`
- Sửa robot: `src/components/CawiRobot.jsx` và CSS phần `.cawi` trong `src/styles.css`
- Sửa chi tiết sản phẩm: `src/components/ProductModal.jsx`
- Sửa cài đặt: `src/components/SettingsPanel.jsx`
- Sửa trang chủ: `src/pages/Home.jsx`
- Sửa Flash Sale: `src/pages/FlashSale.jsx`
- Sửa Điểm bán: `src/pages/Stores.jsx`
- Sửa Về chúng tôi: `src/pages/About.jsx`

## Cách deploy để có link web thật bằng Vercel

1. Tạo tài khoản tại Vercel.
2. Tạo GitHub repository và upload toàn bộ thư mục này lên.
3. Vào Vercel → Add New Project → chọn repository CartWise.
4. Giữ lệnh build mặc định:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Bấm Deploy.
6. Vercel sẽ tạo link web thật dạng `https://ten-du-an.vercel.app`.

## Cách deploy bằng Netlify

1. Vào Netlify.
2. Chọn Add new site → Import from Git.
3. Chọn repository CartWise.
4. Build command: `npm run build`.
5. Publish directory: `dist`.
6. Bấm Deploy.
