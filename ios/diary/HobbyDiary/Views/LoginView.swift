import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authService: AuthService
    @State private var email = ""
    @State private var password = ""
    @State private var isSignUp = false

    private let accent = Color(hex: "#10b981")

    var body: some View {
        ZStack {
            Color(hex: "#0a0a0a").ignoresSafeArea()

            VStack(spacing: 32) {
                Spacer()

                // Logo
                VStack(spacing: 12) {
                    Text("📔")
                        .font(.system(size: 64))
                    Text("HOBBY DIARY")
                        .font(.system(size: 28, weight: .heavy))
                        .foregroundColor(.white)
                    Text("나만의 일기장")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }

                // Form
                VStack(spacing: 16) {
                    TextField("이메일", text: $email)
                        .textFieldStyle(DiaryTextFieldStyle())
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)

                    SecureField("비밀번호", text: $password)
                        .textFieldStyle(DiaryTextFieldStyle())
                        .textContentType(isSignUp ? .newPassword : .password)
                }
                .padding(.horizontal, 32)

                // Error
                if let error = authService.errorMessage {
                    Text(error)
                        .font(.caption)
                        .foregroundColor(.red)
                        .padding(.horizontal, 32)
                }

                // Button
                Button {
                    Task {
                        if isSignUp {
                            await authService.signUpWithEmail(email, password: password)
                        } else {
                            await authService.signInWithEmail(email, password: password)
                        }
                    }
                } label: {
                    Group {
                        if authService.isLoading {
                            ProgressView()
                                .tint(Color(hex: "#0a0a0a"))
                        } else {
                            Text(isSignUp ? "회원가입" : "로그인")
                                .font(.headline)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(accent)
                    .foregroundColor(Color(hex: "#0a0a0a"))
                }
                .disabled(email.isEmpty || password.isEmpty || authService.isLoading)
                .padding(.horizontal, 32)

                // Toggle
                Button {
                    isSignUp.toggle()
                    authService.errorMessage = nil
                } label: {
                    Text(isSignUp ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 회원가입")
                        .font(.subheadline)
                        .foregroundColor(accent)
                }

                Spacer()
            }
        }
    }
}

struct DiaryTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(14)
            .background(Color(hex: "#111111"))
            .foregroundColor(.white)
            .overlay(
                RoundedRectangle(cornerRadius: 0)
                    .stroke(Color(hex: "#333333"), lineWidth: 1)
            )
    }
}
