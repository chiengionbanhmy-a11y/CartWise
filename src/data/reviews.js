// v58 — Dữ liệu đánh giá đa nguồn + tóm tắt AI (bài toán AI thứ 2 của CartWise).
//
// Kiến trúc: đúng cơ chế đã dùng cho bài toán AI thứ 1 (nhận diện sản phẩm trùng) —
// AI chỉ được gọi 1 LẦN khi hệ thống thu thập đủ review cho một sản phẩm, kết quả
// tóm tắt (pros/cons) được lưu lại (cache) tại đây và tái sử dụng cho mọi lượt xem.
// Trong bản demo MVP, "cache" này là dữ liệu tĩnh viết sẵn — không gọi API AI thật,
// không phát sinh chi phí, không cần OPENAI/ANTHROPIC_API_KEY (giữ đúng triết lý
// "không phát sinh chi phí AI" mà bản v37 đã đặt ra cho Cawi Robo).

export const reviewsData = {
  'mouse-logitech': {
    reviewCount: 214,
    sourceCount: 3,
    lastUpdated: '2026-08-14',
    rawReviews: [
      { store: 'Shopee', rating: 5, author: 'ngoc_tran**', text: 'Chuột êm tay, bấm không nghe tiếng, dùng cả ngày không mỏi cổ tay.' },
      { store: 'Lazada', rating: 4, author: 'minh.dev**', text: 'Kết nối ổn định qua USB receiver, pin dùng gần 2 năm chưa phải thay.' },
      { store: 'Shopee', rating: 3, author: 'hoa_bui**', text: 'Form hơi to với tay mình (tay nhỏ), cầm hơi cấn lúc đầu.' },
      { store: 'Tiki', rating: 5, author: 'quan_le**', text: 'Mua cho em học sinh dùng học online, nhẹ, dễ mang theo balo.' }
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
      { store: 'Shopee', rating: 5, author: 'phong_it**', text: 'Sạc nhanh, dùng thương hiệu Anker nên yên tâm về an toàn pin.' },
      { store: 'Lazada', rating: 4, author: 'trang2005**', text: 'Nhỏ gọn bỏ vừa túi áo khoác, sạc được điện thoại gần 2 lần đầy.' },
      { store: 'Tiki', rating: 3, author: 'duc_pham**', text: 'Không kèm cáp sạc dài, phải mua thêm cáp mới tiện dùng.' },
      { store: 'Shopee', rating: 5, author: 'lan.a**', text: 'Mang đi học cả ngày không lo hết pin điện thoại nữa.' }
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
      { store: 'Shopee', rating: 5, author: 'skincare_diary**', text: 'Chống nắng tốt, không gây bí da dầu mụn, dùng lâu năm rồi.' },
      { store: 'Hasaki', rating: 5, author: 'thu.nt**', text: 'Kết cấu mỏng nhẹ, lên da nhanh, không để lại vệt trắng.' },
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
      { store: 'Shopee', rating: 5, author: 'beauty_gene**', text: 'Dưỡng ẩm rất tốt, môi không bị khô như son lì thường dùng.' },
      { store: 'Lazada', rating: 4, author: 'kim.chi**', text: 'Màu lên tự nhiên theo môi từng người, hợp đi học đi làm.' },
      { store: 'Beauty Box', rating: 3, author: 'ngan_pham**', text: 'Giá khá cao so với son bóng bình thường, độ bền màu không cao.' },
      { store: 'Shopee', rating: 5, author: 'vy.makeup**', text: 'Mùi thơm nhẹ dễ chịu, không gắt như một số son khác.' }
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
      { store: 'Shopee', rating: 5, author: 'sv_kytucxa**', text: 'Nồi nhỏ gọn đúng chuẩn phòng trọ, nấu 1-2 người ăn vừa đủ.' },
      { store: 'Điện Máy Xanh', rating: 4, author: 'phuong.hn**', text: 'Cơm chín đều, dễ vệ sinh, không dính đáy nồi.' },
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
      { store: 'Shopee', rating: 4, author: 'hs_lop11**', text: 'Gọn nhẹ, để bàn học không chiếm chỗ, gấp lại dễ mang đi.' },
      { store: 'WinMart', rating: 3, author: 'linh_ct**', text: 'Gió hơi nhẹ, hợp không gian nhỏ chứ phòng rộng thì không đủ mát.' },
      { store: 'Lazada', rating: 4, author: 'khoa.tran**', text: 'Giá rẻ, dùng tạm trên bàn làm việc khá ổn.' },
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
      { store: 'WinMart', rating: 5, author: 'anh_dat**', text: 'Mua thùng dùng hằng ngày, chất lượng ổn định, quen thuộc.' },
      { store: 'Bách Hóa Xanh', rating: 4, author: 'thao.vy**', text: 'Giá ổn định giữa các đợt mua, không thấy chênh nhiều.' },
      { store: 'Co.op Mart', rating: 4, author: 'huy_nguyen**', text: 'Dễ mua ở hầu hết siêu thị/cửa hàng tiện lợi gần nhà.' }
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
      { store: 'WinMart', rating: 5, author: 'sv_nam**', text: 'Vị quen thuộc từ nhỏ, ăn nhanh gọn lúc bận học bài.' },
      { store: 'Bách Hóa Xanh', rating: 4, author: 'huong_tran**', text: 'Giá rẻ, mua thùng để sẵn trong phòng trọ rất tiện.' },
      { store: 'Co.op Mart', rating: 3, author: 'tan.le**', text: 'Nêm hơi mặn nếu cho hết gói gia vị, mình hay giảm bớt.' }
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

  'notebook': {
    reviewCount: 95,
    sourceCount: 3,
    lastUpdated: '2026-08-07',
    rawReviews: [
      { store: 'Nhà sách Fahasa', rating: 5, author: 'hs_c3**', text: 'Giấy trắng mịn, viết không lem mực, đúng chuẩn vở ôn thi.' },
      { store: 'Shopee', rating: 4, author: 'mebimsua**', text: 'Mua nguyên combo cho con đi học, chất lượng ổn định các cuốn.' },
      { store: 'WinMart', rating: 4, author: 'duy_pham**', text: 'Giá hợp lý so với các loại vở khác cùng số trang.' }
    ],
    aiSummary: {
      pros: [
        'Giấy mịn, viết không lem mực — phù hợp ghi chép, ôn thi',
        'Chất lượng đồng đều giữa các cuốn khi mua combo nhiều quyển',
        'Giá hợp lý so với các loại vở cùng số trang trên thị trường'
      ],
      cons: [
        'Ít lựa chọn về mẫu bìa/màu sắc so với một số thương hiệu vở khác',
        'Cần đặt số lượng lớn mới được áp một số ưu đãi tốt nhất'
      ]
    }
  },

  'casio': {
    reviewCount: 156,
    sourceCount: 3,
    lastUpdated: '2026-08-15',
    rawReviews: [
      { store: 'Nhà sách Fahasa', rating: 5, author: 'hs_lop12**', text: 'Bấm phím nhạy, đúng chuẩn máy tính thi THPT Quốc Gia.' },
      { store: 'Shopee', rating: 4, author: 'phu.tran**', text: 'Màn hình rõ, pin dùng bền, học 3 năm cấp 3 chưa hỏng.' },
      { store: 'WinMart', rating: 3, author: 'kim_anh**', text: 'Vỏ máy hơi dễ trầy xước nếu không có bao đựng.' }
    ],
    aiSummary: {
      pros: [
        'Đúng dòng máy được phép dùng trong phòng thi theo phản hồi học sinh',
        'Bấm phím nhạy, màn hình hiển thị rõ ràng',
        'Độ bền cao, nhiều bạn dùng xuyên suốt 3 năm cấp 3'
      ],
      cons: [
        'Vỏ ngoài dễ trầy xước nếu không dùng thêm bao bảo vệ',
        'Một số chức năng nâng cao ít dùng tới ở bậc phổ thông'
      ]
    }
  },

  'lego-classic': {
    reviewCount: 289,
    sourceCount: 3,
    lastUpdated: '2026-08-06',
    rawReviews: [
      { store: 'Shopee', rating: 5, author: 'toy_collector**', text: 'Chi tiết đa dạng, sáng tạo được nhiều mô hình khác nhau.' },
      { store: 'MyKingdom', rating: 5, author: 'me_2con**', text: 'Mua cho con chơi, mảnh ghép chắc chắn, không lo gãy vỡ.' },
      { store: 'ToyZone', rating: 3, author: 'anh_trai**', text: 'Hộp khá nhiều mảnh nhỏ, cần để xa bé dưới 3 tuổi.' }
    ],
    aiSummary: {
      pros: [
        'Bộ chi tiết đa dạng, khuyến khích sáng tạo nhiều mô hình',
        'Chất lượng mảnh ghép chắc chắn, được đánh giá bền',
        'Phù hợp làm quà tặng cho cả trẻ em và người sưu tầm'
      ],
      cons: [
        'Nhiều chi tiết nhỏ, cần lưu ý an toàn với trẻ dưới 3 tuổi',
        'Giá nhỉnh hơn một số bộ xếp hình không chính hãng'
      ]
    }
  },

  'teddy-bear': {
    reviewCount: 174,
    sourceCount: 3,
    lastUpdated: '2026-08-05',
    rawReviews: [
      { store: 'Shopee', rating: 5, author: 'qua_tang_xinh**', text: 'Gấu mềm mịn, may chắc chắn, mua tặng bạn gái rất ưng.' },
      { store: 'FunnyLand', rating: 4, author: 'trang_bui**', text: 'Kích thước mini vừa để bàn học hoặc treo balo.' },
      { store: 'Lazada', rating: 3, author: 'huy.pham**', text: 'Màu lông hơi khác ảnh một chút nhưng vẫn dễ thương.' }
    ],
    aiSummary: {
      pros: [
        'Chất liệu mềm mịn, đường may chắc chắn theo nhiều đánh giá',
        'Kích thước mini linh hoạt — để bàn học hoặc treo balo đều hợp',
        'Được đánh giá là lựa chọn quà tặng dễ chinh phục người nhận'
      ],
      cons: [
        'Màu sắc thực tế đôi khi hơi khác so với hình ảnh sản phẩm',
        'Kích thước mini nên không phù hợp nếu muốn mua làm gấu ôm lớn'
      ]
    }
  }
};

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
