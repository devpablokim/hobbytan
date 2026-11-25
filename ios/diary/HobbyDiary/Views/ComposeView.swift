import SwiftUI

struct ComposeView: View {
    @EnvironmentObject var diaryService: DiaryService
    @Environment(\.dismiss) var dismiss

    var editEntry: DiaryEntry?

    @State private var title = ""
    @State private var content = ""
    @State private var mood: DiaryEntry.Mood = .okay
    @State private var date = Date()
    @State private var isSaving = false

    private let accent = Color(hex: "#10b981")

    var isEditing: Bool { editEntry != nil }

    var body: some View {
        NavigationStack {
            ZStack {
                Color(hex: "#0a0a0a").ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {
                        // Date picker
                        DatePicker("날짜", selection: $date, displayedComponents: .date)
                            .datePickerStyle(.compact)
                            .tint(accent)
                            .padding(16)
                            .background(Color(hex: "#111111"))

                        // Mood selector
                        VStack(alignment: .leading, spacing: 12) {
                            Text("오늘의 기분")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.gray)

                            HStack(spacing: 0) {
                                ForEach(DiaryEntry.Mood.allCases, id: \.self) { m in
                                    Button {
                                        mood = m
                                    } label: {
                                        VStack(spacing: 4) {
                                            Text(m.emoji)
                                                .font(.title)
                                            Text(m.label)
                                                .font(.caption2)
                                                .foregroundColor(mood == m ? .white : .gray)
                                        }
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(mood == m ? Color(hex: m.color).opacity(0.2) : Color.clear)
                                        .overlay(
                                            Rectangle()
                                                .stroke(mood == m ? Color(hex: m.color) : Color.clear, lineWidth: 2)
                                        )
                                    }
                                }
                            }
                            .background(Color(hex: "#111111"))
                        }
                        .padding(.horizontal)

                        // Title
                        VStack(alignment: .leading, spacing: 8) {
                            Text("제목")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.gray)

                            TextField("오늘의 제목", text: $title)
                                .textFieldStyle(DiaryTextFieldStyle())
                        }
                        .padding(.horizontal)

                        // Content
                        VStack(alignment: .leading, spacing: 8) {
                            Text("내용")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.gray)

                            TextEditor(text: $content)
                                .frame(minHeight: 200)
                                .padding(12)
                                .scrollContentBackground(.hidden)
                                .background(Color(hex: "#111111"))
                                .foregroundColor(.white)
                                .overlay(
                                    Rectangle()
                                        .stroke(Color(hex: "#333333"), lineWidth: 1)
                                )
                                .overlay(alignment: .topLeading) {
                                    if content.isEmpty {
                                        Text("오늘 하루를 기록해보세요...")
                                            .foregroundColor(Color(hex: "#666666"))
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 20)
                                            .allowsHitTesting(false)
                                    }
                                }
                        }
                        .padding(.horizontal)
                    }
                    .padding(.vertical)
                }
            }
            .navigationTitle(isEditing ? "일기 수정" : "새 일기")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("취소") { dismiss() }
                        .foregroundColor(.gray)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        Task { await save() }
                    } label: {
                        if isSaving {
                            ProgressView().tint(accent)
                        } else {
                            Text("저장")
                                .fontWeight(.bold)
                                .foregroundColor(accent)
                        }
                    }
                    .disabled(title.isEmpty || content.isEmpty || isSaving)
                }
            }
            .onAppear {
                if let entry = editEntry {
                    title = entry.title
                    content = entry.content
                    mood = entry.mood
                    date = entry.date
                }
            }
        }
    }

    private func save() async {
        isSaving = true
        do {
            if let entry = editEntry {
                try await diaryService.updateEntry(entry, title: title, content: content, mood: mood, date: date)
            } else {
                try await diaryService.addEntry(title: title, content: content, mood: mood, date: date)
            }
            dismiss()
        } catch {
            diaryService.errorMessage = error.localizedDescription
        }
        isSaving = false
    }
}
