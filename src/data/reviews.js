// v58 — Dữ liệu đánh giá đa nguồn + tóm tắt AI (bài toán AI thứ 2 của CartWise).
//
// Kiến trúc: đúng cơ chế đã dùng cho bài toán AI thứ 1 (nhận diện sản phẩm trùng) —
// AI chỉ được gọi 1 LẦN khi hệ thống thu thập đủ review cho một sản phẩm, kết quả
// tóm tắt (pros/cons) được lưu lại (cache) tại đây và tái sử dụng cho mọi lượt xem.
// Trong bản demo MVP, "cache" này là dữ liệu tĩnh viết sẵn — không gọi API AI thật,
// không phát sinh chi phí, không cần OPENAI/ANTHROPIC_API_KEY (giữ đúng triết lý
// "không phát sinh chi phí AI" mà bản v37 đã đặt ra cho Cawi Robo).
//
// v82 — Theo yêu cầu: mỗi sản phẩm giờ tổng hợp 4-5 đánh giá mẫu (rawReviews, trước
// đây 3-4), và TỐI THIỂU 2 đánh giá mỗi sản phẩm có kèm ảnh/video minh hoạ (field
// `media`). Vì CartWise chưa có backend lưu ảnh/video thật do người mua tự đăng,
// ảnh minh hoạ dùng lại đúng ảnh sản phẩm đã có sẵn — luôn gắn rõ nhãn "Ảnh minh
// hoạ (demo)" / "Video minh hoạ (demo)" ở giao diện (AIReviewSummary.jsx), KHÔNG
// trình bày như ảnh/video thật do khách hàng tự chụp, đúng nguyên tắc minh bạch dữ
// liệu demo đã áp dụng xuyên suốt dự án (QR nhóm, lịch sử mua hàng, biểu đồ giá...).
const img = (name) => new URL(`../assets/products/${name}`, import.meta.url).href;

