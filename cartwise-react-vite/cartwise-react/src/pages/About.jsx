import { useState } from 'react';
import CawiRobot from '../components/CawiRobot.jsx';

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'team', label: 'Đội ngũ' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'robot', label: 'Robot CartWise' }
];

const teamMembers = [
  { name: 'Nhật Linh', role: 'Leader / Product Direction' },
  { name: 'Lê Minh', role: 'Research & Data' },
  { name: 'Hà An', role: 'An là mặt trời nhỏ' },
  { name: 'Hữu', role: 'Technology Support' },
  { name: 'Đức', role: 'Design & Testing' }
];

const content = {
  overview: {
    title: 'CartWise là gì?',
    body: 'CartWise là website so sánh giá thông minh giúp người dùng tìm sản phẩm, xem nơi bán tiết kiệm hơn và ước tính tổng chi phí dự kiến trước khi mua.'
  },
  team: {
    title: 'Đội ngũ phát triển',
    body: 'CartWise được xây dựng bởi 5 thành viên cùng phụ trách nghiên cứu khách hàng, sản phẩm, thiết kế, dữ liệu và truyền thông.'
  },
  contact: {
    title: 'Liên hệ',
    body: 'Trần Nguyễn Nhật Linh - Leader of CartWise. Bạn có thể liên hệ để góp ý sản phẩm, đề xuất điểm bán hoặc hợp tác phát triển dữ liệu so sánh giá.'
  },
  robot: {
    title: 'Cawi Robo - trợ lý mua sắm của CartWise',
    body: 'Cawi Robo là mascot độc quyền của CartWise. Robot hỗ trợ tư vấn sản phẩm, nhắc ưu đãi, gợi ý nơi bán rẻ hơn, nhìn theo chuột và có thể kéo thả vị trí trên màn hình.'
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
        <p>CartWise hướng tới một trải nghiệm so sánh giá rõ ràng, đáng tin cậy và dễ dùng.</p>
      </div>
      <div className="about-tabs">
        {tabs.map((tab) => <button key={tab.id} className={active === tab.id ? 'about-tab active' : 'about-tab'} onClick={() => setActive(tab.id)}>{tab.label}</button>)}
      </div>
      <div className="about-card">
        <div>
          <span className="category-chip">{tabs.find((t) => t.id === active)?.label}</span>
          <h2>{data.title}</h2>
          <p>{data.body}</p>
          {active === 'team' && (
            <div className="team-grid-v30">
              {teamMembers.map((member) => (
                <article key={member.name} className="team-card-v30">
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </article>
              ))}
            </div>
          )}
          {active === 'robot' && (
            <ul className="feature-list">
              <li>Tư vấn sản phẩm khi mở so sánh giá.</li>
              <li>Nhắc nơi bán có tổng chi phí dự kiến thấp nhất.</li>
              <li>Mắt và đầu nhìn theo con trỏ chuột.</li>
              <li>Có thể kéo thả Cawi Robo sang vị trí khác trên màn hình.</li>
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
