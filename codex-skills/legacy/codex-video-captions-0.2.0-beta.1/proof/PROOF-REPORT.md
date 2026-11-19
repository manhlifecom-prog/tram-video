# Technical proof ·0.1.0

Candidate kỹ thuật nội bộ, chưa phát hành. Tất cả MP4 trong thư mục này là hình học tự tạo và silence, không có mặt, giọng, media khách hoặc câu phát ngôn của tác giả khác.

## Đã chạy và kiểm

- Mac, Node24.22.3, Remotion4.0.537/React19.2.3 từ dependency hiện có liên kết vào stage tạm riêng; không sao node_modules vào gói, không chạy clean install. Browser headless hiện có trên host, không tải mới.
- Năm MP4 thực, mỗi bản8giây,540×960,24fps,H264/yuv420p; receipt cạnh file ghi input/output/helper/profile hash và giới hạn. FFmpeg decode toàn bộ5file exit0, không lỗi, tại decode-checks.json.
- `demo-v1.mp4` → phản hồi `examples/feedback-v2.json` → `demo-v2.mp4`: key “hiểu rõ.” xuống dòng riêng, giảm cỡ và bỏ nảy; giữ nguồn, cue2 và clock. Hai input gốc được giữ nguyên; chúng có trước phần DNA nên thiếu profileId và không dùng trực tiếp với validator hiện tại.
- `profile-a-same-input.mp4` và `profile-b-same-input.mp4`: cùng text/cue/source clock, khác local profile. PNG tại2.2s đã xem: A tối/vàng, B sáng/xanh trầm với cỡ/vị trí khác. B được giảm shadow sau khi review ảnh bản nháp.
- `profile-a-new-input.mp4`: nội dung mới nhưng profileHash giống A, không xoay preset. New cues dùng reveal đơn giản rồi một shine có lý do.
- `DNA-CHECK.json` ghi so sánh input và profile/output fingerprints. `validator-tests.log`:10testsPASS, gồm chặn clock thiếu/sai, vỡ cụm, nguồntraversal/URL, geometry giảASR, thiếuDNA và mất điều kiện giữ mặt/giọng.
- TypeScript helper/adapter/composition đã kiểm bằng dependency-link stage, exit0. `node --check` render script đạt. Validator chuẩn skill-creator của host chưa chạy được vì thiếu PyYAML; không cài thêm hoặc tự báo PASS thay.

## Không suy ra từ proof này

Chưa kiểm clean dependency install, clean machine Mac, Windows, learner account mới/hạn mức, căn giọng người thật, tracking speaker, chất lượng nghe hoặc xem chuyển động liên tục. Có một lượt thử riêng trên nguồn người nói do chủ cấp với hai lượt Codex và bản sửa thủ công, chỉ trong private evidence ngoài ZIP; không đóng media/nhận diện đó vào gói. Direct Codex workspace-sandbox render đang bị chặn khả năng loopback, nên không coi demo này là bằng chứng raw→Codex→MP4 tự chạy đã đạt.

Renderer cần quyền chạy browser, localhost và cache trong project. Script đã tắt Webpack persistent cache dưới node_modules; vẫn cần khả năng localhost của môi trường. Không bỏ sandbox hoặc đổi global config để giả gate đã qua.

Gate Bảo QA/duyệt mẫu người nói thật, quyền phát hành và điều khoản phân phối còn chờ. Không mô tả candidate này là universal skill, one-click hoặc100%offline.

Independent QA found a real reusable-bundle asset issue: Remotion copies public files into the bundle, so code-only cache identity could reuse stale media/font bytes. Final renderer now streams hashes of code/example/profile/package/public inputs. Three extra tests verify unchanged bytes reuse identity, same-name/new-file source changes invalidate identity, and font/helper changes invalidate it. No extra render/model call was needed for this deterministic cache correction.
