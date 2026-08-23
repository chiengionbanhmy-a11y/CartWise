import { useState } from 'react';
import CawiRobot from '../components/CawiRobot.jsx';

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'team', label: 'Đội ngũ' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'robot', label: 'Robot CartWise' }
];

// v75 — Cập nhật đội ngũ đầy đủ họ tên + vai trò + nhiệm vụ cụ thể ứng với từng vai
// trò, kèm ảnh từng thành viên (đã cắt nền, để trong public/team/). Giữ đúng thứ tự
// trái sang phải theo góp ý: Nhật Linh - Quý Đức - Lê Minh - Hà An - Minh Hữu.
const teamMembers = [
  {
    name: 'Trần Nguyễn Nhật Linh',
    role: 'AI & Media Lead / Leader',
    photo: '/team/nhat-linh.png',
    duties: [
      'Điều phối tiến độ chung và định hướng chiến lược sản phẩm của cả nhóm',
      'Phụ trách xây dựng trợ lý AI Cawi Robo',
      'Phụ trách nội dung truyền thông, hình ảnh thương hiệu CartWise'
    ]
  },
  {
    name: 'Dương Quý Đức',
    role: 'Researcher',
    photo: '/team/quy-duc.png',
    duties: [
      'Nghiên cứu thị trường và khảo sát nhu cầu người dùng thực tế',
      'Phân tích đối thủ cạnh tranh trong mảng so sánh giá',
      'Tổng hợp dữ liệu để định hướng tính năng cho sản phẩm'
    ]
  },
  {
    name: 'Đỗ Vũ Lê Minh',
    role: 'Designer',
    photo: '/team/le-minh.png',
    duties: [
      'Thiết kế giao diện (UI/UX) cho toàn bộ website CartWise',
      'Xây dựng bộ nhận diện thương hiệu, mascot Cawi Robo',
      'Đảm bảo trải nghiệm người dùng trực quan, nhất quán'
    ]
  },
  {
    name: 'Nguyễn Hà An',
    role: 'Business Analyst',
    photo: '/team/ha-an.png',
    duties: [
      'Phân tích mô hình kinh doanh và bài toán tài chính của dự án',
      'Đánh giá tính khả thi, xây dựng kế hoạch phát triển thị trường',
      'Chuẩn bị số liệu, luận điểm cho phần thuyết trình gọi vốn'
    ]
  },
  {
    name: 'Nguyễn Minh Hữu',
    role: 'Product Manager',
    photo: '/team/minh-huu.png',
    duties: [
      'Quản lý lộ trình phát triển và ưu tiên tính năng sản phẩm',
      'Kết nối, tổng hợp công việc giữa các thành viên trong nhóm',
      'Đảm bảo sản phẩm bám sát đúng nhu cầu người dùng và mục tiêu nhóm'
    ]
  }
];

const overviewHighlights = [
  { title: 'So sánh đa kênh', text: 'Đối chiếu cùng một sản phẩm giữa sàn TMĐT và cửa hàng bán lẻ để người dùng nhìn thấy lựa chọn rõ ràng hơn.' },
  { title: 'Chi phí gần thực tế', text: 'Không chỉ nhìn giá niêm yết, CartWise còn cộng thêm phí vận chuyển ước tính để phản ánh tổng chi phí dự kiến.' },
  { title: 'Voucher tách riêng', text: 'Voucher cá nhân có thể nhập thủ công nếu có, nhưng kết quả sau voucher luôn tách riêng khỏi bảng so sánh công bằng.' }
];

const content = {
  overview: {
    title: 'CartWise giúp bạn nhìn tổng chi phí rõ hơn',
    body: 'CartWise là ứng dụng hỗ trợ mua sắm thông minh, giúp người dùng so sánh tổng chi phí dự kiến của cùng một sản phẩm giữa nhiều nền tảng mua sắm online và cửa hàng bán lẻ. Ứng dụng không chỉ hiển thị giá niêm yết, mà còn cộng thêm phí vận chuyển ước tính để người dùng có cái nhìn gần thực tế hơn trước khi mua. Với voucher cá nhân, người dùng có thể nhập thủ công nếu có, nhưng kết quả sau voucher sẽ được tách riêng khỏi bảng so sánh công bằng.'
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
      <div className={`about-card ${active !== 'robot' ? 'about-card-no-robot-v43' : ''}`}>
        <div>
          <span className="category-chip">{tabs.find((t) => t.id === active)?.label}</span>
          <h2>{data.title}</h2>
          {active === 'overview' ? (
            <div className="overview-layout-v35">
              <div className="overview-intro-v35">
                <p>CartWise là ứng dụng hỗ trợ mua sắm thông minh, giúp người dùng so sánh <strong>tổng chi phí dự kiến</strong> của cùng một sản phẩm giữa nhiều nền tảng mua sắm online và cửa hàng bán lẻ.</p>
                <p>Ứng dụng không chỉ hiển thị giá niêm yết, mà còn cộng thêm <strong>phí vận chuyển ước tính</strong> để người dùng có cái nhìn gần thực tế hơn trước khi mua.</p>
                <p>Với voucher cá nhân, người dùng có thể nhập thủ công nếu có, nhưng <strong>kết quả sau voucher luôn được tách riêng</strong> khỏi bảng so sánh công bằng.</p>
              </div>
              <div className="overview-grid-v35">
                {overviewHighlights.map((item) => (
                  <article key={item.title} className="overview-card-v35">
                    <span className="overview-badge-v35">{item.title}</span>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <p>{data.body}</p>
          )}
          {active === 'team' && (
            <div className="team-grid-v75">
              {teamMembers.map((member) => (
                <article key={member.name} className="team-card-v75">
                  <div className="team-card-photo-v75">
                    <img src={member.photo} alt={member.name} loading="lazy" />
                  </div>
                  <div className="team-card-body-v75">
                    <strong>{member.name}</strong>
                    <span className="team-card-role-v75">{member.role}</span>
                    <ul className="team-card-duties-v75">
                      {member.duties.map((duty) => <li key={duty}>{duty}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          )}
          {active === 'robot' && (
            <>
              <ul className="feature-list">
                <li>Tư vấn sản phẩm khi mở so sánh giá.</li>
                <li>Nhắc nơi bán có tổng chi phí dự kiến thấp nhất.</li>
                <li>Mắt và đầu nhìn theo con trỏ chuột.</li>
                <li>Có thể kéo thả Cawi Robo sang vị trí khác trên màn hình, kể cả trong phần so sánh giá.</li>
                <li>Click 1 lần để mở khung chat, click 2 lần liên tiếp để đổi màu robot.</li>
                <li>Người dùng có thể nhập câu hỏi tự do để trò chuyện với robot theo kiểu trợ lý mua sắm thông minh.</li>
              </ul>
              <div className="robot-tip-card-v35">
                <strong>Mẹo dùng nhanh</strong>
                <span>Click 1 lần mở khung chat · Click 2 lần liên tiếp robot sẽ đổi màu · Kéo thả để đổi vị trí robot.</span>
              </div>
            </>
          )}
        </div>
        {active === 'robot' && (
          <div className="about-robot-box">
            <CawiRobot mode="inline" message="Mẹo nhỏ: Click 1 lần để mở khung chat, click 2 lần liên tiếp để đổi màu robot nhé!" />
          </div>
        )}
      </div>
    </section>
  );
}

export default About;
