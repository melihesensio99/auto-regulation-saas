# SmartCoaching Projesi İçin Kurallar

- Git commit mesajlarında KESİNLİKLE "Feat:", "Refactor:", "Fix:", "Chore:" gibi (Conventional Commits) ön ekler kullanma. Sadece doğrudan yapılan işlemi anlatan düz Türkçe cümleler kullan.

# SmartCoaching Mimari Anayasasi

1. **Katmanli Mimari (Pragmatik CQRS):** Clean Architecture bagimlilik kuralina uyulacak. Ancak Repository kalabaligini onlemek amaciyla, Application katmanindaki CQRS Handler'larinin icinde EF Core (FirstOrDefaultAsync, Include vb.) kullanimina izin verilmistir.
2. **SOLID:** Her sinif ve metot yaziminda 'Single Responsibility' merkeze alinacak.
3. **CQRS ve Is Mantigi:** Is kurallari (Business Logic) Handler icinde degil, Domain Entity'lerine tasinacak.
4. **Interface Zorunlulugu:** Dis sistemlerle iletisim kuracak her yeni servis icin once bir Interface tanimlanacak.
5. **Vertical Slice:** DTO'lar merkezi bir klasorde degil, ait olduklari Command/Query'nin yaninda duracak. Update/Create islemlerinde Request DTO zorunludur.
