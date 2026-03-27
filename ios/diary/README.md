# Hobby Diary — iOS 일기 앱

HOBBYTAN AI 브랜드 일기 앱. SwiftUI + Firebase.

## 요구사항
- Xcode 15.0+
- iOS 17.0+
- Swift 5.9+

## 설정
1. Firebase Console에서 iOS 앱 등록 (Bundle ID: `com.hobbytan.diary`)
2. `GoogleService-Info.plist` 다운로드하여 `HobbyDiary/` 폴더에 교체
3. Xcode에서 `ios/diary` 폴더 열기
4. Firebase SDK는 SPM으로 자동 설치

## 기능
- 📝 일기 작성/조회/수정/삭제 (CRUD)
- 😄 기분 태그 (5단계: 최고/좋음/보통/나쁨/최악)
- 📅 캘린더 뷰 (월별, 기분 이모지 표시)
- 🔐 Firebase Auth (이메일/비밀번호)
- ☁️ Firestore 실시간 동기화
- 🌙 다크 테마 (HOBBYTAN 브랜드)

## 아키텍처
```
HobbyDiary/
├── HobbyDiaryApp.swift      # 앱 진입점
├── ContentView.swift         # 인증 분기
├── Models/
│   └── DiaryEntry.swift      # 일기 모델 (Codable)
├── Services/
│   ├── AuthService.swift     # Firebase Auth
│   └── DiaryService.swift    # Firestore CRUD + 리스너
├── Views/
│   ├── LoginView.swift       # 로그인/회원가입
│   ├── MainTabView.swift     # 탭 (일기/캘린더/설정)
│   ├── DiaryListView.swift   # 일기 목록
│   ├── DiaryDetailView.swift # 일기 상세
│   ├── ComposeView.swift     # 작성/수정
│   ├── CalendarView.swift    # 캘린더
│   └── SettingsView.swift    # 설정
├── Extensions/
│   └── Color+Hex.swift       # 헥스 컬러
└── GoogleService-Info.plist  # Firebase 설정
```
