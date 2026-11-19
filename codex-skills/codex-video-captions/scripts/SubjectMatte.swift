// Local per-frame person matte. Input must already be upright, SDR and CFR.
// Never adds or replaces a person; outputs only grayscale masks and frame times.
import Foundation
import AVFoundation
import Vision
import CoreVideo

@main struct SubjectMatte {
  static func main() async throws {
    guard [3,4].contains(CommandLine.arguments.count) else { throw Failure("Usage: SubjectMatte input.mp4 output-directory") }
    let pipeMode = CommandLine.arguments.count == 4 && CommandLine.arguments[3] == "--pipe"
    let input = URL(fileURLWithPath: CommandLine.arguments[1])
    let output = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
    try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
    let asset = AVURLAsset(url: input)
    guard let track = try await asset.loadTracks(withMediaType: .video).first else { throw Failure("No video track") }
    let reader = try AVAssetReader(asset: asset)
    let video = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
    video.alwaysCopiesSampleData = false
    reader.add(video)
    guard reader.startReading() else { throw reader.error ?? Failure("Cannot read input") }
    let request = VNGeneratePersonSegmentationRequest()
    request.qualityLevel = .accurate
    request.outputPixelFormat = kCVPixelFormatType_OneComponent8
    let handler = VNSequenceRequestHandler()
    var count = 0
    var frames: [[String: Any]] = []
    while let sample = video.copyNextSampleBuffer() {
      try autoreleasepool {
        guard let pixels = CMSampleBufferGetImageBuffer(sample) else { throw Failure("Missing decoded frame") }
        try handler.perform([request], on: pixels, orientation: .up)
        guard let mask = request.results?.first?.pixelBuffer else { throw Failure("No person mask") }
        CVPixelBufferLockBaseAddress(mask, .readOnly)
        defer { CVPixelBufferUnlockBaseAddress(mask, .readOnly) }
        let width = CVPixelBufferGetWidth(mask), height = CVPixelBufferGetHeight(mask)
        let stride = CVPixelBufferGetBytesPerRow(mask)
        guard let base = CVPixelBufferGetBaseAddress(mask) else { throw Failure("No mask pixels") }
        var data = Data("P5\n\(width) \(height)\n255\n".utf8)
        var sum: UInt64 = 0
        for row in 0..<height {
          let p = base.advanced(by: row * stride).assumingMemoryBound(to: UInt8.self)
          data.append(p, count: width)
          for column in 0..<width { sum += UInt64(p[column]) }
        }
        if pipeMode {
          try FileHandle.standardOutput.write(contentsOf: data)
        } else {
          try data.write(to: output.appendingPathComponent(String(format: "%06d.pgm", count)), options: .atomic)
        }
        frames.append(["frame": count, "at": CMTimeGetSeconds(CMSampleBufferGetPresentationTimeStamp(sample)), "width": width, "height": height, "coverage": Double(sum) / Double(width * height * 255)])
        count += 1
      }
      if count > 1800 { throw Failure("Mask request exceeds 60 seconds at 30fps") }
    }
    guard reader.status == .completed, count > 0 else { throw reader.error ?? Failure("Incomplete video") }
    try JSONSerialization.data(withJSONObject: ["engine": "apple-vision-person-accurate-v1", "frameCount": count, "frames": frames], options: [.prettyPrinted, .sortedKeys]).write(to: output.appendingPathComponent("frames.json"), options: .atomic)
    try FileHandle.standardError.write(contentsOf: Data("Completed \(count) person masks\n".utf8))
  }
  struct Failure: Error, CustomStringConvertible { let description: String; init(_ description: String) { self.description = description } }
}
