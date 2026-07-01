# SmartCoaching API Dokümantasyonu

Bu belge, şu an kodda gerçekten var olan endpoint'leri temel alır.  
Eski sürümlerde geçen ama artık kullanılmayan `weekly check-in`, ayrı `check-ins` uçları veya farklı route isimleri bu dokümana özellikle alınmadı.

## Genel Kurallar

- Base route yapısı çoğu controller için `api/[controller]`
- JSON body bekleyen uçlarda `Content-Type: application/json`
- Kimlik doğrulama gereken uçlarda:
  `Authorization: Bearer <token>`
- Başarılı cevaplar çoğunlukla `200 OK`
- Hata cevapları `ApiControllerBase` içindeki `HandleResult` akışına göre döner:
  - `400 Bad Request`
  - `401 Unauthorized`
  - `404 Not Found`
  - `409 Conflict`

## Roller

- `Coach`
- `Athlete`

## Kimlik Doğrulama

### 1. Koç girişi

- Method: `POST`
- Route: `/api/Auth/login`
- Yetki: açık
- Amaç: Koç hesabı için JWT token üretir

Örnek body:

```json
{
  "email": "coach@example.com",
  "password": "Password123!"
}
```

Başarılı cevap:

```json
"jwt-token-string"
```

### 2. Sporcu girişi

- Method: `POST`
- Route: `/api/Auth/athlete-login`
- Yetki: açık
- Amaç: Sporcu hesabı için JWT token üretir

Örnek body:

```json
{
  "email": "athlete@example.com",
  "password": "Password123!"
}
```

Başarılı cevap:

```json
"jwt-token-string"
```

### 3. İlk şifre değiştirme / normal şifre değiştirme

- Method: `PUT`
- Route: `/api/Auth/change-password`
- Yetki: `Athlete`
- Amaç: Sporcunun mevcut şifresini yeni şifreyle değiştirir

Örnek body:

```json
{
  "oldPassword": "Temp123!",
  "newPassword": "NewStrongPassword123!"
}
```

Başarılı cevap:

```json
"jwt-token-string"
```

Not:
- Handler yeni token döndürüyor
- Frontend bu token’ı eski token yerine kaydetmeli

---

## Koç Endpoint'leri

### 4. Koç oluşturma

- Method: `POST`
- Route: `/api/Coaches`
- Yetki: açık
- Amaç: Sisteme yeni koç hesabı ekler

Body doğrudan `CreateCoachCommand` modeline bağlanır.  
Bu yüzden frontend’in gönderdiği alanlar backend command ile birebir uyumlu olmalıdır.

Not:
- Bu uç genelde bootstrap / kayıt senaryosunda kullanılır

### 5. Koç dashboard özeti

- Method: `GET`
- Route: `/api/Coaches/dashboard`
- Yetki: `Coach`
- Amaç: Koç panelindeki özet kartları ve takım görünümünü besler

Tipik içerik:
- toplam sporcu sayısı
- aktif sporcu sayısı
- uyum / adherence özeti
- son progress log kayıtları

---

## Sporcu Yönetimi Endpoint'leri

### 6. Sporcu oluşturma

- Method: `POST`
- Route: `/api/Athletes`
- Yetki: `Coach`
- Amaç: Koçun yeni sporcu eklemesini sağlar

Body doğrudan `CreateAthleteCommand` modeline bağlanır.

Sistem davranışı:
- sporcu entity oluşturulur
- geçici şifre üretilir
- kayıt veritabanına yazılır
- event publish edilir
- arka planda mail akışı tetiklenebilir

### 7. Koçun kendi sporcularını listeleme

- Method: `GET`
- Route: `/api/Athletes`
- Yetki: `Coach`
- Amaç: Sadece giriş yapan koçun sporcularını döner

### 8. Tek sporcu detayı

- Method: `GET`
- Route: `/api/Athletes/{id}`
- Yetki: `Coach` veya `Athlete`
- Amaç: Sporcu kartı, onboarding özeti ve detay görünümünü besler

Path parametresi:

- `id`: `Guid`

### 9. Hedef güncelleme

- Method: `PUT`
- Route: `/api/Athletes/{id}/targets`
- Yetki: `Coach`
- Amaç: Hedef kalori ve hedef adımı günceller

Örnek body:

```json
{
  "targetCalories": 2400,
  "targetSteps": 12000
}
```

---

## Progress / Günlük Takip Endpoint'leri

### 10. Günlük progress log ekleme

- Method: `POST`
- Route: `/api/Athletes/{id}/progress`
- Yetki: `Athlete`
- Amaç: Sporcunun günlük kalori, adım, kilo ve not kaydını oluşturur

Örnek body:

```json
{
  "date": "2026-07-02T00:00:00Z",
  "consumedCalories": 2150,
  "takenSteps": 9850,
  "isWorkoutCompleted": true,
  "weightKg": 78.4,
  "notes": "Bugün enerji iyiydi.",
  "frontPhotoUrl": null,
  "backPhotoUrl": null,
  "sidePhotoUrl": null
}
```

