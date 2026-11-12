# Dùng trên máy mới

## Công cụ

- Codex với tài khoản của người nhận và các công cụ đã được cấp.
- Python 3.9+ cho cài đặt và chuẩn bị gói quan sát.
- Node.js phiên bản phù hợp `assets/starter/package.json`; FFmpeg/ffprobe có trong PATH hoặc truyền đường dẫn thực tế.
- Remotion/React trong dự án dựng. Kiểm tra điều kiện giấy phép của công cụ cho trường hợp sử dụng của người nhận; bộ skill không cấp giấy phép bên thứ ba.

Không kèm API key, tài khoản Codex, thư viện nhạc thương mại hay model local. Không tự lấy tài khoản/khóa từ máy cũ. Cài skill không cài cả hệ thống Trạm, kho media, dữ liệu khách hay chatbot.

## Bộ dựng mẫu

`assets/starter` là bản scaffold từ mã nguồn MIT công khai `manhlifecom-prog/tram-video`, giữ LICENSE và THIRD_PARTY_NOTICES. Nó minh họa transcript tiếng Việt và chuyển động theo câu/segment; không chứng minh độ giống một video mẫu cụ thể.

Sao chép starter sang thư mục làm việc mới trước khi sửa, không render bên trong thư mục skill. Đọc README và `package.json` của starter; dùng Node tương thích, cài dependencies trong bản sao rồi chạy các lệnh `test`, `typecheck`, `plan`, `dev` hoặc `render` được khai báo. Đặt nguồn và cấu hình đầu vào theo README, không dùng sample transcript làm lời thật của khách.

Các helper bổ sung trong `assets/motion` độc lập với file nguồn: focus camera, chữ số dẫn bước, tái tổ chức tài liệu. Chúng là primitive để tích hợp vào composition, không tự tạo video đẹp khi chỉ import. Kiểm các input và frame trước/giữa/sau của cơ chế, đồng thời giữ source clock liên tục.

## Chuẩn bị quan sát video mẫu

Chạy script từ thư mục skill thực tế, chẳng hạn:

```sh
python3 scripts/prepare_study.py /path/reference.mp4 --output /path/study-packs --ffmpeg /path/ffmpeg --dense 6:12
```

Đọc `--help` trước khi truyền mốc. Script tạo overview, frame dày, audio/waveform và hash cache. Nó không tự nghe, tự duyệt hay học xong mẫu; đọc `references/reference-learning.md` để làm phần phân tích và thử tái tạo.

## Token

Tái sử dụng hash nguồn, transcript đã đối chiếu, EDL, asset và quan sát không đổi. Sửa hình không nhận lời lại; sửa một vùng không gửi cả kho tư liệu mỗi lượt. Chỉ gọi công cụ/model khi cần quyết định hoặc dữ liệu mới. Không đánh đổi việc nghe mối nối và kiểm thành phẩm lấy báo cáo tiết kiệm token.
