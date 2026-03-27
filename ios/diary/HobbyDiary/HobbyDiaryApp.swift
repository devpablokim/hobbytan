import SwiftUI
import FirebaseCore

@main
struct HobbyDiaryApp: App {
    init() {
        FirebaseApp.configure()
    }

    @StateObject private var authService = AuthService()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authService)
                .preferredColorScheme(.dark)
        }
    }
}