Not:
- Progress log ekranındaki günlük özet ve gelişim akışı bu veriyle beslenir

### 11. Progress log listeleme

- Method: `GET`
- Route: `/api/Athletes/{id}/progress`
- Yetki: `Coach` veya `Athlete`
- Amaç: Tarih aralığında progress log döner

Query parametreleri:

- `startDate`: `DateTime`
- `endDate`: `DateTime`

Örnek:

```text
/api/Athletes/{id}/progress?startDate=2026-07-01&endDate=2026-07-07
```

### 12. Koç geri bildirimi ekleme

- Method: `PUT`
- Route: `/api/Athletes/{id}/progress/{progressLogId}/feedback`
- Yetki: `Coach`
- Amaç: Seçilen günlük log’a koç notu ekler

Örnek body:

```json
{
  "feedback": "Enerjin iyi görünüyor, yarın adımı biraz daha artır."
}
```

---

## Onboarding Endpoint'i

### 13. Onboarding form gönderme

- Method: `POST`
- Route: `/api/Athletes/{id}/onboarding`
- Yetki: `Athlete`
- Amaç: İlk kurulum formunu kaydeder

Örnek body:

```json
{
  "dateOfBirth": "2000-01-01T00:00:00Z",
  "phoneNumber": "+90 555 000 00 00",
  "occupation": "Öğrenci",
  "mainReason": 1,
  "shortTermGoal": "3 ay içinde yağ oranını düşürmek",
  "longTermGoal": "Kas kütlesi artırmak",
  "expectations": "Disiplinli takip ve düzenli geri bildirim",
  "heightCm": 180,
  "startingWeightKg": 82.5,
  "trainingHistory": "2 yıldır fitness yapıyorum",
  "currentTrainingRoutine": "Haftada 4 gün ağırlık",
  "outsidePhysicalActivity": "Günlük yürüyüş",
  "hasTrackedMacros": "Evet",
  "hasWorkedWithCoach": "Hayır",
  "hearAboutUs": "Instagram",
  "additionalNotes": "Diz sakatlığı geçmişim var"
}
```

Not:
- `mainReason` enum karşılığıdır
- başarılı olduğunda sporcu onboarding akışı tamamlanır

---

## Antrenman Programı Endpoint'leri

### 14. Antrenman programı kaydetme / güncelleme

- Method: `POST`
- Route: `/api/Athletes/{id}/workout-programs`
- Yetki: `Coach`
- Amaç: Sporcunun antrenman planını kaydeder

Örnek body:

```json
{
  "exercises": [
    {
      "dayName": "Pazartesi",
      "exerciseName": "Bench Press",
      "sets": 4,
      "reps": "8-10",
      "restTimeInSeconds": 90,
      "notes": "İlk sette kontrollü başla",
      "exerciseLibraryId": "bench-press"
    },
    {
      "dayName": "Pazartesi",
      "exerciseName": "Incline Dumbbell Press",
      "sets": 3,
      "reps": "10-12",
      "restTimeInSeconds": 75,
      "notes": null,
      "exerciseLibraryId": "incline-dumbbell-press"
    }
  ]
}
```

Not:
- Aynı gün için birden fazla hareket gönderilebilir
- Frontend bunları gün bazlı gruplayarak gösterir

### 15. Antrenman programı okuma

- Method: `GET`
- Route: `/api/Athletes/{id}/workout-programs`
- Yetki: `Coach` veya `Athlete`
- Amaç: Sporcunun mevcut antrenman planını döner

Kullanım alanı:
- koç athlete detail ekranı
- sporcu portalı program ekranı

---

## Beslenme Programı Endpoint'leri

### 16. Diyet programı kaydetme / güncelleme

- Method: `POST`
- Route: `/api/Athletes/{id}/diet-programs`
- Yetki: `Coach`
- Amaç: Öğün bazlı beslenme planını kaydeder

Örnek body:

```json
{
  "generalDietNotes": "Su tüketimini yüksek tut.",
  "meals": [
    {
      "order": 1,
      "mealName": "Breakfast",
      "foods": "100 gram yulaf, 2 yumurta",
      "notes": "Antrenman sabahsa muz eklenebilir"
    },
    {
      "order": 2,
      "mealName": "Lunch",
      "foods": "150 gram tavuk, 120 gram pirinç",
      "notes": ""
    }
  ]
}
```

Not:
- Arka planda bu öğünler üzerinden AI destekli makro hesap akışı tetiklenebilir
- Frontend tarafında aynı öğün başlığı altındaki kalemler birlikte gösterilebilir

### 17. Diyet programı okuma

- Method: `GET`
- Route: `/api/Athletes/{id}/diet-programs`
- Yetki: `Coach` veya `Athlete`
- Amaç: Sporcunun aktif diyet planını döner

Kullanım alanı:
- koç diet program ekranı
- sporcu beslenme ekranı

---

## Egzersiz Kütüphanesi Endpoint'i

### 18. Egzersiz arama

