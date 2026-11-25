import Foundation
import FirebaseFirestore
import FirebaseAuth

@MainActor
class DiaryService: ObservableObject {
    @Published var entries: [DiaryEntry] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let db = Firestore.firestore()
    private let collection = "diary_entries"
    private var listener: ListenerRegistration?

    var userId: String? {
        Auth.auth().currentUser?.uid
    }

    func startListening() {
        guard let userId else { return }
        listener?.remove()

        isLoading = true
        listener = db.collection(collection)
            .whereField("userId", isEqualTo: userId)
            .order(by: "date", descending: true)
            .addSnapshotListener { [weak self] snapshot, error in
                Task { @MainActor in
                    self?.isLoading = false
                    if let error {
                        self?.errorMessage = error.localizedDescription
                        return
                    }
                    self?.entries = snapshot?.documents.compactMap { doc in
                        try? doc.data(as: DiaryEntry.self)
                    } ?? []
                }
            }
    }

    func stopListening() {
        listener?.remove()
        listener = nil
    }

    func addEntry(title: String, content: String, mood: DiaryEntry.Mood, date: Date) async throws {
        guard let userId else { throw DiaryError.notAuthenticated }

        let entry = DiaryEntry(
            title: title,
            content: content,
            mood: mood,
            date: date,
            createdAt: Date(),
            updatedAt: Date(),
            userId: userId
        )

        try db.collection(collection).addDocument(from: entry)
    }

    func updateEntry(_ entry: DiaryEntry, title: String, content: String, mood: DiaryEntry.Mood, date: Date) async throws {
        guard let id = entry.id else { throw DiaryError.missingId }

        try await db.collection(collection).document(id).updateData([
            "title": title,
            "content": content,
            "mood": mood.rawValue,
            "date": Timestamp(date: date),
            "updatedAt": Timestamp(date: Date())
        ])
    }

    func deleteEntry(_ entry: DiaryEntry) async throws {
        guard let id = entry.id else { throw DiaryError.missingId }
        try await db.collection(collection).document(id).delete()
    }

    func entriesForDate(_ date: Date) -> [DiaryEntry] {
        let calendar = Calendar.current
        return entries.filter { calendar.isDate($0.date, inSameDayAs: date) }
    }

    func entriesForMonth(_ date: Date) -> [Date: [DiaryEntry]] {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month], from: date)
        guard let startOfMonth = calendar.date(from: components),
              let endOfMonth = calendar.date(byAdding: DateComponents(month: 1, day: -1), to: startOfMonth) else {
            return [:]
        }

        var grouped: [Date: [DiaryEntry]] = [:]
        for entry in entries {
            if entry.date >= startOfMonth && entry.date <= endOfMonth {
                let dayStart = calendar.startOfDay(for: entry.date)
                grouped[dayStart, default: []].append(entry)
            }
        }
        return grouped
    }
}

enum DiaryError: LocalizedError {
    case notAuthenticated
    case missingId

    var errorDescription: String? {
        switch self {
        case .notAuthenticated: return "로그인이 필요합니다."
        case .missingId: return "일기 ID를 찾을 수 없습니다."
        }
    }
}
