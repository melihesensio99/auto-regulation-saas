# Smart Coaching SaaS - API & Mimari Dokümantasyonu

Bu belge, sisteme yeni katılacak geliştiriciler ve QA (Test) süreçleri için uygulamanın genel yapısını, tüm API uç noktalarını (Endpoint'leri) ve Postman test talimatlarını detaylandırmaktadır.

## 🏗️ Genel Mimari (Clean Architecture & CQRS)
Proje, **Clean Architecture** kurallarına uygun olarak 4 katmandan oluşmaktadır:
1. **Domain:** Çekirdek iş kuralları ve Entities (Athlete, Coach, WeeklyCheckIn vb.)
2. **Application:** CQRS pattern kullanılarak yazılmış MediatR Command/Query sınıfları ve iş mantığı. (Feature tabanlı klasörleme kullanılmıştır).
3. **Infrastructure:** EF Core, RabbitMQ (MassTransit), Mistral AI ve SMTP entegrasyonları.
4. **API:** İstekleri karşılayıp Application katmanına (Sender.Send) ileten Presentation katmanı.

---

## 🚀 Postman Test Talimatları & API Uç Noktaları

Tüm isteklerde `Authorization: Bearer <Token>` Header'ı bulunmalıdır. Token almak için AuthController'a giriş (Login) isteği atılmalıdır.

### 👥 Sporcu Yönetimi (Athletes)

#### 1. Yeni Sporcu Oluşturma
- **Endpoint:** `POST /api/Athletes`
- **Yetki:** `Coach`
- **Ne Yapar:** Koçun sisteme yeni bir sporcu eklemesini sağlar. Şifreyi hasler, RabbitMQ'ya "Sporcu Oluşturuldu" (AthleteCreatedEvent) mesajı atar ve arka planda sporcuya hoş geldin maili gönderir.
- **Handler:** `CreateAthleteCommandHandler`
- **Örnek Body:**
```json
{
  "firstName": "Ali",
  "lastName": "Yılmaz",
  "email": "ali@mail.com",
  "password": "Password123!",
  "dateOfBirth": "1995-01-01",
  "heightCm": 180,
  "startingWeightKg": 85.5,
  "subscriptionMonths": 3
}
```

#### 2. Sporcuları Listeleme
- **Endpoint:** `GET /api/Athletes`
- **Yetki:** `Coach`
- **Ne Yapar:** Sadece giriş yapmış olan koçun **kendi sporcularını** (Global Query Filter) listeler. Başka koçların sporcuları asla listelenmez.
- **Handler:** `GetAthletesQueryHandler`

#### 3. Sporcu Hedeflerini Güncelleme
- **Endpoint:** `PUT /api/Athletes/{id}/targets`
- **Yetki:** `Coach`
- **Ne Yapar:** Koçun, sporcuya ait günlük hedef kalori ve hedef adım sayısını değiştirmesini sağlar.
- **Handler:** `UpdateAthleteTargetsCommandHandler`

---

### 💪 Antrenman ve Beslenme (Workout & Diet)

#### 4. Antrenman Programı Atama (Flatter Design)
- **Endpoint:** `POST /api/Athletes/{id}/workout-programs`
- **Yetki:** `Coach`
- **Ne Yapar:** Karmaşık tablolar yerine tek tablo mantığıyla (Flatter Design) sporcunun günlere göre yapacağı tüm egzersizleri veritabanına basar. Eski programı otomatik ezer.
- **Handler:** `AssignWorkoutProgramCommandHandler`
- **Örnek Body:**
```json
{
  "exercises": [
    { "dayName": "Pazartesi", "exerciseName": "Bench Press", "sets": 3, "reps": 10, "restTimeInSeconds": 60 }
  ]
}
```

#### 5. Beslenme Programı Atama (Flatter Design)
- **Endpoint:** `POST /api/Athletes/{id}/diet-programs`
- **Yetki:** `Coach`
- **Ne Yapar:** Sporcunun öğün bazlı diyetini kaydeder.
- **Handler:** `AssignDietProgramCommandHandler`

#### 6. Antrenman ve Diyet Programını Okuma
- **Endpoints:** `GET /api/Athletes/{id}/workout-programs` ve `GET /api/Athletes/{id}/diet-programs`
- **Yetki:** `Coach` veya `Athlete`
- **Ne Yapar:** Veritabanındaki düz listeyi (Flatter veriyi) okur ve API yanıtında gün gün gruplayarak (Pazartesi, Salı vb.) şık bir JSON formatında döner.
- **Handlers:** `GetAthleteWorkoutProgramQueryHandler`, `GetAthleteDietProgramQueryHandler`

---

### 📊 Günlük İlerleme & Yapay Zeka Check-In

#### 7. Günlük Veri Girme (Daily Progress)
- **Endpoint:** `POST /api/Athletes/{id}/progress`
- **Yetki:** `Athlete`
- **Ne Yapar:** Sporcu her gün kalori, adım, kilo ve o gün antrenman yapıp yapmadığını girer (Aynı güne atılan istekler UPDATE edilir, Upsert mantığı vardır).
- **Handler:** `LogDailyProgressCommandHandler`
- **Örnek Body:**
```json
{
  "date": "2026-06-21",
  "consumedCalories": 2400,
  "takenSteps": 8000,
  "weightKg": 82.5,
  "isWorkoutCompleted": true,
  "notes": "Bugün biraz yorgundum."
}
```

#### 8. Haftalık Kapanış (Weekly Check-In & AI Trigger)
- **Endpoint:** `POST /api/Athletes/{id}/check-in`
- **Yetki:** `Athlete`
- **Ne Yapar:** Sporcu pazar günü tartısını ve fotoğraflarını gönderir. **Burası sistemin kalbidir.** API anında 200 OK döner, arka planda MassTransit üzerinden `WeeklyCheckInSubmittedEvent` fırlatır.
- **Handler:** `SubmitWeeklyCheckInCommandHandler`
- **RabbitMQ Arka Planı (AI Analizi):** `WeeklyCheckInSubmittedEventConsumer` devreye girer. Sporcunun son 7 günlük kalori, adım ve antrenman verisini toplayıp hedefleriyle kıyaslayarak Mistral AI'a muazzam bir Prompt atar. Gelen zeki koçluk tavsiyesini (AiAnalysis) veritabanına kaydeder.

#### 9. Check-In'leri Listeleme (Rol Bazlı Veri Kalkanı)
- **Endpoint:** `GET /api/Athletes/{id}/check-ins`
- **Yetki:** `Coach` veya `Athlete`
- **Ne Yapar:** Eğer Koç istek atarsa, AI'ın yaptığı analizi (`AiAnalysis`) dolu olarak görür. **Eğer Sporcu istek atarsa sistem `AiAnalysis` sütununu null döner**, sporcu asla AI ile muhatap olmaz.
- **Handler:** `GetAthleteCheckInsQueryHandler`

#### 10. Koç Yorumu Ekleme (Feedback)
- **Endpoint:** `PUT /api/Athletes/{id}/check-ins/{checkInId}/feedback`
- **Yetki:** `Coach`
- **Ne Yapar:** Koç, yapay zekanın asistanlık analizini okur ve sonrasında sporcuya ileteceği kendi resmi kararını/yönlendirmesini (`CoachFeedback`) sisteme kaydeder. Sporcu sadece bu yorumu okur.
- **Handler:** `AddCoachFeedbackCommandHandler`
