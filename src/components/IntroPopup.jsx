import { ArrowRight } from 'lucide-react';

function IntroPopup({ onClose }) {
  return (
    <div className="intro-backdrop-v55" role="dialog" aria-modal="true" aria-label="Sơ qua về Cartwise">
      <section className="intro-card-v55">
        <span className="intro-eyebrow-v55">CartWise</span>
        <h2>Sơ qua về Cartwise</h2>
        <p>
          Việc mà phải chọn lựa cùng một loại sản phẩm qua rất nhiều nơi, tìm ra chỗ nào bán rẻ nhất trong tất cả các điểm bán đã khiến cho thời gian bị mất đi một cách oan uổng và lãng phí và đang là lỗ hổng chưa ai vá trong thị trường. Vì vậy, chúng tôi đã cùng nhau phát minh ra ứng dụng Cartwise- nơi mà người dùng có thể tiết kiệm thời gian và tiền bạc của bản thân cho những việc quan trọng hơn, đồng thời để lấp lỗ hổng mà ít ai nhắm tới để tạo nên một xã hội và nền kinh tế phát triển hơn.
        </p>
        <button className="intro-arrow-v55" onClick={onClose} aria-label="Tiếp tục vào CartWise">
          <ArrowRight size={30} />
        </button>
      </section>
    </div>
  );
}

export default IntroPopup;
