---
name: tram-video-studio
description: Tên gọi tương thích của bộ Trạm Video cũ; chuyển yêu cầu dựng video người nói và phụ đề sang codex-video-captions phiên bản0.3.0-beta.1 đã cài cùng gói.
metadata:
  version: 0.3.0-beta.1
---

# Chuyển sang skill hiện tại

Đây là entrypoint tương thích, không còn là quy trình dựng cũ2026.11.12. Khi được gọi bằng `$tram-video-studio`, đọc và thực hiện [skill hiện tại](../codex-video-captions/SKILL.md), gồm công thức sub theo nghĩa/mốc giọng và DNA cục bộ tường minh. Không tiếp tục chia đều timing hoặc tự suy style từ tài nguyên legacy còn trên máy.

Nếu không tìm thấy `codex-video-captions`, dừng phần dựng và đọc [hướng dẫn cài bản mới](https://github.com/manhlifecom-prog/tram-video/blob/main/FOR-CODEX.md). Không chạy workflow cũ thay thế âm thầm. Bộ cài sao lưu entrypoint cũ; tài nguyên/DNA riêng trong thư mục cũ được giữ nguyên.

Bản mới là beta workflow video người nói theo brief; đọc capability/setup của cùng entry trước khi làm. Không suy từ renderer legacy rằng bản mới hỗ trợ mọi format, tracking, ASR, đăng mạng xã hội hoặc một lệnh dựng xong từ raw. Gọi `$codex-video-captions` để chọn rõ bộ mới.
