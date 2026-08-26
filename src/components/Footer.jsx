// v81 — Footer cuối trang: tên web, logo, các trang thật đang có sẵn (không bịa
// thêm số điện thoại, địa chỉ công ty hay mạng xã hội chưa tồn tại) — đúng yêu cầu
// "chỉ hiển thị những thông tin đúng và cần thiết, đã có hiện tại", lấy cảm hứng
// bố cục từ ảnh tham khảo webSoSanh.vn nhưng nội dung 100% là của CartWise.
function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer-v81">
      <div className="site-footer-inner-v81">
        <div className="site-footer-brand-v81">
          <img src="/cartwise-logo-icon-v4.png" alt="CartWise" />
          <div>
            <strong>CartWise</strong>
            <span>So sánh tổng chi phí mua sắm — giá sản phẩm và phí vận chuyển, nhiều nơi bán trong một màn hình.</span>
          </div>
        </div>

        <div className="site-footer-col-v81">
          <h4>Khám phá</h4>
          <button type="button" onClick={() => onNavigate('home')}>Trang chủ</button>
          <button type="button" onClick={() => onNavigate('flash')}>Flash Sale</button>
          <button type="button" onClick={() => onNavigate('group-cart')}>Ghép Đơn Cùng Bạn Bè</button>
          <button type="button" onClick={() => onNavigate('savings-achievements')}>Thành tựu tiết kiệm</button>
        </div>

        <div className="site-footer-col-v81">
          <h4>Về CartWise</h4>
          <button type="button" onClick={() => onNavigate('about')}>Giới thiệu &amp; Đội ngũ</button>
          <button type="button" onClick={() => onNavigate('upgrade')}>Nâng cấp ứng dụng</button>
        </div>

        <div className="site-footer-col-v81">
          <h4>Liên hệ</h4>
          <span>Trần Nguyễn Nhật Linh — Leader of CartWise</span>
          <span className="site-footer-note-v81">Dự án của học sinh THPT, tham gia The NextX 2026 — dữ liệu sản phẩm/giá là dữ liệu minh hoạ, chưa xử lý thanh toán hay đơn hàng thật.</span>
        </div>
      </div>

      <div className="site-footer-bottom-v81">
        <span>© {year} CartWise · Đội Odd Ones</span>
      </div>
    </footer>
  );
}

export default Footer;
