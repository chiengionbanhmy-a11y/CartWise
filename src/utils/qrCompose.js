// v67 — Ghép (burn-in) tên người cần chuyển khoản trực tiếp vào ảnh mã QR bằng
// canvas, thay vì chỉ dán đè bằng CSS như bản v66. Nhờ vậy khi ảnh được mở ở
// tab mới (bấm vào mã QR) hoặc được lưu về máy, tên vẫn nằm sẵn trong file ảnh.
//
// Lưu ý: ảnh QR gốc do server VietQR (img.vietqr.io) trả về — đây là ảnh của
// bên thứ ba, không cùng domain với CartWise. Trình duyệt chỉ cho phép đọc lại
// pixel của ảnh cross-origin để xuất ra canvas (toDataURL) nếu server đó gửi
// header CORS cho phép (Access-Control-Allow-Origin). Nếu VietQR không gửi
// header này, hàm dưới đây sẽ ném lỗi (SecurityError) — bên gọi cần tự bắt lỗi
// và dùng lại ảnh gốc (link trực tiếp tới img.vietqr.io) làm phương án dự phòng,
// để tính năng QR vẫn hoạt động bình thường dù không ghép được tên vào ảnh.
export function composeQrWithName(qrUrl, name) {
  return new Promise((resolve, reject) => {
    const cleanName = String(name || '').trim();
    if (!cleanName) {
      reject(new Error('missing-name'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no-canvas-context');
        ctx.drawImage(img, 0, 0);

        // Vị trí dán nhãn: khoảng trắng ngay dưới logo/badge VietQR, phía trên ô mã
        // QR — ước lượng theo tỉ lệ ảnh mẫu compact2 (540x640) trong tài liệu VietQR.
        // Đây là số ước lượng theo % chiều cao ảnh nên áp dụng được cho mọi cỡ ảnh.
        const bandCenterY = canvas.height * 0.145;
        const bandHeight = Math.max(30, canvas.height * 0.06);
        const maxPillWidth = canvas.width * 0.86;

        const fontSize = Math.max(16, Math.round(canvas.height * 0.03));
        ctx.font = `800 ${fontSize}px "Segoe UI", Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const label = cleanName;
        const textWidth = ctx.measureText(label).width;
        const pillWidth = Math.min(maxPillWidth, textWidth + canvas.width * 0.09);
        const pillX = (canvas.width - pillWidth) / 2;
        const pillY = bandCenterY - bandHeight / 2;
        const radius = bandHeight / 2;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pillX + radius, pillY);
        ctx.arcTo(pillX + pillWidth, pillY, pillX + pillWidth, pillY + bandHeight, radius);
        ctx.arcTo(pillX + pillWidth, pillY + bandHeight, pillX, pillY + bandHeight, radius);
        ctx.arcTo(pillX, pillY + bandHeight, pillX, pillY, radius);
        ctx.arcTo(pillX, pillY, pillX + pillWidth, pillY, radius);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(pillX, pillY, pillX + pillWidth, pillY);
        gradient.addColorStop(0, '#fb923c');
        gradient.addColorStop(1, '#ea580c');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.lineWidth = Math.max(1.5, canvas.height * 0.0022);
        ctx.strokeStyle = 'rgba(255,255,255,.92)';
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, canvas.width / 2, bandCenterY + fontSize * 0.04);

        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('image-load-failed'));
    img.src = qrUrl;
  });
}
