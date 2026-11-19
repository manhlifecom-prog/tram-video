---
name: codex-video-captions
description: Dựng video người nói thật/chia sẻ chuyên môn từ nguồn được cấp, giữ giọng và nghĩa, thiết kế phụ đề theo cụm lời và cảm xúc, kiểm bản MP4 và sửa theo góp ý trong Codex. Không dùng cho đăng bài hoặc tự suy quyền tư liệu.
---

# Video người nói thật và phụ đề theo nghĩa

Dùng trong Codex đã đăng nhập bằng tài khoản của người học. Đây là skill và công cụ dựng local, không phải dịch vụ API hoặc luồng gọi một nhà cung cấp khác. Không yêu cầu API key để chạy các script trong gói. Hạn mức Codex và điều khoản công cụ vẫn theo tài khoản của người dùng; skill không cấp thêm hạn mức.

Skill này giữ phạm vi một mẫu người nói/chia sẻ chuyên môn, không là skill video vạn năng. Đọc [DNA của mẫu](references/PROFILE-GUIDE.md): phải chọn profile cục bộ tường minh, giữ cùng nhận diện/crop/giọng qua các video, biến thể cách diễn theo nghĩa thay vì random preset. Thiếu profile thì yêu cầu cấu hình; không lấy DNA một khách hoặc người khác làm mặc định.

Nhận brief theo [mẫu đầu vào](examples/input-brief.json) và [schema brief](schemas/input-brief.schema.json). Xem đúng video/lời dặn hiện có trước khi hỏi lại; ghi người nói, mục đích, khán giả được khai báo, tư liệu và quyền dùng nguồn. Chỉ chỉnh bản người dùng giao, giữ giọng/nhận diện và phần ngoài yêu cầu sửa. Không nhập tư liệu bên ngoài vào gói hoặc tự đăng bài.

## Cách dựng

Đọc [công thức phụ đề](references/subtitle-formula.md) trước khi thiết kế chữ và [kỹ thuật chữ](references/emotional-typography.md) khi chọn hiệu ứng. Công thức: **ý và cảm xúc → cụm nghĩa/bố cục → mốc giọng nguồn → chuyển động có chọn lọc → kiểm MP4**.

- Hiểu toàn câu chuyện, chọn take/hook/cắt thô theo nghĩa; giữ phủ định, điều kiện, chủ thể và mức chắc chắn. Giữ EDL/source clock để phụ đề và âm không trượt sau cắt. Không bịa phát ngôn hoặc lời kêu gọi.
- Tìm đúng người đang nói trước crop/focus. Giữ người nói đang chuyển động và miệng khớp tiếng; chèn minh họa khi nó giúp hiểu câu, không thay thành chuỗi thẻ chữ giống nhau.
- Phụ đề chia theo cụm nghĩa, chữ dẫn nhỏ hơn ý nhấn. Không tách một cụm nhấn lên hai dòng. Đo font thật và kiểm dấu tiếng Việt, vùng mặt và vùng điều khiển nền tảng.
- Dùng mốc source-word/phrase thật hoặc các anchor nghe kiểm. Chữ, từ nhấn, icon và nhãn cùng chờ ý được nói, không mặc định delay hoặc chia đều thời gian. Sub dịch đi theo ý của giọng nguồn; không gọi đó là ASR từng từ của bản dịch.
- Chọn hiệu ứng có lý do theo nội dung. Từng từ, vệt sáng, nảy, hạt, icon hoặc chữ sau người chỉ dùng khi phù hợp; có khoảng nghỉ và kiểu đơn giản. Không xoay preset theo thứ tự, không bôi nền/gạch thay diễn chữ. Chữ sau người cần matte và clock của chính video, không được gói này tự tạo.

## Thực thi và sửa

[EmotionalCaption](assets/EmotionalCaption.tsx) là helper React gốc; [adapter DNA](assets/EmotionalCaptionProfiled.tsx) giữ cơ chế timing/layout và đổi màu/vùng chữ qua cấu hình, được dùng trong [composition khởi điểm](renderer/index.tsx). Helper chứa nhánh fallback thử nghiệm; khi dùng nguồn thật luôn cấp timing tường minh. [Validator](scripts/check-input.mjs) buộc đủ tokenOnsets và giữ nguyên dòng/cụm; nó không hiểu nghĩa và không xác minh việc nghe.

Chạy công cụ theo [QUICKSTART](QUICKSTART.md). `renderer` khởi điểm giữ video/âm gốc và đặt chữ trên canvas dọc1080×1920; không tự cắt take, track speaker, tạo ASR, nhạc hoặc tự chọn style. Với nội dung thật, Codex phải chuẩn bị/source-map input hoặc điều chỉnh composition đúng brief. Các thay đổi EDL/âm thanh cần kiểm riêng.

Khi sửa, lưu phản hồi nguyên văn và bản MP4/input mới theo version; tái dùng nguồn/EDL/clock đúng phần không đổi. Không ghi đè bản cũ. Rà trước/onset/sau từ nhấn, câu dài, chuyển bố cục, dấu câu và crop. Kiểm MP4 xuất mới, xem chuyển động và nghe phối âm khi có công cụ; ghi riêng kỹ thuật/khung/xem-nghe/giới hạn. Không dùng hash/decode hoặc bản hình học để chấm đã đạt cảm xúc/giọng. Không đẩy mốc từ lên sớm để vượt validator hoặc tạo đủ thời gian đọc: giữ sự thật source clock, rút caption về ý chính hợp lệ hoặc ghi vấn đề đọc quá gấp và sửa bố cục/điểm kết theo nguồn. Schema PASS không kiểm được từ nhấn đúng nghĩa hoặc anchor nguồn.

## Bằng chứng và giới hạn hiện có

Gói0.2.0-beta.1 là bản thử công khai, phát triển từ candidate kỹ thuật0.1.0. [Proof](proof/PROOF-REPORT.md) mô tả hai bản hình học8giây và một vòng sửa. Chưa kiểm clean dependency install, Windows, phiên Codex độc lập từ raw người nói đến final, hoặc chất lượng căn giọng trên nguồn thật. Không mô tả các gate này đã đạt từ việc render demo thành công.
