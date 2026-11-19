# Công thức phụ đề theo nghĩa

Áp dụng theo brief và gu của từng người dùng. Đây là phương pháp và cơ chế, không phải bắt mọi người dùng nhận một màu, font hoặc mật độ hiệu ứng cố định.

| Bước | Quyết định và đầu ra | Điều giữ nguyên |
|---|---|---|
| Hiểu câu | Ý chính, người nói, phủ định/điều kiện/quan điểm, cảm xúc; chỗ cần đủ lời, ý chính hoặc nhường hình. | Không rút câu hỏi thành kết luận; không bịa dữ kiện. |
| Bố cục | Chốt cụm nghĩa và lines; đo font; lead nhỏ/key lớn hợp lý. | Giữ cụm nhấn nguyên dòng; chia lại ý trước khi co chữ quá nhỏ. Không ép mọi câu cùng hai tầng. |
| Căn giọng | ASR/word/phrase nguồn ánh xạ qua EDL; tokenOnsets giây tương đối từ cue.start. | Không cho chữ ra trước ý; không dùng delay chung hoặc nội suy đều. Sub dịch căn nghĩa nguồn. |
| Diễn chữ | Chọn cách thể hiện theo ý/cảm xúc với lý do; ưu tiên reveal đơn giản, thỉnh thoảng một điểm nhấn. | Không một kiểu cả phim, không quay vòng preset, không buộc đủ loại hiệu ứng. |
| Kiểm và sửa | Khung trước/onset/sau, bố cục, dấu, vùng mặt, MP4 mới và phản hồi nguyên văn. | Kiểm kỹ thuật không thay xem chuyển động/nghe; giữ lịch sử version. |

## Chuẩn bị dữ liệu

- Mỗi cue có start/end/text/key và choice: mode/emotion/reason, lines, bodySize/keySize, tokenOnsets.
- Lines ghép lại phải giữ nguyên câu/dấu. Chốt cụm trước; từ nhấn nằm cùng một dòng. Ví dụ “Lúc đầu là để chăm lo” ở dòng dẫn, “cho gia đình” nguyên dòng nhấn bên dưới; không bắt mọi câu giống ví dụ.
- TokenOnsets có một mốc cho từng token whitespace, tăng không giảm. Cùng cụm có thể chung mốc. Chế độ từng từ cần wordOnsets tường minh, không dùng fallback đều của helper.
- Với tiếng nói khác ngôn ngữ sub: giữ bảng nghĩa→anchor nguồn; chỉnh trật tự dịch nếu cần mà vẫn giữ phủ định/điều kiện/mức độ. Không cho từ cảm xúc xuất hiện sớm để giữ một trật tự dịch cũ.
- Summary/icon/behind cần clock nghĩa riêng. Starter renderer0.1.0 chưa nhận summary input; muốn dùng cần Codex mở rộng schema/validator và composition cùng lúc, rồi kiểm lại. Không bypass validator để dùng timing fallback.

## Cách nghiệm thu

Chọn các mốc nhấn, rà0.1–0.2giây trước và sau anchor trong bản MP4 mới; nghe cả câu khi có thể. Rà toàn timeline để phát hiện lặp kiểu hoặc chữ dồn. Dấu tiếng Việt, dấu câu, dòng dài, font thực và vùng an toàn đều phải đọc rõ sau transform. Nếu chỉ có ASR và ảnh thì ghi đúng phần đã kiểm, không nhận đã nghe hoặc đủ cảm xúc toàn phim.

Nếu mốc source cuối câu không đủ cửa sổ đọc của validator, không kéo onset lên trước tiếng để lấy PASS. Giữ mốc thật, cân nhắc sub ý chính đúng nghĩa hoặc chỉnh phạm vi cue theo phần nghỉ có thật và kiểm lại. Kiểm source clock và từ nhấn là bước riêng sau schema; một input đủ mảng onsets vẫn có thể làm ý chính hiện sớm.
