# CartWise MVP v57 — Clarity & Plan Alignment

## Mục tiêu
Bản này cập nhật MVP theo Business Plan Vòng 3 và làm rõ hai khái niệm dễ nhầm:
- **Lịch sử kiểm tra giá**: sản phẩm người dùng đã mở bảng so sánh giá/tổng chi phí dự kiến.
- **Lịch sử mua hàng**: sản phẩm/đơn hàng người dùng đã mua và chi tiêu thực tế.

## Gói
- **Miễn phí**: lịch sử kiểm tra giá 7/30 ngày; thống kê mua hàng 7 ngày.
- **CartWise Plus Student — 19.000đ/tháng**: lịch sử kiểm tra giá 90/180 ngày; cảnh báo giảm giá; thống kê mua hàng 30 ngày.
- **CartWise Plus — 49.000đ/tháng**: lịch sử kiểm tra giá 90/180 ngày; cảnh báo thông minh; thống kê mua hàng tối đa 1 năm; không quảng cáo.

> Đây là logic demo MVP. Dữ liệu mua hàng và giá trong prototype là dữ liệu mô phỏng, không phải dữ liệu real-time.

## Các route chính
- `home`
- `flash`
- `stores`
- `about`
- `upgrade`
- `profile`
- `check-history`
- `purchase-history`

## Chạy local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Ghi chú
Các nút chọn gói trong demo chỉ mô phỏng thay đổi quyền lợi bằng localStorage (`cartwise-plan`). Chưa tích hợp cổng thanh toán thật.
