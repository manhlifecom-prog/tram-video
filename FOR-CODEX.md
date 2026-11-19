# Dán vào Codex để cài skill0.2.0-beta.1

Bản thử công khai, không cần token/API key/tài khoản Trạm. Câu nhắn này chỉ tải và cài; chưa render hoặc đòi bạn đưa video trước cài.

```text
Hãy cài skill codex-video-captions0.2.0-beta.1 từ gói công khai https://raw.githubusercontent.com/manhlifecom-prog/tram-video/ad7232e6cdd76bcb652ef4272813b5e696027083/downloads/codex-video-captions-0.2.0-beta.1.zip . Kiểm SHA256 phải đúng 9616b3187c5a7c81a748159639aed9a154235f6c6a6cb7737ae3988e72fcc913 trước khi giải nén. Tải bằng Python/Node hoặc công cụ mạng sẵn có, không curl|sh; từ chối path traversal/symlink khi giải nén vào thư mục tạm riêng. Đọc README, LICENSE, INSTALL.md và install.py; kiểm SHA256 install.py phải là f3f9038dca42be9b2cc8202e2815d64fc7305e609efde03ae465c9563256569e. Chạy --check, --dry-run rồi cài vào thư mục skills Codex của tôi; giữ backup entrypoint/code cũ và giữ nguyên DNA/input/assets riêng. Khởi tạo workspace riêng cho nguồn/DNA/bản xuất. Không tự cài công cụ hệ thống hoặc tắt sandbox; báo đúng công cụ còn thiếu cho bước render sau. Kiểm có skill codex-video-captions và tên cũ tram-video-studio trỏ sang bản mới. Báo version/nơi cài/backup và nhắc mở chat mới nếu cần. Chỉ sau khi cài xong, nếu tôi chưa cấp nguồn thì hỏi một câu: Bạn muốn dùng video nào?
```

Commit gói: `ad7232e6cdd76bcb652ef4272813b5e696027083`. ZIP SHA256: `9616b3187c5a7c81a748159639aed9a154235f6c6a6cb7737ae3988e72fcc913`.

Đã kiểm6 tests installer trên Mac với target/workspace tạm: fresh install, second install không đổi, migrate entrypoint cũ có backup, giữ custom DNA/input, dry-run và chặn symlink.10 tests validator/timing/cache đạt;5 geometry demos giữ nguyên. Sau phát hành kiểm lại ZIP tải ẩn danh và fresh clone. Chưa kiểm Windows thật, clean dependency install/clean machine, raw-to-final độc lập hoặc nghe/xem chủ quan toàn phim. Đây không là cam kết một lệnh dựng xong hay sản phẩm sẵn bán.

Không gửi video, DNA, mật khẩu hoặc token trở lại repo public. Code giữ MIT của dự án; font/dependency có giấy phép riêng.
