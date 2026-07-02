# Cawi Robo AI API

Bản v36 đã thêm API route:

```txt
/api/cawi-chat
```

Frontend sẽ gửi câu hỏi của người dùng tới API này. API route sẽ gọi OpenAI Responses API bằng biến môi trường `OPENAI_API_KEY`.

## Cấu hình trên Vercel

Vào Project Settings → Environment Variables, thêm:

```txt
OPENAI_API_KEY = sk-...
OPENAI_MODEL = gpt-4.1-mini
```

Sau khi thêm biến môi trường, cần Redeploy.

Nếu chưa thêm `OPENAI_API_KEY`, Cawi Robo vẫn chạy ở chế độ dự phòng, nhưng chưa phải AI thật.