export const reviewsData = {
  'mouse-logitech': {
    reviewCount: 214,
    sourceCount: 3,
    lastUpdated: '2026-08-14',
    rawReviews: [
      { store: 'Shopee', rating: 5, author: 'ngoc_tran**', text: 'Chuột êm tay, bấm không nghe tiếng, dùng cả ngày không mỏi cổ tay.', media: { type: 'image', src: img('logitech-m331.jpg'), caption: 'Ảnh minh hoạ (demo)' } },
      { store: 'Lazada', rating: 4, author: 'minh.dev**', text: 'Kết nối ổn định qua USB receiver, pin dùng gần 2 năm chưa phải thay.' },
      { store: 'Shopee', rating: 3, author: 'hoa_bui**', text: 'Form hơi to với tay mình (tay nhỏ), cầm hơi cấn lúc đầu.' },
      { store: 'Tiki', rating: 5, author: 'quan_le**', text: 'Mua cho em học sinh dùng học online, nhẹ, dễ mang theo balo.', media: { type: 'video', src: img('logitech-m331.jpg'), duration: '0:28', caption: 'Video minh hoạ (demo)' } }
    ],
    aiSummary: {
      pros: [
        'Click êm, gần như không phát tiếng — phù hợp phòng học/thư viện',
        'Pin rất trâu, nhiều người dùng báo gần 2 năm chưa thay pin',
        'Nhỏ gọn, dễ mang theo khi đi học'
      ],
      cons: [
        'Form dáng hơi to với người tay nhỏ, cần thời gian làm quen',
        'Không có phiên bản đi kèm dây dự phòng khi hết pin gấp'
      ]
    }
  },

  'powerbank-anker': {
    reviewCount: 356,
    sourceCount: 3,
    lastUpdated: '2026-08-12',
    rawReviews: [
      { store: 'Shopee', rating: 5, author: 'phong_it**', text: 'Sạc nhanh, dùng thương hiệu Anker nên yên tâm về an toàn pin.', media: { type: 'image', src: img('anker-powercore.jpg'), caption: 'Ảnh minh hoạ (demo)' } },
      { store: 'Lazada', rating: 4, author: 'trang2005**', text: 'Nhỏ gọn bỏ vừa túi áo khoác, sạc được điện thoại gần 2 lần đầy.' },
      { store: 'Tiki', rating: 3, author: 'duc_pham**', text: 'Không kèm cáp sạc dài, phải mua thêm cáp mới tiện dùng.' },
      { store: 'Shopee', rating: 5, author: 'lan.a**', text: 'Mang đi học cả ngày không lo hết pin điện thoại nữa.', media: { type: 'video', src: img('anker-powercore.jpg'), duration: '0:41', caption: 'Video minh hoạ (demo)' } }
    ],
    aiSummary: {
      pros: [
        'Thương hiệu uy tín, nhiều người nhận xét an toàn khi sạc lâu',
        'Kích thước nhỏ gọn, tiện mang theo đi học/đi làm',
        'Sạc được điện thoại gần 2 lần đầy pin theo phản hồi người dùng'
      ],
      cons: [
        'Không kèm sẵn cáp sạc dài, cần mua thêm phụ kiện',
        'Tốc độ sạc đầy pin dự phòng qua cổng thường hơi chậm'
      ]
    }
  },

  'sunscreen': {
    reviewCount: 892,
    sourceCount: 3,
    lastUpdated: '2026-08-16',
    rawReviews: [
      { store: 'Shopee', rating: 5, author: 'skincare_diary**', text: 'Chống nắng tốt, không gây bí da dầu mụn, dùng lâu năm rồi.', media: { type: 'image', src: img('anessa-sunscreen.jpg'), caption: 'Ảnh minh hoạ (demo)' } },
      { store: 'Hasaki', rating: 5, author: 'thu.nt**', text: 'Kết cấu mỏng nhẹ, lên da nhanh, không để lại vệt trắng.', media: { type: 'video', src: img('anessa-sunscreen.jpg'), duration: '0:35', caption: 'Video minh hoạ (demo)' } },
      { store: 'Lazada', rating: 3, author: 'anh_nguyen**', text: 'Giá hơi cao so với các dòng nội địa nhưng đổi lại chất lượng ổn.' },
      { store: 'Tiki', rating: 4, author: 'my_pham**', text: 'Cần tẩy trang kỹ mới sạch hết lớp chống nắng, hơi mất công.' }
    ],
    aiSummary: {
      pros: [
        'Chống nắng hiệu quả, được đánh giá tốt cho da dầu/dễ mụn',
        'Kết cấu mỏng nhẹ, thấm nhanh, không để vệt trắng',
        'Được nhiều người dùng lâu năm tin tưởng, đánh giá ổn định'
      ],
      cons: [
        'Mức giá cao hơn các sản phẩm chống nắng nội địa cùng phân khúc',
        'Cần tẩy trang kỹ, không hợp người muốn skincare tối giản'
      ]
    }
  },

  'lipstick': {
    reviewCount: 467,
    sourceCount: 3,
    lastUpdated: '2026-08-10',
    rawReviews: [
      { store: 'Shopee', rating: 5, author: 'beauty_gene**', text: 'Dưỡng ẩm rất tốt, môi không bị khô như son lì thường dùng.', media: { type: 'image', src: img('dior-lip-glow.webp'), caption: 'Ảnh minh hoạ (demo)' } },
      { store: 'Lazada', rating: 4, author: 'kim.chi**', text: 'Màu lên tự nhiên theo môi từng người, hợp đi học đi làm.' },
      { store: 'Beauty Box', rating: 3, author: 'ngan_pham**', text: 'Giá khá cao so với son bóng bình thường, độ bền màu không cao.' },
      { store: 'Shopee', rating: 5, author: 'vy.makeup**', text: 'Mùi thơm nhẹ dễ chịu, không gắt như một số son khác.', media: { type: 'video', src: img('dior-lip-glow.webp'), duration: '0:22', caption: 'Video minh hoạ (demo)' } }
    ],
    aiSummary: {
      pros: [
        'Dưỡng ẩm tốt, được khen phù hợp cả khi môi khô',
        'Lên màu tự nhiên theo tông môi, dễ phối trang điểm nhẹ hằng ngày',
        'Mùi hương nhẹ, không gây khó chịu khi dùng lâu'
      ],
      cons: [
        'Giá cao hơn đáng kể so với son dưỡng có màu phổ thông',
        'Độ bền màu không cao, cần thoa lại sau vài giờ'
      ]
    }
  },

  'rice-cooker': {
    reviewCount: 178,
    sourceCount: 3,
    lastUpdated: '2026-08-11',
    rawReviews: [
      { store: 'Shopee', rating: 5, author: 'sv_kytucxa**', text: 'Nồi nhỏ gọn đúng chuẩn phòng trọ, nấu 1-2 người ăn vừa đủ.', media: { type: 'image', src: img('philips-rice-cooker.jpg'), caption: 'Ảnh minh hoạ (demo)' } },
      { store: 'Điện Máy Xanh', rating: 4, author: 'phuong.hn**', text: 'Cơm chín đều, dễ vệ sinh, không dính đáy nồi.', media: { type: 'video', src: img('philips-rice-cooker.jpg'), duration: '0:47', caption: 'Video minh hoạ (demo)' } },
      { store: 'Lazada', rating: 3, author: 'tuan_sv**', text: 'Dung tích hơi nhỏ nếu nấu cho từ 3 người trở lên.' },
      { store: 'Tiki', rating: 4, author: 'mai_anh**', text: 'Tiết kiệm điện, dùng ổn sau vài tháng chưa thấy lỗi gì.' }
    ],
    aiSummary: {
      pros: [
        'Kích thước gọn, rất hợp phòng trọ/ký túc xá sinh viên',
        'Cơm chín đều, lòng nồi dễ vệ sinh sau khi nấu',
        'Tiết kiệm điện, độ bền ổn định theo phản hồi vài tháng sử dụng'
      ],
      cons: [
        'Dung tích nhỏ, không phù hợp nếu nấu cho từ 3 người trở lên',
        'Không có chế độ hẹn giờ như một số nồi cao cấp hơn'
      ]
    }
  },

  'mini-fan': {
    reviewCount: 133,
    sourceCount: 3,
    lastUpdated: '2026-08-09',
    rawReviews: [
      { store: 'Shopee', rating: 4, author: 'hs_lop11**', text: 'Gọn nhẹ, để bàn học không chiếm chỗ, gấp lại dễ mang đi.', media: { type: 'image', src: img('mini-fan-s18.jpg'), caption: 'Ảnh minh hoạ (demo)' } },
      { store: 'WinMart', rating: 3, author: 'linh_ct**', text: 'Gió hơi nhẹ, hợp không gian nhỏ chứ phòng rộng thì không đủ mát.' },
      { store: 'Lazada', rating: 4, author: 'khoa.tran**', text: 'Giá rẻ, dùng tạm trên bàn làm việc khá ổn.', media: { type: 'video', src: img('mini-fan-s18.jpg'), duration: '0:19', caption: 'Video minh hoạ (demo)' } },
      { store: 'Tiki', rating: 3, author: 'yen_nguyen**', text: 'Một số đợt hàng có tiếng ồn nhẹ khi chạy tốc độ cao.' }
    ],
    aiSummary: {
      pros: [
        'Thiết kế gấp gọn, tiện mang theo hoặc cất khi không dùng',
        'Giá rẻ, phù hợp ngân sách học sinh - sinh viên',
        'Đủ dùng cho không gian bàn học/bàn làm việc cá nhân'
      ],
      cons: [
        'Luồng gió nhẹ, không phù hợp nếu cần làm mát phòng rộng',
        'Một số phản hồi ghi nhận tiếng ồn khi chạy ở mức cao nhất'
      ]
    }
  },

  'water-lavie-500': {
    reviewCount: 62,
    sourceCount: 3,
    lastUpdated: '2026-08-08',
    rawReviews: [
      { store: 'WinMart', rating: 5, author: 'anh_dat**', text: 'Mua thùng dùng hằng ngày, chất lượng ổn định, quen thuộc.', media: { type: 'image', src: img('lavie-water.jpg'), caption: 'Ảnh minh hoạ (demo)' } },
      { store: 'Bách Hóa Xanh', rating: 4, author: 'thao.vy**', text: 'Giá ổn định giữa các đợt mua, không thấy chênh nhiều.' },
      { store: 'Co.op Mart', rating: 4, author: 'huy_nguyen**', text: 'Dễ mua ở hầu hết siêu thị/cửa hàng tiện lợi gần nhà.', media: { type: 'video', src: img('lavie-water.jpg'), duration: '0:15', caption: 'Video minh hoạ (demo)' } },
      { store: 'Shopee', rating: 5, author: 'gia_dinh_tre**', text: 'Đặt online giao tận phòng trọ, không phải khuân vác nặng.' },
      { store: 'WinMart', rating: 3, author: 'phuc.sv**', text: 'Vỏ chai hơi mỏng, cầm mạnh tay dễ móp so với vài hãng khác.' }
    ],
    aiSummary: {
      pros: [
        'Chất lượng đồng đều, thương hiệu quen thuộc dễ tin tưởng',
        'Dễ mua ở hầu hết các điểm bán, không lo thiếu hàng',
        'Giá tương đối ổn định giữa các đợt mua'
      ],
      cons: [
        'Không có khác biệt lớn về chất lượng so với các hãng nước khoáng khác',
        'Chai nhựa dùng một lần, cần cân nhắc nếu ưu tiên tiêu chí thân thiện môi trường'
      ]
    }
  },

  'haohao': {
    reviewCount: 241,
    sourceCount: 3,
    lastUpdated: '2026-08-13',
    rawReviews: [
      { store: 'WinMart', rating: 5, author: 'sv_nam**', text: 'Vị quen thuộc từ nhỏ, ăn nhanh gọn lúc bận học bài.', media: { type: 'image', src: img('haohao-noodle.jpg'), caption: 'Ảnh minh hoạ (demo)' } },
      { store: 'Bách Hóa Xanh', rating: 4, author: 'huong_tran**', text: 'Giá rẻ, mua thùng để sẵn trong phòng trọ rất tiện.', media: { type: 'video', src: img('haohao-noodle.jpg'), duration: '0:24', caption: 'Video minh hoạ (demo)' } },
      { store: 'Co.op Mart', rating: 3, author: 'tan.le**', text: 'Nêm hơi mặn nếu cho hết gói gia vị, mình hay giảm bớt.' },
      { store: 'Shopee', rating: 5, author: 'ktx_2sao**', text: 'Mua thùng để dành, để được lâu, hợp dự trữ trong phòng ký túc xá.' },
      { store: 'Bách Hóa Xanh', rating: 4, author: 'linh.food**', text: 'Thêm trứng với ít rau là thành bữa ăn khá ổn, tiện lúc gấp.' }
    ],
    aiSummary: {
      pros: [
        'Vị quen thuộc, dễ ăn, phù hợp bữa ăn nhanh khi bận học/làm',
        'Giá rẻ, tiện mua sẵn số lượng lớn để dự trữ',
        'Dễ tìm mua ở hầu hết siêu thị/cửa hàng tiện lợi'
      ],
      cons: [
        'Vị nêm khá mặn nếu dùng hết gói gia vị đi kèm',
        'Cần thêm topping (trứng, rau) để bữa ăn đủ chất hơn'
      ]
    }
  },

};
// v85: đã bỏ dữ liệu đánh giá của 'notebook', 'casio', 'lego-classic', 'teddy-bear'
// — 4 sản phẩm này không còn trong danh sách sản phẩm (xem products.js, CHANGELOG.md).

