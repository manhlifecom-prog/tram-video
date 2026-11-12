# Bộ skill dựng video Trạm — gói công khai

Tên gọi trong Codex: **`$tram-video-studio`**. Gói chứa quy trình dựng theo nội dung, học mẫu theo mốc, script chuẩn bị quan sát, ba motion primitive và scaffold Remotion MIT để bắt đầu. Đây là bộ skill dùng độc lập, không phải toàn bộ ứng dụng/máy chủ Trạm hoặc toàn bộ thư viện mẫu đã duyệt.

## Cài trên máy khác

1. Tải [ZIP skill](https://github.com/manhlifecom-prog/tram-video/raw/refs/heads/main/downloads/tram-video-studio-20261112.zip). Gói chỉ chứa skill và công cụ mẫu, không chứa dữ liệu vận hành Trạm.
2. Người nhận giải nén vào thư mục riêng. Cần có Codex và Python 3.9+.
3. Mở Terminal tại thư mục chứa `install.py`, chạy:

   macOS/Linux: `python3 install.py`

   Windows: `py install.py`

4. Đóng/mở lại Codex, vào dự án video riêng và gọi `$tram-video-studio`.

Có thể nhờ Codex trên máy mới: **“Đọc gói skill này, kiểm tra manifest rồi chạy install.py để cài tram-video-studio. Không cài dependencies hay render cho đến khi tôi đưa video.”**

`--check` chỉ kiểm hash. `--target /path/to/skills` chọn nơi cài khác; mặc định dùng `$CODEX_HOME/skills` hoặc `~/.codex/skills`. Bản skill cũ được chuyển vào `skill-backups`, không xóa âm thầm. Muốn gỡ, xóa riêng thư mục `tram-video-studio` trong nơi đã cài; muốn khôi phục, dùng bản sao lưu.

## Sử dụng

Ví dụ: **“Dùng $tram-video-studio, xem các clip trong thư mục tôi cấp, tóm tắt nội dung và đề xuất hướng dựng. Giữ giọng thật, cắt trọn âm, minh họa theo nghĩa; chỉ dùng nhạc tôi cung cấp. Xuất bản dọc 1080p và bản xem nhẹ sau khi chốt hướng.”**

Để học mẫu: cung cấp video tham khảo có quyền sử dụng và yêu cầu phân tích cơ chế chữ/chuyển động/âm theo mốc, dựng đoạn đối chiếu bằng footage của người dùng. Không yêu cầu sao chép danh tính, nhạc hoặc toàn bộ video của người khác.

Người nhận dùng tài khoản Codex/công cụ của họ. FFmpeg/ffprobe, Node.js và Remotion chỉ cần khi thực hiện bước tương ứng; đọc `references/tools.md`. Không kèm API key, gói token, nhạc thương mại, video khách, gu cá nhân, cookie, chứng chỉ ký app hoặc quyền vào máy Trạm. Không chạy background worker, không gọi dịch vụ chủ Trạm, không tự đăng mạng xã hội.

## Phạm vi công khai và bảo mật

- Gói được phát hành công khai trong repo MIT `manhlifecom-prog/tram-video`. Mọi người có thể tải, sử dụng, sửa và chia sẻ lại theo giấy phép; giữ thông báo tác giả/giấy phép đi kèm.
- Không có cơ chế DRM hay khóa skill theo người dùng. Nội dung public sẽ đọc được; không đặt bí mật trong skill.
- Bộ cài không dùng mạng, không xin quyền vào Trạm và kiểm SHA-256 trước khi thay đổi thư mục skill. Manifest phát hiện hỏng/đổi file, không thay thế chữ ký số.
- Video, transcript, brief, tài khoản, khóa API và phong cách riêng của từng người phải nằm trong dự án riêng, không commit ngược vào gói.

Scaffold `assets/starter` giữ giấy phép MIT và thông báo bên thứ ba của dự án `manhlifecom-prog/tram-video`. Không có bảo đảm mọi mẫu dựng giống tham khảo; cần kiểm thành phẩm thực tế theo quy trình kèm gói.
