# CartWise v13.1 - Chat input + Robot update

Bản này được tích hợp theo yêu cầu mới:

- Giữ cấu trúc React + Vite của bản CartWise v13.
- Nâng cấp ô nhập chat theo hình mới: nền navy bo tròn dài, robot mini bên trái, placeholder “Nhập câu hỏi của bạn...”, micro rõ hơn, nút gửi tròn trắng mũi tên hướng lên.
- Khôi phục robot về form cũ, bỏ quai cầm/handle hoàn toàn.
- Giữ phần thân dưới robot kiểu cũ: thân bo tròn, lõi cam, 2 bánh xe.
- Giữ hiệu ứng mắt robot nhìn theo chuột.
- Chat panel vẫn có thể kéo thả bằng header và resize bằng góc cửa sổ.
- Có Web Speech API để micro chuyển giọng nói thành văn bản trên trình duyệt hỗ trợ như Chrome/Edge.

## Cách chạy

```bash
npm install
npm run dev
```

Sau đó mở link Vite hiện ra trong terminal, thường là:

```bash
http://localhost:5173
```

## File đã chỉnh chính

- `src/components/CawiRobot.jsx`
- `src/styles.css`, các phần:
  - `.cawi-chat-input-shell`
  - `.cawi-mic-button`
  - `.cawi-send-button`
  - `.cawi-shape`, `.mini-cawi`
  - `.cawi-lower-body-old`

## Ghi chú triển khai

Trong `CawiRobot.jsx`, phần robot có comment rõ:

```jsx
{/* Robot bản cũ: đã bỏ hoàn toàn quai cầm/handle, giữ phần thân dưới cũ. */}
```

Trong CSS cũng có comment rõ vùng robot và input để bạn dễ chỉnh tiếp.
