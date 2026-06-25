import { useState } from 'react';

const tabs = {
  overview: {
    title: 'Tổng quan',
    body: 'CartWise là ứng dụng hỗ trợ mua sắm thông minh, giúp người dùng so sánh giá, phí vận chuyển, voucher và lựa chọn nơi mua phù hợp hơn.'
  },
  team: {
    title: 'Đội ngũ',
    body: 'Nhóm tập trung vào nghiên cứu khách hàng, sản phẩm, thiết kế prototype, AI và phân tích kinh doanh để phát triển CartWise theo hướng thực tế.'
  },
  robot: {
    title: 'Robot CartWise',
    body: 'Cawi Robo là trợ lý mua sắm trên website. Ở bản này robot đã được khôi phục về form cũ, bỏ quai cầm, giữ phần thân dưới cũ và tích hợp chat input mới.'
  }
};

function About() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="page-stack">
      <section className="simple-hero about">
        <span className="eyebrow">About CartWise</span>
        <h1>Mua sắm minh bạch hơn, tiết kiệm hơn</h1>
        <p>CartWise hướng tới việc giúp người dùng ra quyết định mua hàng dựa trên dữ liệu và tiêu chí rõ ràng.</p>
      </section>
      <section className="about-tabs">
        <div className="tab-buttons">
          {Object.entries(tabs).map(([key, item]) => <button key={key} type="button" className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{item.title}</button>)}
        </div>
        <article>
          <h2>{tabs[tab].title}</h2>
          <p>{tabs[tab].body}</p>
          <div className="about-metrics">
            <span><b>15đ</b>Prototype/Demo</span>
            <span><b>15đ</b>Ứng dụng AI</span>
            <span><b>5đ</b>Điều chỉnh sau feedback</span>
          </div>
        </article>
      </section>
    </div>
  );
}

export default About;
