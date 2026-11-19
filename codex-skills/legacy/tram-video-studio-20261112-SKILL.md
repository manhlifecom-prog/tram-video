---
name: tram-video-studio
description: Dựng và sửa video bằng Codex, Remotion và FFmpeg theo nội dung, nhận diện riêng và video tham khảo; học chuyển động theo mốc, dựng nhiều clip thành câu chuyện, phụ đề và phối âm rồi giao MP4 để góp ý. Dùng độc lập trên máy người nhận, không cần quyền vào máy chủ Trạm.
---

# Dựng video theo nội dung và phong cách riêng

Codex đọc nguồn, hiểu nội dung, lập ý đồ cắt và thiết kế cảnh. Remotion/FFmpeg thực thi hình, âm thanh và xuất file. Cài skill không cung cấp model, khóa API, nhạc, footage, tài khoản hay quyền truy cập Trạm.

## Bắt đầu một video

1. Xác định thư mục làm việc và nguồn người dùng đã cấp. Đọc hướng dẫn dự án nếu có. Chỉ đọc dữ liệu liên quan đến video hiện tại; không quét máy, CRM hoặc thư mục khách khác.
2. Kiểm tra clip bằng ffprobe: thời lượng, kích thước, xoay hình, fps, audio/HDR. Nếu nhiều clip, lập inventory và giữ ID nguồn; chọn người nói chính, cảnh phụ và minh chứng theo nội dung, không lặp clip chính vào ô nhỏ để giả có B-roll.
3. Nhận lời theo từng câu, đối chiếu chỗ không chắc với tiếng gốc. Không coi ASR là sự thật. Giữ dữ kiện, giọng thật và câu trọn ý. Đọc [quy trình dựng](references/editing.md).
4. Dùng brief, khán giả, nhận diện và gu đã được chính người này xác nhận. Khi hướng dựng còn mơ hồ, đưa 2–3 lựa chọn ngắn trong cuộc trò chuyện hiện tại. Không biến sở thích của người khác thành mặc định của tài khoản mới.
5. Có mẫu thì đọc [học video tham khảo](references/reference-learning.md), rút ra cơ chế có mốc rồi thích ứng theo nội dung mới. Chưa có mẫu vẫn cần hook, nhịp và minh họa có chủ đích; không chỉ phủ phụ đề cơ bản lên clip.
6. Ghi plan theo câu → ý → hình → chuyển động → âm thanh → nguồn. Giữ clock lời thật tách khỏi animation. Chuẩn bị đủ tài nguyên trước khi render; thiếu ảnh/nhạc/SFX thì nói rõ thay vì ghi đã có.

## Chữ, hình và âm thanh

- Phụ đề đọc được trên điện thoại, có dấu đầy đủ, chia theo cụm ý; không ghim chữ nhỏ ở đỉnh/góc như một kiểu mặc định. Bảo vệ mặt, tay và vật thể chính. Tiêu đề, chữ nhấn và phụ đề có vai trò riêng, không chồng cả ba cùng nói một ý.
- Animation giải thích quan hệ trong lời: trước/sau, nguyên nhân/kết quả, so sánh, quy trình, trạng thái. Dùng đối tượng ổn định qua các cảnh; vào → giữ → biến đổi → ra; kiểm frame quanh chuyển cảnh, không lạm dụng các thẻ chữ giống nhau.
- Dựng dọc và ngang phải bố trí lại, không kéo giãn cùng một canvas. Hình nguồn đủ lớn, chuyển động có khoảng giữ để đọc và xem minh chứng.
- Dùng nhạc/SFX người dùng chọn hoặc thư viện đã được họ cho phép, có nguồn và quyền sử dụng phù hợp. Không tải nhạc chỉ vì đang trend rồi mặc định có quyền phân phối. Nếu không có bài phù hợp, hỏi hoặc giao bản giữ tiếng gốc theo brief; không tự tạo tiếng rồi giả là âm thanh học từ mẫu.
- Giảm ồn có kiểm tra trước/sau, không làm giọng méo hoặc mất âm. Cân giọng, nhạc và SFX theo nội dung; nghe bản phối thật, không suy chất lượng nghe từ waveform.

## Thực thi và sửa tiếp

Đọc [công cụ và giới hạn](references/tools.md) để dùng bộ dựng mẫu kèm gói. Đây là scaffold thực thi, không phải mọi mẫu cao cấp đã tích hợp. Cần viết hoặc nối composition theo kế hoạch cụ thể. Không cài/nâng renderer chỉ để đọc recipe nếu dự án đã có bộ dựng phù hợp.

Mỗi phản hồi phải gắn video, phiên bản và mốc cần sửa. Giữ bản cũ và sửa đúng phạm vi; góp ý hoặc thêm cảnh mới không làm mất nguồn cũ. Không yêu cầu người dùng nhắc lại toàn bộ brief. Trước giao đọc [kiểm bản xuất](references/quality.md).

## Ghi nhớ phong cách và bảo mật

Chỉ ghi gu và góp ý vào thư mục dự án riêng đã thống nhất. Ghi rõ phạm vi: bản này, series này hay sở thích lâu dài. Tách hồ sơ từng người; không gửi thông tin khách, source media, transcript hoặc gu riêng trở lại repo skill dùng chung.

Không đính kèm `.env`, token/cookie, hồ sơ đăng nhập, chứng chỉ ký, dữ liệu thanh toán hay khóa API. Người nhận dùng tài khoản và khóa của họ nếu cần, thiết lập qua cơ chế riêng tư của môi trường. Skill không cho phép bỏ sandbox, đọc bí mật hay chia sẻ file ra ngoài yêu cầu.

Chỉ gọi một kỹ thuật đã học sau khi có quan sát và bằng chứng tương ứng; chỉ gọi thành phẩm đã xong khi có file phát được. Phân biệt: phân tích, recipe, code đã kiểm, render đối chiếu, người dùng duyệt và tích hợp runtime. Không tự bật AI local hay giả việc cài skill đã nối chatbot Trạm vào Codex.
