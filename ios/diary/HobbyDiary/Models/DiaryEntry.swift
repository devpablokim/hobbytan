import Foundation
import FirebaseFirestore

struct DiaryEntry: Identifiable, Codable {
    @DocumentID var id: String?
    var title: String
    var content: String
    var mood: Mood
    var date: Date
    var createdAt: Date
    var updatedAt: Date
    var userId: String

    enum Mood: String, Codable, CaseIterable {
        case great = "great"
        case good = "good"
        case okay = "okay"
        case bad = "bad"
        case terrible = "terrible"

        var emoji: String {
            switch self {
            case .great: return "😄"
            case .good: return "🙂"
            case .okay: return "😐"
            case .bad: return "😢"
            case .terrible: return "😭"
            }
        }

        var label: String {
            switch self {
            case .great: return "최고"
            case .good: return "좋음"
            case .okay: return "보통"
            case .bad: return "나쁨"
            case .terrible: return "최악"
            }
        }

        var color: String {
            switch self {
            case .great: return "#10b981"
            case .good: return "#3b82f6"
            case .okay: return "#f59e0b"
            case .bad: return "#f97316"
            case .terrible: return "#ef4444"
            }
        }
    }
}
