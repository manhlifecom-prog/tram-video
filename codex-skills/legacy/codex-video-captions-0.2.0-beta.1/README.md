# Codex Video Captions Kit ·0.2.0-beta.1

Candidate kỹ thuật trong phạm vi một mẫu video người nói thật/chia sẻ chuyên môn: tài liệu skill, helper chữ theo cụm/cảm xúc, renderer khởi điểm, validator và ví dụ sửa version. Tự chạy trên máy người học, không cần tài khoản hay thuê Trạm. Dùng với Codex đăng nhập bằng tài khoản của người học; các script không gọi AI provider và không cần API key.

**Trạng thái:** bản thử công khai; đã có proof dựng kỹ thuật trên Mac, chưa là sản phẩm đã nghiệm thu để bán. Demo hình học không chứng minh Codex tự dựng video người nói thật hoặc căn giọng đã đạt.

## Trong gói

- `SKILL.md`, `references/`: phương pháp hiểu ý→bố cục→clock giọng→diễn chữ→kiểm MP4.
- `profiles/`, `schemas/profile.schema.json`: DNA cục bộ cho mẫu, tách code chung và tài nguyên khách. Demo A/B chỉ là hai profile tự tạo; thiếu profile sẽ báo lỗi, không tự suy nhận diện của ai.
- `assets/EmotionalCaption.tsx`: helper gốc; `EmotionalCaptionProfiled.tsx` là adapter màu/vùng chữ theo DNA; `renderer/index.tsx`: composition dọc khởi điểm, nhận video riêng hoặc geometry.
- `scripts/`: validator + tests + renderer; `schemas/`, `examples/`: brief/input JSON và phản hồi v2.
- `public/fonts/`: Be Vietnam Pro và đầy đủ SIL OFL1.1.
- `proof/`: MP4v1/v2 và receipt/giới hạn kiểm. Không chứa người thật, giọng nói, nhạc hoặc media khách.

Chỉnh DNA cơ bản theo [PROFILE-GUIDE.md](references/PROFILE-GUIDE.md); giữ profile nhất quán qua các video cùng mẫu, biến thể cue theo nội dung và clock thật.

Bắt đầu tại [QUICKSTART.md](QUICKSTART.md). Gói có thể đặt nguyên thư mục `codex-video-captions` vào thư mục skills của Codex, hoặc mở thư mục này trong Codex và chỉ định đọc SKILL.md. Giữ toàn bộ references/assets/scripts khi sao chép; không chỉ sao mỗi SKILL.md. Không ghi đè một bản cài đã được người dùng sửa.

## Giới hạn đã biết

Renderer cần browser, localhost và cache ghi trong project. Script tắt cache persistent dưới node_modules; môi trường sandbox chặn localhost có thể khiến render không khởi chạy. Không đổi quyền toàn máy để bỏ qua lỗi này, và không hứa one-click/100%offline.

Renderer khởi điểm không tự tìm take, cắt nguồn, chép lời, tracking khuôn mặt hoặc tự chọn hiệu ứng. Codex cần chuẩn bị input theo video/brief thực; có thể phải mở rộng composition. Source thật giữ giọng gốc; âm/EDL/căn lời cần kiểm. Demo dùng geometry và im lặng, chỉ chứng minh helper/render/vòng sửa.

Mac proof dùng dependency có sẵn qua link; chưa kiểm cài mới trên máy sạch. Windows, bản Codex độc lập từ raw người nói tới final, hướng dẫn quay màn hình và gói Zoom còn chưa kiểm/chưa có trong candidate này. Lỗi cài đặt hoặc skill không làm đúng mẫu đã công bố thuộc phần sửa lỗi/hỗ trợ của mẫu; yêu cầu style, brand hoặc template mới nằm ngoài mẫu là phạm vi setup riêng do người phụ trách sản phẩm báo giá. Gói không tự đặt giá, SLA, thời hạn cập nhật hoặc điều khoản chưa chốt.

## Công cụ và điều khoản

Node tương thích theo package.json, Remotion4.0.537/React19.2.3, Chrome tương thích và FFmpeg/FFprobe cho kiểm audio/decode. Không đóng gói các binary này hoặc node_modules. Phiên Codex dùng hạn mức của tài khoản người học; skill không cấp hạn mức hoặc tài khoản. Remotion và công cụ bên thứ ba có điều khoản/giấy phép riêng; tham khảo [Remotion licensing](https://www.remotion.dev/license). Bản render local không tự suy ra quyền dùng thương mại cho mọi mô hình.

Xem [LICENSE-NOTICE.md](LICENSE-NOTICE.md) trước khi phân phối. Code giữ giấy phép MIT của repo Trạm Video hiện có; font và dependency giữ giấy phép riêng. Bản thử công khai không phải duyệt gói bán, giá, khóa học, SLA hoặc dịch vụ hỗ trợ.
