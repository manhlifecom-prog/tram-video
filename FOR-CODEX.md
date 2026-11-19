# Cài và dùng codex-video-captions0.3.0-beta.1

Một entry, workflow người nói cục bộ đầy đủ hơn bản0.2; không cần tài khoản Trạm hoặc token GitHub để tải. Gói không chứa video/giọng/nhạc/DNA khách. Cài skill khác với chạy workflow hay nghiệm thu video. Không tuyên bố mọi máy/format hoặc một câu lệnh tự bảo đảm chất lượng sáng tạo.

## 1. Dán vào Codex để cài

```text
Hãy cài codex-video-captions phiên bản0.3.0-beta.1 từ https://raw.githubusercontent.com/manhlifecom-prog/tram-video/9429a2563c31abcd06e39377ce7db99321367742/downloads/codex-video-captions-0.3.0-beta.1.zip . Kiểm SHA256 đúng d49be39ec166a119f67d76059a891bc6c2e44e8c0815f2d7e60df053dcf486bd trước khi giải nén vào thư mục tạm riêng, từ chối path traversal và symlink. Đọc SKILL.md, LICENSE, README.md và references/setup-and-install.md; kiểm scripts/install.py SHA256 d6286a866afd08d55c67490347edb6a6902354446130368cb772831fbf809398. Chạy --check-only với --skills-dir là thư mục skills Codex thật của tôi, rồi cài cùng target. Nếu đã có bản managed, dùng --upgrade và --backup-dir nằm ngoài skills discovery; giữ nguyên DNA, nguồn, cấu hình, assets riêng và skill khác. File managed tự sửa phải được giữ, báo rõ thay vì đè. Không curl|sh, không tắt sandbox hay tự cài công cụ hệ thống/model. Xác nhận version, nơi cài và backup; cài skill chưa phải dựng xong video. Nếu chưa có nguồn, chỉ hỏi tôi muốn dùng video nào.
```

Package commit: `9429a2563c31abcd06e39377ce7db99321367742`. ZIP SHA256: `d49be39ec166a119f67d76059a891bc6c2e44e8c0815f2d7e60df053dcf486bd`. Module manifest SHA256: `858198eb131e8c413aa00c85815a2b0c70811f38e032ec92278b7fc1b973454d`.

## 2. Dán vào Codex để làm video

```text
Dùng $codex-video-captions phiên bản 0.3.0-beta.1 để dựng hoàn chỉnh video tôi cung cấp. Đọc đúng SKILL/version/path, kiểm job và artifact hiện có trước khi chạy để tránh làm trùng. Dùng brief, người nói, giọng thật, palette và gu của tôi; đừng áp DNA Trang An/Mạnh. Kiểm nguồn, quyền tài nguyên và dependency cục bộ; thiếu năng lực phải nói đúng, không âm thầm chạy starter yếu. Hiểu toàn lời, giữ nghĩa/phủ định, đề xuất EDL trọn cụm; cắt sạch không thừa âm/mất nửa âm, nghe từng nối và giữ tốc độ giọng. Làm hook nổi bật. Đầu tư MAX có chủ đích nhưng nền sub ổn định theo cụm; chỉ nhấn word/key/hero khi đúng cảm xúc, không mọi chữ nảy hay hiện từng từ. Timing theo anchor nguồn, không lộ ý sớm hoặc vào trễ cả nhóm. Minh họa phải chuyển động bám nghĩa; dùng công cụ tạo ảnh sẵn có khi được phép, B-roll chỉ khi đẹp/đúng ý/quyền rõ, không filler. Chọn nhạc đúng gu/nguồn đã được phép, SFX đúng vật liệu và tiếp xúc, giọng rõ; kiểm nhạc thật có trong đầu–giữa–cuối master. Dựng và kiểm MP4 thực tế, giữ lịch sử sửa; chưa xem/nghe được thì ghi đúng phần pending, không tự nhận đã duyệt sáng tạo. Trả video thành phẩm riêng cho tôi xem.
```

Trong Codex, dùng literal `$codex-video-captions` (tên skill), phiên bản0.3.0-beta.1 là yêu cầu chọn bản, không phải tên một skill thứ hai. Nội dung đầu vào/gu là của người dùng hiện tại. Không gửi nguồn riêng hoặc credentials vào GitHub. Công cụ tạo ảnh/model/provider trả phí cần khả năng thực tế và quyền riêng; gói này không tự sinh ảnh, tải ASR/model hoặc cấp quyền đăng bài.

## Phạm vi kiểm chứng

Gói đã qua QA static: manifest/hash/closure/privacy/font thật/OFL,12tests contract và fixture installer/dependency guards. Đây không phải clean-machine render, Windows thật, generic fullmix/ASR execution hoặc kiểm nghe liên tục. Node/package/browser/FFmpeg và optional MLX/Vision phải được kiểm trên máy dùng thật. Code giữ MIT của repo; font SIL OFL1.1 và Remotion/dependency giữ điều khoản riêng. Legacy0.2 và ZIP cũ được giữ để khôi phục, không là link cài mặc định.
