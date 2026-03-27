import SwiftUI

struct CalendarView: View {
    @EnvironmentObject var diaryService: DiaryService
    @State private var selectedDate = Date()
    @State private var currentMonth = Date()

    private let accent = Color(hex: "#10b981")
    private let calendar = Calendar.current
    private let weekdays = ["일", "월", "화", "수", "목", "금", "토"]

    var body: some View {
        NavigationStack {
            ZStack {
                Color(hex: "#0a0a0a").ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 20) {
                        // Month navigation
                        HStack {
                            Button {
                                withAnimation { changeMonth(-1) }
                            } label: {
                                Image(systemName: "chevron.left")
                                    .foregroundColor(accent)
                            }

                            Spacer()

                            Text(currentMonth, format: .dateTime.year().month())
                                .font(.title3)
                                .fontWeight(.bold)
                                .foregroundColor(.white)

                            Spacer()

                            Button {
                                withAnimation { changeMonth(1) }
                            } label: {
                                Image(systemName: "chevron.right")
                                    .foregroundColor(accent)
                            }
                        }
                        .padding(.horizontal)

                        // Weekday headers
                        HStack(spacing: 0) {
                            ForEach(weekdays, id: \.self) { day in
                                Text(day)
                                    .font(.caption)
                                    .fontWeight(.semibold)
                                    .foregroundColor(.gray)
                                    .frame(maxWidth: .infinity)
                            }
                        }
                        .padding(.horizontal, 8)

                        // Calendar grid
                        let days = daysInMonth()
                        let monthEntries = diaryService.entriesForMonth(currentMonth)

                        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 0), count: 7), spacing: 4) {
                            ForEach(days, id: \.self) { date in
                                if let date {
                                    let dayEntries = monthEntries[calendar.startOfDay(for: date)] ?? []
                                    let isSelected = calendar.isDate(date, inSameDayAs: selectedDate)
                                    let isToday = calendar.isDateInToday(date)

                                    Button {
                                        selectedDate = date
                                    } label: {
                                        VStack(spacing: 2) {
                                            Text("\(calendar.component(.day, from: date))")
                                                .font(.system(size: 14, weight: isToday ? .bold : .regular))
                                                .foregroundColor(isSelected ? Color(hex: "#0a0a0a") : isToday ? accent : .white)

                                            if !dayEntries.isEmpty {
                                                Text(dayEntries.first?.mood.emoji ?? "")
                                                    .font(.system(size: 10))
                                            } else {
                                                Text(" ")
                                                    .font(.system(size: 10))
                                            }
                                        }
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 6)
                                        .background(isSelected ? accent : Color.clear)
                                    }
                                } else {
                                    Color.clear
                                        .frame(height: 40)
                                }
                            }
                        }
                        .padding(.horizontal, 8)

                        // Selected date entries
                        let selected = diaryService.entriesForDate(selectedDate)
                        if !selected.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(selectedDate, format: .dateTime.month().day().weekday(.wide))
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .padding(.horizontal)

                                ForEach(selected) { entry in
                                    NavigationLink(destination: DiaryDetailView(entry: entry)) {
                                        DiaryCardView(entry: entry)
                                    }
                                }
                            }
                            .padding(.top, 8)
                        }
                    }
                    .padding(.vertical)
                }
            }
            .navigationTitle("캘린더")
        }
    }

    private func changeMonth(_ offset: Int) {
        if let newMonth = calendar.date(byAdding: .month, value: offset, to: currentMonth) {
            currentMonth = newMonth
        }
    }

    private func daysInMonth() -> [Date?] {
        let components = calendar.dateComponents([.year, .month], from: currentMonth)
        guard let firstDay = calendar.date(from: components),
              let range = calendar.range(of: .day, in: .month, for: firstDay) else { return [] }

        let weekday = calendar.component(.weekday, from: firstDay) - 1
        var days: [Date?] = Array(repeating: nil, count: weekday)

        for day in range {
            if let date = calendar.date(byAdding: .day, value: day - 1, to: firstDay) {
                days.append(date)
            }
        }

        return days
    }
}
