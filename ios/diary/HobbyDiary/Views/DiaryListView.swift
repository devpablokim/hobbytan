import SwiftUI

struct DiaryListView: View {
    @EnvironmentObject var diaryService: DiaryService
    @State private var showingCompose = false
    private let accent = Color(hex: "#10b981")

    var body: some View {
        NavigationStack {
            ZStack {
                Color(hex: "#0a0a0a").ignoresSafeArea()

                if diaryService.entries.isEmpty && !diaryService.isLoading {
                    VStack(spacing: 16) {
                        Text("📔")
                            .font(.system(size: 48))
                        Text("아직 일기가 없습니다")
                            .font(.headline)
                            .foregroundColor(.gray)
                        Text("오늘의 이야기를 기록해보세요")
                            .font(.subheadline)
                            .foregroundColor(Color(hex: "#666666"))
                    }
                } else {
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(diaryService.entries) { entry in
                                NavigationLink(destination: DiaryDetailView(entry: entry)) {
                                    DiaryCardView(entry: entry)
                                }
                            }
                        }
                        .padding()
                    }
                }

                if diaryService.isLoading {
                    ProgressView()
                        .tint(accent)
                }
            }
            .navigationTitle("내 일기")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showingCompose = true
                    } label: {
                        Image(systemName: "plus")
                            .foregroundColor(accent)
                    }
                }
            }
            .sheet(isPresented: $showingCompose) {
                ComposeView()
            }
        }
    }
}

struct DiaryCardView: View {
    let entry: DiaryEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(entry.mood.emoji)
                    .font(.title2)
                Text(entry.title)
                    .font(.headline)
                    .foregroundColor(.white)
                    .lineLimit(1)
                Spacer()
                Text(entry.date, style: .date)
                    .font(.caption)
                    .foregroundColor(.gray)
            }

            Text(entry.content)
                .font(.subheadline)
                .foregroundColor(Color(hex: "#999999"))
                .lineLimit(2)
        }
        .padding(16)
        .background(Color(hex: "#111111"))
        .overlay(
            Rectangle()
                .stroke(Color(hex: "#222222"), lineWidth: 1)
        )
    }
}
