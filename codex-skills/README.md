# Skill Trạm Video ·0.2.0-beta.1

Bản thử công khai hiện tại: **`$codex-video-captions`**. Dùng Codex trên máy của bạn, không cần tài khoản Trạm hoặc API key. Đọc [câu nhắn dán vào Codex](https://github.com/manhlifecom-prog/tram-video/blob/main/FOR-CODEX.md) để tải bản ghim commit và kiểm SHA256 trước cài.

[Tải ZIP mới](../downloads/codex-video-captions-0.2.0-beta.1.zip) · [Cài và nâng cấp](INSTALL.md) · [Phạm vi mẫu](codex-video-captions/README.md) · [DNA riêng](codex-video-captions/references/PROFILE-GUIDE.md)

Gói có skill/code/validator/renderer,5 video hình học tự tạo và font OFL; không có người thật, giọng, video khách, token, dữ liệu máy chủ hoặc nhạc riêng. Demo không chứng minh chất lượng dựng người nói, căn giọng hoặc một lệnh dựng xong.

## Cài sau khi tải và kiểm gói

Đọc install.py, chạy `python3 install.py --check`, sau đó `python3 install.py`. Windows dùng `py install.py`; Windows thật chưa được kiểm. Bộ cài dùng Python3.9+ standard library, không tải dependency, không thay quyền máy hoặc sandbox.

Mặc định chọn `$CODEX_HOME/skills` hoặc `~/.codex/skills`; tạo workspace riêng `~/Documents/CodexVideoProjects` cho input/output/dna/projects. Chọn `--target` và `--workspace` khác nếu cần. `--dry-run` chỉ kiểm kế hoạch, không ghi file.

Cài lại cùng bộ code không thay file giống hệt. Code/entrypoint được quản lý có thay đổi sẽ được backup trước; không xóa file ngoài manifest. Profile/example người dùng đã sửa được giữ và báo rõ. Tên gọi cũ `$tram-video-studio` được cập nhật thành router tới bản mới; tài nguyên khác trong thư mục cũ không bị xóa. Không tự chọn DNA demo A/B cho nguồn thật.

Đóng/mở lại Codex hoặc tạo chat mới. Chưa có video thì chỉ cài và kiểm, chưa render. Sau đó gọi `$codex-video-captions` với nguồn bạn có quyền dùng. Node/Remotion/Chrome/FFmpeg/ffprobe chỉ cần cho bước dựng/kiểm tương ứng; nếu thiếu, dùng cách cài thông thường có quyền người dùng cho phép, không tắt sandbox hoặc hạ bảo mật.

## Giới hạn

Đã kiểm validator/reading-window/cache identity10tests và5 demo geometry; proof Mac dùng dependency có sẵn. Installer được kiểm fresh target, second install, backup legacy entrypoint, giữ customDNA/input, dry-run và chặn symlink.

Chưa kiểm Windows thật, máy sạch cài dependency, clean learner account từ raw tới final hoặc nghe/xem chủ quan toàn phim. Renderer cần localhost/browser. Không kèm hạn mức Codex, dịch vụ Trạm hoặc tự đăng bài. Không tuyên bố sẵn bán/one-click/mọi format.

## Bản cũ và giấy phép

[ZIP legacy2026.11.12](../downloads/tram-video-studio-20261112.zip) và [tài liệu legacy](legacy/README-20261112.md) chỉ để tham khảo/khôi phục, không là bản cài mặc định. Lịch sử Git, assets cũ và renderer OSS ở repo root giữ nguyên.

Code giữ MIT của dự án, font SIL OFL1.1, dependency theo điều kiện riêng gồm Remotion. Public beta không phải duyệt khóa học, giá hoặc SLA. Giữ nguồn, DNA và đăng nhập riêng ngoài repo public.
