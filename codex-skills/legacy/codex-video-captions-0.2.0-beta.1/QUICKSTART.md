# Bắt đầu trên máy của bạn

## Yêu cầu

Có Codex đã đăng nhập bằng tài khoản của bạn; Node tương thích package.json, Chrome và công cụ media local. Không nhập API key vào brief hoặc project. Bản Mac đã kiểm kỹ thuật bằng dependency có sẵn; các lệnh cài mới bên dưới là hướng dẫn, **chưa được kiểm trên máy sạch**. Windows chưa kiểm.

Mở thư mục gói trong Codex và nhắn: “Đọc SKILL.md, dùng video/brief của tôi để dựng; kiểm nguồn và thời gian lời trước khi làm chữ. Giữ bản cũ khi sửa.” Đưa video do bạn có quyền dùng và brief theo `examples/input-brief.json`. Không đưa tài khoản/mật khẩu vào brief.

## Chạy demo kỹ thuật

Trong thư mục có package.json:

```sh
npm install
npm run check
node scripts/check-input.mjs examples/profile-a-same-input.json
node scripts/render.mjs --input examples/profile-a-same-input.json --output proof/my-demo-a.mp4 --scale 0.5
node scripts/render.mjs --input examples/profile-b-same-input.json --output proof/my-demo-b.mp4 --scale 0.5
node scripts/render.mjs --input examples/profile-a-new-input.json --output proof/my-demo-a-new.mp4 --scale 0.5
```

`npm install` cần kết nối tải dependency và chưa được kiểm clean install. Renderer cần mở localhost và chạy Chrome trong phạm vi project; nếu sandbox chặn loopback sẽ báo lỗi, chưa có bảo đảm mọi môi trường Codex đều cho phép. Không bỏ sandbox/global config để giả thành PASS. Renderer chỉ tìm Chrome đã có trên máy, không tự tải browser. Nếu chưa tìm được, chỉ rõ executable bằng `--browser /path/to/chrome` hoặc biến `CHROME_EXECUTABLE`. Không dùng đường dẫn máy demo của người khác. Windows dùng PowerShell với đường dẫn executable được đặt trong dấu nháy.

Giữ tên output mới cho mỗi lần sửa; script sẽ từ chối ghi đè. MP4, PNG và receipt nằm cạnh nhau. Các input demo dùng geometry tự tạo và mốc hình học, **không có voice/ASR**.

## Dùng nguồn người nói thật

1. Đặt bản sao nguồn có quyền dùng vào `public/input/my-video.mp4`; giữ bản gốc ngoài project.
2. Cùng Codex xem/nghe nguồn, chốt cắt thô và ánh xạ mốc giọng qua EDL nếu có cắt. Không lấy câu demo hoặc timing demo cho nguồn mới.
3. Chọn profile DNA cục bộ theo PROFILE-GUIDE; thiếu profile sẽ dừng, không suy style mặc định. Tạo input JSON theo schema, `source.kind="video"`, `source.file="input/my-video.mp4"`, ghi provenance/quyền; chọn timingBasis nguồn thật, `duration` phù hợp và đủ tokenOnsets. Starter hỗ trợ canvas1080×1920,1–90giây,24/25/30fps. File media phải nằm trong public/ của project và không là URL từ xa.
4. Codex chốt lines, key, cỡ chữ và mode theo ý/cảm xúc, rồi chạy validator trước render. `--scale 1` là output1080×1920; `--scale 0.5` là540×960 để kiểm nhẹ. Tùy video, Codex cần sửa composition để crop/focus/EDL phù hợp; renderer không tự làm các bước này.
5. Xem lại MP4, nghe giọng/sub ở điểm nhấn, kiểm dấu/vùng mặt và góp ý theo mốc. Lưu input/output mới, giữ phần nguồn/clock không bị yêu cầu sửa.

## Điều chưa được chứng minh bởi demo

Demo render thành công không chứng minh tài khoản Codex mới đủ hạn mức, clean install chạy được, AI hiểu video đúng, sub khớp cảm xúc hoặc tự hoàn thành từ raw tới final. Cần một pilot nguồn người nói có quyền rõ và một vòng sửa thực trong phiên Codex độc lập trước khi bỏ các gate này.

`examples/demo-v1.json`, `demo-v2.json` và hai proof cùng tên được giữ nguyên từ kiểm kỹ thuật trước khi thêm profile, để bảo toàn hash và vòng góp ý. Chúng không có profileId, nên validator hiện tại sẽ yêu cầu thêm cấu hình DNA; dùng ba input profile ở trên cho renderer hiện tại. Không lấy những clock hình học này cho giọng thật.
