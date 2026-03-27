import SwiftUI

struct DiaryDetailView: View {
    @EnvironmentObject var diaryService: DiaryService
    @Environment(\.dismiss) var dismiss

    let entry: DiaryEntry
    @State private var showingEdit = false
    @State private var showingDelete = false

    private let accent = Color(hex: "#10b981")

    var body: some View {
        ZStack {
            Color(hex: "#0a0a0a").ignoresSafeArea()

            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Header
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text(entry.mood.emoji)
                                .font(.system(size: 40))
                            VStack(alignment: .leading, spacing: 4) {
                                Text(entry.mood.label)
                                    .font(.caption)
                                    .fontWeight(.semibold)
                                    .foregroundColor(Color(hex: entry.mood.color))
                                Text(entry.date, format: .dateTime.year().month().day().weekday(.wide))
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                            }
                        }

                        Text(entry.title)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                    }

                    Divider()
                        .background(Color(hex: "#222222"))

                    // Content
                    Text(entry.content)
                        .font(.body)
                        .foregroundColor(Color(hex: "#cccccc"))
                        .lineSpacing(8)

                    Spacer(minLength: 40)

                    // Metadata
                    VStack(alignment: .leading, spacing: 4) {
                        Text("작성: \(entry.createdAt, format: .dateTime)")
                            .font(.caption2)
                            .foregroundColor(Color(hex: "#666666"))
                        if entry.updatedAt != entry.createdAt {
                            Text("수정: \(entry.updatedAt, format: .dateTime)")
                                .font(.caption2)
                                .foregroundColor(Color(hex: "#666666"))
                        }
                    }
                }
                .padding(20)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    Button {
                        showingEdit = true
                    } label: {
                        Label("수정", systemImage: "pencil")
                    }

                    Button(role: .destructive) {
                        showingDelete = true
                    } label: {
                        Label("삭제", systemImage: "trash")
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .foregroundColor(accent)
                }
            }
        }
        .sheet(isPresented: $showingEdit) {
            ComposeView(editEntry: entry)
        }
        .alert("일기를 삭제하시겠습니까?", isPresented: $showingDelete) {
            Button("취소", role: .cancel) {}
            Button("삭제", role: .destructive) {
                Task {
                    try? await diaryService.deleteEntry(entry)
                    dismiss()
                }
            }
        } message: {
            Text("삭제된 일기는 복구할 수 없습니다.")
        }
    }
}