export function getReviewData(productId) {
  return reviewsData[productId] || null;
}

// v63 — "Cawi Đánh Giá Tổng Hợp": gộp điểm đánh giá theo từng sàn (Shopee/TikTok Shop/
// Lazada/Hasaki...) từ đúng các review đã gắn với productId này, để hiển thị ngay trên
// bảng so sánh tổng chi phí mà không cần người dùng tự mở từng sàn để đọc review
// (Mục 4.2 báo cáo cải tiến Vòng 4). Miễn phí cho mọi gói — không paywall.
export function getCrossPlatformBreakdown(productId) {
  const data = reviewsData[productId];
  if (!data?.rawReviews?.length) return null;

  const bySource = new Map();
  data.rawReviews.forEach((review) => {
    const key = review.store || 'Khác';
    if (!bySource.has(key)) bySource.set(key, { store: key, count: 0, sum: 0 });
    const entry = bySource.get(key);
    entry.count += 1;
    entry.sum += Number(review.rating || 0);
  });

  const platforms = Array.from(bySource.values())
    .map((entry) => ({ store: entry.store, count: entry.count, average: entry.sum / entry.count }))
    .sort((a, b) => b.count - a.count);

  const totalCount = data.rawReviews.length;
  const overallAverage = data.rawReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / totalCount;

  return {
    overallAverage,
    totalCount,
    sourceCount: data.sourceCount,
    platforms,
    topPros: (data.aiSummary?.pros || []).slice(0, 3),
    topCons: (data.aiSummary?.cons || []).slice(0, 2)
  };
}