- Method: `GET`
- Route: `/api/Exercises/search`
- Yetki: giriş yapmış kullanıcı
- Amaç: Egzersiz kütüphanesinde isim bazlı arama yapar

Query parametresi:

- `query`: `string`

Örnek:

```text
/api/Exercises/search?query=squat
```

Kullanım alanı:
- koç antrenman planı oluştururken hareket seçimi

---

## Beslenme Log Endpoint'leri

Bu uçlar sporcu tarafında günlük yenilen yiyecekleri ayrı takip etmek için kullanılır.  
Koçun yazdığı diyet planı ile aynı şey değildir.

### 19. Yenen öğün / gıda loglama

- Method: `POST`
- Route: `/api/nutrition/log`
- Yetki: `Athlete`
- Amaç: Sporcunun gerçekten tükettiği gıdayı kaydeder

Body doğrudan `LogConsumedFoodCommand` modeline bağlanır.

Not:
- başarılı cevapta yeni kayıt id’si döner

Örnek cevap:

```json
{
  "id": "9d9df1f8-2e2e-4ed9-8bcb-6fe0d1d7a123"
}
```

### 20. Günlük beslenme özeti

- Method: `GET`
- Route: `/api/nutrition/daily/{date}`
- Yetki: `Athlete`
- Amaç: Belirli bir gün için tüketilen gıdaların toplam özetini döner

Path parametresi:

- `date`: `DateTime`

Örnek:

```text
/api/nutrition/daily/2026-07-02
```

### 21. FatSecret üzerinde gıda arama

- Method: `GET`
- Route: `/api/nutrition/fatsecret/search`
- Yetki: giriş yapmış kullanıcı
- Amaç: Harici gıda veritabanında arama yapar

Query parametresi:

- `query`: `string`

Örnek:

```text
/api/nutrition/fatsecret/search?query=banana
```

### 22. Yemek görseli analiz etme

- Method: `POST`
- Route: `/api/nutrition/analyze-image`
- Yetki: `Athlete`
- Amaç: Base64 görselden yiyecek analizi yapar

Örnek body:

```json
{
  "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}
```

Not:
- `base64Image` boşsa `400 Bad Request`
- analiz başarısız olursa yine `400 Bad Request`

---

## AI Asistan Endpoint'i

### 23. Koç asistanıyla sohbet

- Method: `POST`
- Route: `/api/agent/chat`
- Yetki: `Coach`
- Amaç: Koç mesajını AI katmanına iletir

Örnek body:

```json
{
  "message": "Seçili sporcunun hedef kalorisini 2600 yap.",
  "contextAthleteId": "11111111-1111-1111-1111-111111111111",
  "contextAthleteName": "Aleyna Metin"
}
```

Başarılı cevap yapısı:

```json
{
  "textReply": "Aleyna Metin için hedef kaloriyi 2600 olarak güncelledim.",
  "uiAction": "refreshTargets",
  "actionData": {
    "athleteId": "11111111-1111-1111-1111-111111111111"
  }
}
```

Alanlar:

- `textReply`: modele gösterilecek metin cevap
- `uiAction`: frontend tarafında isteğe bağlı aksiyon anahtarı
- `actionData`: ilgili UI aksiyonu için payload

Not:
- Bu endpoint doğrudan LLM’e değil, önce command handler’a gider
- arka tarafta `SendAgentMessageCommandHandler` ve `IAiAgentService` çalışır
- Semantic Kernel + plugin/tool yapısı bu katmanda devreye girer

---

## Hızlı Route Özeti

### Auth

- `POST /api/Auth/login`
- `POST /api/Auth/athlete-login`
- `PUT /api/Auth/change-password`

### Coaches

- `POST /api/Coaches`
- `GET /api/Coaches/dashboard`

### Athletes

- `POST /api/Athletes`
- `GET /api/Athletes`
- `GET /api/Athletes/{id}`
- `PUT /api/Athletes/{id}/targets`
- `POST /api/Athletes/{id}/progress`
- `GET /api/Athletes/{id}/progress`
- `PUT /api/Athletes/{id}/progress/{progressLogId}/feedback`
- `POST /api/Athletes/{id}/onboarding`
- `POST /api/Athletes/{id}/workout-programs`
- `GET /api/Athletes/{id}/workout-programs`
- `POST /api/Athletes/{id}/diet-programs`
- `GET /api/Athletes/{id}/diet-programs`

### Exercises

- `GET /api/Exercises/search`

### Nutrition

- `POST /api/nutrition/log`
- `GET /api/nutrition/daily/{date}`
- `GET /api/nutrition/fatsecret/search`
- `POST /api/nutrition/analyze-image`

### Agent

- `POST /api/agent/chat`

---

## Notlar

- Bu belge route seviyesinde doğrudur; kaynak alınan yer doğrudan controller dosyalarıdır
- Eğer yeni endpoint eklenirse bu dosya controller ile birlikte güncellenmelidir
- Mimari akış ve Semantic Kernel detayları için ayrıca:
  [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
