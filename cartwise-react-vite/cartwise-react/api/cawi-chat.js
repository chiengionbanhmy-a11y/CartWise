const CARTWISE_SYSTEM_PROMPT = `
Bạn là Cawi Robo AI, trợ lý mua sắm của website CartWise.

Nguyên tắc trả lời:
- Trả lời bằng tiếng Việt tự nhiên, thân thiện, ngắn gọn.
- Ưu tiên giúp người dùng hiểu cách so sánh tổng chi phí dự kiến.
- Không khẳng định giá là chính xác tuyệt đối theo thời gian thực nếu dữ liệu chỉ đến từ demo hoặc dữ liệu người dùng cung cấp.
- Không tự bịa voucher cá nhân, phí ship thật, tài khoản Shopee/Lazada/Tiki hoặc chính sách riêng nếu không có trong dữ liệu.
- Nếu người dùng hỏi nơi rẻ nhất, hãy dựa vào dữ liệu CartWise gửi kèm.
- Nếu người dùng hỏi ngoài phạm vi mua sắm, vẫn hỗ trợ ở mức cơ bản nhưng kéo về CartWise khi phù hợp.
- Không đưa lời khuyên tài chính/pháp lý/y tế chuyên sâu.
`;

function buildFallbackReply(message = '') {
  const q = String(message).toLowerCase();
  if (q.includes('rẻ') || q.includes('giá') || q.includes('so sánh')) {
    return 'Mình có thể giúp bạn so sánh tổng chi phí dự kiến. Bạn hãy mở sản phẩm rồi xem phần Shopee, Lazada, Tiki hoặc cửa hàng trực tiếp nhé.';
  }
  if (q.includes('voucher') || q.includes('giảm')) {
    return 'Voucher cá nhân phụ thuộc từng tài khoản, nên CartWise để bạn nhập thủ công và tách riêng khỏi bảng so sánh công bằng.';
  }
  if (q.includes('ship') || q.includes('vận chuyển')) {
    return 'Phí vận chuyển trong CartWise là phần ước tính để giúp bạn nhìn tổng chi phí gần thực tế hơn, đặc biệt khi mua online.';
  }
  return 'Mình đang chạy ở chế độ dự phòng vì API AI chưa được cấu hình. Bạn vẫn có thể hỏi về so sánh giá, voucher, phí ship và cách dùng CartWise nhé.';
}

function safeJson(value, limit = 12000) {
  try {
    return JSON.stringify(value).slice(0, limit);
  } catch {
    return '';
  }
}

function extractText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') chunks.push(content.text);
      if (typeof content?.output_text === 'string') chunks.push(content.output_text);
    }
  }
  return chunks.join('\n').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ reply: 'Phương thức không được hỗ trợ.', mode: 'error' });
  }

  try {
    const { message, history = [], context = {} } = req.body || {};
    const cleanMessage = String(message || '').trim();

    if (!cleanMessage) {
      return res.status(400).json({ reply: 'Bạn hãy nhập câu hỏi trước nhé.', mode: 'error' });
    }

    if (cleanMessage.length > 1200) {
      return res.status(400).json({ reply: 'Câu hỏi hơi dài. Bạn hãy rút gọn lại để Cawi Robo trả lời chính xác hơn nhé.', mode: 'error' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: buildFallbackReply(cleanMessage),
        mode: 'fallback',
        warning: 'OPENAI_API_KEY chưa được cấu hình trên Vercel.'
      });
    }

    const recentHistory = Array.isArray(history)
      ? history.slice(-8).map((item) => ({
          role: item.from === 'user' ? 'user' : 'assistant',
          content: String(item.text || '').slice(0, 600)
        }))
      : [];

    const cartwiseContext = `
Dữ liệu CartWise hiện có:
${safeJson(context)}

Lịch sử chat gần đây:
${safeJson(recentHistory)}
`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        instructions: CARTWISE_SYSTEM_PROMPT,
        input: [
          {
            role: 'user',
            content: `${cartwiseContext}\n\nCâu hỏi mới của người dùng: ${cleanMessage}`
          }
        ],
        max_output_tokens: 450,
        temperature: 0.35
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return res.status(200).json({
        reply: `${buildFallbackReply(cleanMessage)}\n\nGhi chú kỹ thuật: AI API chưa phản hồi thành công, vui lòng kiểm tra OPENAI_API_KEY / OPENAI_MODEL trên Vercel.`,
        mode: 'fallback'
      });
    }

    const reply = extractText(data) || buildFallbackReply(cleanMessage);
    return res.status(200).json({ reply, mode: 'openai' });
  } catch (error) {
    console.error('Cawi API error:', error);
    return res.status(200).json({
      reply: 'Mình gặp lỗi khi gọi AI thật, nên đang trả lời bằng chế độ dự phòng. Bạn thử hỏi lại sau vài giây nhé.',
      mode: 'fallback'
    });
  }
}
