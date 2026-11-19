# Trạm Video — open source

**Skill hiện tại: codex-video-captions 0.3.0-beta.4.** [Cài một lần, sau đó gửi link](FOR-CODEX.md), [hướng dẫn](codex-skills/README.md), [ZIP mới](downloads/codex-video-captions-0.3.0-beta.4.zip). Một entry `$codex-video-captions`: sub theo nghĩa/gu, word motion chọn lọc, hook/cảnh, phone/matte có điều kiện, optional offline ASR và audio QA. Không chứa dữ liệu khách hoặc Trạm SaaS.

Đây là beta dùng cục bộ, không bảo đảm mọi máy/format hoặc chất lượng tự động từ một lệnh. Read capability/setup; thiếu phải báo rõ, không fallback starter yếu. Code MIT; font/dependency có điều khoản riêng.

Phần dưới giữ renderer OSS **legacy**, không phải lệnh chạy skill hiện tại.

## Chạy nhanh

Cần Node.js 22.13 trở lên và npm. Chromium dùng để render sẽ được Remotion tải ở lần chạy đầu (cần Internet và dung lượng đĩa). Linux cần các thư viện hệ thống cho Chrome Headless Shell.

```sh
npm install
npm test
npm run typecheck
npm run plan -- examples/transcript.json
npm run render
```

Kết quả: `out/video.mp4`. Ví dụ đi kèm là chữ và hình minh họa tổng hợp, không có footage hoặc giọng nói riêng tư.

### Dùng video của bạn

Tạo transcript JSON giống `examples/transcript.json`: `duration`, `segments` gồm `start`, `end` (giây), `text`. Các đoạn phải theo thứ tự, không chồng nhau, tối đa 80 đoạn, tối đa một giờ. `duration` phải khớp độ dài video; chưa có kiểm tra tự động độ dài tệp.

```sh
npm run plan -- transcript.json /path/to/your-video.mp4
npm run render
```

Video được sao chép vào `public/local/`, giữ tiếng gốc. Transcript điều khiển mốc minh họa và phụ đề; bản này không tự nhận lời, không tự cắt khoảng lặng, không ghép nhiều clip và không có chat AI. Đầu vào nên là video dọc 9:16; hình khác tỷ lệ được crop ở giữa.

```sh
npm run dev
```

Mở URL Remotion Studio được in trong terminal. Để xem nội dung tùy chỉnh, truyền `--props=out/props.json` khi khởi chạy Studio. Mốc dựng cố định 30 fps, 1080×1920; có thể sửa các scene trong `out/props.json` trước khi render.

## Cách hoạt động

1. Kiểm tra transcript.
2. Chọn vật thể minh họa bằng quy tắc tiếng Việt: điện thoại, ánh sáng, khó khăn, quy trình…
3. Ghép phụ đề và các cảnh chuyển động với video gốc.
4. Remotion xuất MP4 trên máy.

Bộ quy tắc không hiểu mọi câu và có thể chọn minh họa chưa phù hợp. Phụ đề theo cụm được chia thời gian xấp xỉ từ transcript, không phải căn từng từ bằng ASR. Hãy xem lại video và chỉnh scene trước khi đăng. Chưa có tuyên bố hiệu quả, số sao hoặc số người dùng.

## Quyền riêng tư và giấy phép

Không cần khóa API; mã ứng dụng không gửi video hay transcript lên dịch vụ AI. Lần cài dependency và tải trình duyệt vẫn cần mạng. Không mở cổng Studio ra Internet khi đang dùng footage cá nhân. `public/local`, `out`, `.env*` được bỏ qua trong Git; chỉ chia sẻ tài liệu bạn có quyền sử dụng.

Mã do dự án cung cấp: MIT, xem [LICENSE](LICENSE). Font Be Vietnam Pro: SIL OFL 1.1, xem [public/fonts/OFL.txt](public/fonts/OFL.txt). Remotion và các dependency giữ giấy phép riêng; MIT của dự án không thay thế điều kiện sử dụng của dependency. Kiểm tra điều khoản Remotion cho trường hợp sử dụng của bạn.

## Đóng góp

Xem [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md) và [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Hướng phát triển: tích hợp ASR local tùy chọn, thêm minh họa đúng nghĩa, hỗ trợ video ngang và tài liệu dễ cài hơn.



## Skill hiện tại và lịch sử

Dùng [FOR-CODEX.md](FOR-CODEX.md) để tải bản mới nhất theo SHA-256 công bố. Installer managed giữ dữ liệu/DNA và backup ngoài skills discovery; cài đặt chưa phải workflow dựng video.

Bản0.2.0-beta.1 giữ trong [legacy](codex-skills/legacy/codex-video-captions-0.2.0-beta.1/) và [ZIP cũ](downloads/codex-video-captions-0.2.0-beta.1.zip); ZIP20261112/lịch sử/source legacy vẫn nguyên. Không dùng link cài cũ làm mặc định.

Bản gói bất biến: `9429a2563c31abcd06e39377ce7db99321367742`. ZIP SHA256: `d49be39ec166a119f67d76059a891bc6c2e44e8c0815f2d7e60df053dcf486bd`. Kiểm hash trước cài theo [FOR-CODEX](FOR-CODEX.md).
