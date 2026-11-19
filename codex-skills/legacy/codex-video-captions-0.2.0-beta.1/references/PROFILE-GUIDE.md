# DNA cục bộ của một mẫu

Gói này hỗ trợ một mẫu video người nói thật/chia sẻ chuyên môn. Code, clock/nội dung, DNA và tài nguyên riêng tách nhau:

- `assets/`, `renderer/`, `scripts/`: cơ chế dùng chung.
- `profiles/<id>.json`: palette, font đã đăng ký, tỷ lệ chữ, vị trí/vùng an toàn, nhịp hiệu ứng và quy tắc giữ người/giọng.
- Input JSON: text, cụm nghĩa, ý nhấn, emotion/reason, mode và clock riêng của nội dung.
- `public/input/`: bản sao nguồn của người dùng; không đóng vào skill chung hoặc gửi sang profile khác.

## Chọn và chỉnh

Demo A nền tối ấm, chữ/nhấn vàng sáng; Demo B nền giấy sáng, nhấn xanh trầm, chữ nhỏ và cao hơn. Đây là profile tự tạo để kiểm cấu hình, không là nhận diện khách thật. Chọn `profileId` rõ trong input; thiếu file hoặc cấu hình sẽ dừng. Không tự nhận profile này là thương hiệu của người học.

Muốn tạo DNA riêng trong phạm vi mẫu, sao một profile thành ID mới, chỉnh palette hex, tỷ lệ body/key0.8–1.1, offsetY/vùng trái-phải và fit video. Font hiện chỉ đăng ký Be Vietnam Pro kèm OFL; thêm font mới cần quyền phân phối, khai báo font và kiểm layout lại, không chỉ điền tên font không tồn tại.

`motion.allowedModes` là giới hạn kỹ thuật; mode mỗi cue vẫn do ý/cảm xúc/clock quyết định và có reason. Profile không có vòng quay preset. Policy hiện giữ tối đa một cue hiệu ứng đặc biệt liên tiếp; chỗ đơn giản phải là khoảng nghỉ có ý nghĩa. Đây là phạm vi nhịp của mẫu này, không quy tắc áp mọi loại video.

Giữ mặt/miệng người đang nói, giọng nguồn và phủ định/điều kiện. `videoFit=contain` mặc định của hai demo bảo toàn khung; chọn cover cần xem vùng mặt và kiểm crop của chính nguồn. `cropRule` là điều kiện cho người dựng, không phải tracking đã được renderer tự thực hiện.

Dùng cùng profile cho nội dung mới để giữ DNA. Những thứ có thể đổi trong mẫu: câu chuyện, cụm nghĩa, mốc giọng, số dòng hợp lý, điểm nhấn/mode được phép. Những thứ không tự đổi ngẫu nhiên: palette/font, quy tắc khuôn mặt/giọng, vùng chữ, mật độ và nhịp nền của mẫu.

## Phạm vi hỗ trợ

Lỗi cài đặt hoặc không thực hiện đúng mẫu đã công bố cần được sửa như lỗi của gói. Một style/brand/template mới ngoài mẫu là phạm vi setup riêng do người phụ trách sản phẩm báo giá. Không tự suy giá, SLA hoặc thời hạn hỗ trợ.

Proof hình học cho thấy hai profile khác nhau với cùng text/clock và profile A giữ cấu hình với input mới. Nó không chứng minh người nói thật, căn giọng, phiên Codex độc lập hoặc giá trị thương mại đã được nghiệm thu.
