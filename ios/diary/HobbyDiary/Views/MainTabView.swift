import SwiftUI

struct MainTabView: View {
    @StateObject private var diaryService = DiaryService()
    private let accent = Color(hex: "#10b981")

    var body: some View {
        TabView {
            DiaryListView()
                .tabItem {
                    Image(systemName: "book.fill")
                    Text("일기")
                }

            CalendarView()
                .tabItem {
                    Image(systemName: "calendar")
                    Text("캘린더")
                }

            SettingsView()
                .tabItem {
                    Image(systemName: "gearshape.fill")
                    Text("설정")
                }
        }
        .tint(accent)
        .environmentObject(diaryService)
        .onAppear { diaryService.startListening() }
        .onDisappear { diaryService.stopListening() }
    }
}
