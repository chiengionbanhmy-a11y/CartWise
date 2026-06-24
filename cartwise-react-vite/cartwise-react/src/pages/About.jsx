import { useState } from 'react';
import CawiRobot from '../components/CawiRobot.jsx';

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'team', label: 'Đội ngũ' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'robot', label: 'Robot CartWise' }
];

const content = {
  overview: {
    title: 'CartWise là gì?',
    body: 'CartWise là website so sánh giá thông minh giúp người dùng tìm sản phẩm, xem nơi bán rẻ hơn và nhận gợi ý mua sắm nhanh chóng.'
  },
  team: {
    title: 'Đội ngũ phát triển',
    body: 'CartWise được xây dựng bởi nhóm học sinh yêu thích AI, thiết kế sản phẩm và kinh doanh số. Mỗi thành viên phụ trách nghiên cứu khách hàng, sản phẩm, thiết kế, dữ liệu và truyền thông.'
  },
  contact: {
    title: 'Liên hệ',
    body: 'Bạn có thể liên hệ nhóm CartWise để góp ý sản phẩm, đề xuất điểm bán hoặc hợp tác phát triển dữ liệu so sánh giá.'
  },
  robot: {
    title: 'Cawi Robo - trợ lý mua sắm của CartWise',
    body: 'Cawi Robo là mascot độc quyền của CartWise. Robot hỗ trợ tư vấn sản phẩm, nhắc ưu đãi, gợi ý nơi bán rẻ nhất, nhìn theo chuột để tạo cảm giác tương tác và có thể đổi ngoại hình khi người dùng click nhiều lần.'
  }
};

function About() {
  const [active, setActive] = useState('overview');
  const data = content[active];
  return (
    <section className="section-block page-block about-page">
      <div className="section-heading center">
        <span className="eyebrow">About CartWise</span>
        <h1>Về chúng tôi</h1>
        <p>Mọi tab đều có trạng thái active rõ ràng để người dùng biết đang xem mục nào.</p>
      </div>
      <div className="about-tabs">
        {tabs.map((tab) => <button key={tab.id} className={active === tab.id ? 'about-tab active' : 'about-tab'} onClick={() => setActive(tab.id)}>{tab.label}</button>)}
      </div>
      <div className="about-card">
        <div>
          <span className="category-chip">{tabs.find((t) => t.id === active)?.label}</span>
          <h2>{data.title}</h2>
          <p>{data.body}</p>
          {active === 'robot' && (
            <ul className="feature-list">
              <li>Tư vấn sản phẩm khi mở so sánh giá.</li>
              <li>Nhắc nơi bán rẻ nhất và số tiền tiết kiệm.</li>
              <li>Mắt và đầu nhìn theo con trỏ chuột.</li>
              <li>Click 3 lần để đổi ngoại hình robot.</li>
            </ul>
          )}
        </div>
        <div className="about-robot-box">
          <CawiRobot mode="inline" message="Mình là Cawi Robo, trợ lý mua sắm của CartWise!" />
        </div>
      </div>
    </section>
  );
}

export default About;
