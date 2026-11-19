# Cài bộ skill hiện tại

Dùng câu nhắn tại FOR-CODEX của repo để Codex tự tải ZIP ghim commit và kiểm SHA256. Không cần clone, token GitHub, API key hoặc tài khoản Trạm.

Sau khi tải/kiểm hash/giải nén an toàn: đọc README/LICENSE/install.py; chạy `python3 install.py --check`, rồi `python3 install.py`. `--dry-run` không ghi target hoặc workspace. Bộ cài không cần video, không cài dependency hoặc chạy render. Đóng/mở lại Codex hoặc tạo chat mới, gọi `$codex-video-captions`; tên cũ `$tram-video-studio` chuyển tới cùng bản mới.

Windows dùng `py` nếu Python3.9+ đã có; Windows thật chưa kiểm. Nếu thiếu Python/runtime, báo rõ công cụ cần cài theo cách thông thường và quyền người dùng cho phép. Không chạy curl|sh, xin quyền toàn máy hoặc tắt sandbox.

Chọn nơi cài khác bằng `--target /your/codex/skills --workspace /your/video-workspace`; `--no-workspace` chỉ cài skill. Workspace riêng mặc định có input/output/dna/projects. profile.example.json chỉ là mẫu để đọc, chưa là DNA được chọn.

## Nâng cấp/khôi phục

Chỉ file trong manifest được quản lý. Code/docs thay đổi có backup trong skill-backups cạnh skills; không xóa bản sao tự động. Entry tram-video-studio/SKILL.md cũ được backup trước khi chuyển router; assets/input/DNA khác không bị xóa. Profile/example mới đã bị sửa được giữ và báo trong preservedCustomData. Source/output/workspace không bị cập nhật đè. Cài lần hai cùng bộ code không tạo backup mới chỉ vì chạy lại.

SHA256 phát hiện tải hỏng/thay file, không phải chữ ký số hay bảo đảm chất lượng video. Nguồn và thông tin riêng không đưa vào repo public.
