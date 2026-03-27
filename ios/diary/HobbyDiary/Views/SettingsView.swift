import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var diaryService: DiaryService
    @State private var showingSignOut = false

    private let accent = Color(hex: "#10b981")

    var body: some View {
        NavigationStack {
            ZStack {
                Color(hex: "#0a0a0a").ignoresSafeArea()

                List {
                    Section {
                        HStack(spacing: 16) {
                            ZStack {
                                Circle()
                                    .fill(accent.opacity(0.2))
                                    .frame(width: 50, height: 50)
                                Text("📔")
                                    .font(.title2)
                            }
                            VStack(alignment: .leading, spacing: 4) {
                                Text(authService.user?.email ?? "")
                                    .font(.subheadline)
                                    .foregroundColor(.white)
                                Text("일기 \(diaryService.entries.count)개")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                        }
                        .listRowBackground(Color(hex: "#111111"))
                    }

                    Section("앱 정보") {
                        HStack {
                            Text("버전")
                            Spacer()
                            Text("1.0.0")
                                .foregroundColor(.gray)
                        }
                        .listRowBackground(Color(hex: "#111111"))

                        HStack {
                            Text("개발")
                            Spacer()
                            Text("HOBBYTAN AI")
                                .foregroundColor(accent)
                        }
                        .listRowBackground(Color(hex: "#111111"))
                    }

                    Section {
                        Button(role: .destructive) {
                            showingSignOut = true
                        } label: {
                            HStack {
                                Spacer()
                                Text("로그아웃")
                                Spacer()
                            }
                        }
                        .listRowBackground(Color(hex: "#111111"))
                    }
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("설정")
            .alert("로그아웃하시겠습니까?", isPresented: $showingSignOut) {
                Button("취소", role: .cancel) {}
                Button("로그아웃", role: .destructive) {
                    diaryService.stopListening()
                    authService.signOut()
                }
            }
        }
    }
}
