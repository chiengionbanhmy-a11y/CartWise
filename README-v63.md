# CartWise MVP v63 — Bản cải tiến Vòng 4: bỏ Dạo siêu thị, thêm 6 tính năng mới

## Mục tiêu
Bản này triển khai đúng nội dung **Báo cáo cải tiến Vòng 4**, trả lời 2 nhận xét chính của Ban Giám khảo ở Vòng 3:

1. *"Sản phẩm chưa khác biệt nhiều so với việc tự tìm kiếm trên Google."* → 6 tính năng mới đều là bài toán **không thể làm thủ công bằng vài lần tìm kiếm** (tính điểm xu hướng giá 180 ngày, tối ưu tổ hợp nhiều sản phẩm × nhiều sàn, gộp đánh giá đa nguồn...).
2. *"Chưa rõ giá trị độc bản, phân khúc khách hàng, kênh doanh thu."* → Toàn bộ 6 tính năng được gắn trực tiếp vào 3 gói (Free / CartWise Plus Student 19k / CartWise Plus 49k) làm rõ ai trả tiền để đổi lấy gì.

## Đã bỏ: "Dạo siêu thị"
Gỡ hoàn toàn trang, route, mục menu và CSS liên quan — không còn tham chiếu nào trong code.

## 6 tính năng mới (đúng thứ tự Mục 3–4 báo cáo)

| # | Tính năng | File chính | Free | Student (19k) | Plus (49k) |
|---|---|---|---|---|---|
| 1 | **Cawi Tín Hiệu Mua** | `components/BuySignalCard.jsx`, `data/products.js` (`getBuySignal`) | Khoá (mờ + nút nâng cấp) | Khoá | Mở, dựa trên lịch sử giá tối đa 180 ngày |
| 2 | ~~Giỏ Hàng Tối Ưu~~ | *(đã gỡ bỏ ở bản v64, xem `README-v64.md`)* | — | — | — |
| 3 | **Cawi Cố Vấn Chi Tiêu** | `components/SpendingAdvisorCard.jsx`, `data/purchases.js` (`computeSpendingAdvice`) | Khoá | Khoá | Mở, cần ≥30 ngày dữ liệu mua hàng |
| 4 | **Bộ đếm "Số tiền đã tiết kiệm"** | `components/SavingsCounter.jsx`, `data/purchases.js` | 1 dòng đơn giản ở trang Hồ sơ | Widget nổi bật ở trang chủ, huy hiệu giới hạn | Như Student, huy hiệu không giới hạn |
| 5 | **Cawi Đánh Giá Tổng Hợp** | `components/ReviewQuickPreview.jsx`, `data/reviews.js` (`getCrossPlatformBreakdown`) | Miễn phí cho mọi gói (không paywall) | Miễn phí | Miễn phí |
| 6 | **Nhóm Góp Tiền** | `pages/GroupCart.jsx`, `components/PaymentQrMock.jsx` | Tối đa 3 nhóm/tháng | Không giới hạn nhóm + QR | Không giới hạn nhóm + QR |

Toàn bộ cơ chế khoá/mở gói nằm tập trung trong `src/data/plans.js` (`PLAN_DETAILS`) — đổi quyền lợi từng gói chỉ cần sửa 1 file này.

## Về QR thanh toán trong "Nhóm Góp Tiền"
Đây là **QR minh hoạ (demo)**, không phải tích hợp thanh toán thật — có nhãn "Demo minh hoạ" và dòng cảnh báo rõ ràng trên giao diện. Đúng như báo cáo đã nêu: CartWise **không giữ tiền và không đóng vai trò trung gian thanh toán** ở giai đoạn này.

## Dữ liệu là mô phỏng (demo), không gọi AI trả phí
Tất cả thuật toán mới (tín hiệu mua, cố vấn chi tiêu, chia đơn tối ưu) đều là **công thức minh bạch tự tính toán trên dữ liệu có sẵn** — không gọi API AI nào, giữ đúng nguyên tắc "không phát sinh chi phí AI" đã có từ v37. Lịch sử giá, lịch sử mua hàng, phí vận chuyển ước tính dùng cho Giỏ Hàng Tối Ưu đều là dữ liệu mô phỏng có ghi chú rõ trên giao diện.

## Sửa lỗi dịch ngôn ngữ (uiTranslator.js)
Phát hiện và sửa tận gốc lỗi: các con số/đếm động (số sản phẩm trong giỏ, số tiền đã tiết kiệm, số người đã thanh toán...) bị "đứng yên" không cập nhật khi giao diện đang ở tiếng Việt. Nguyên nhân là bộ dịch tự động từng hiểu nhầm "nội dung vừa được app cập nhật" thành "nội dung cần khôi phục về bản gốc đã lưu". Đã sửa để bộ dịch chỉ khôi phục đúng những gì chính nó từng dịch, không còn ghi đè lên số liệu động của app.

## Không thêm dependency mới
Vẫn chỉ dùng React + lucide-react + localStorage — build/deploy trên Vercel như bình thường, không cần biến môi trường mới.
