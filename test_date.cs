using System;

class Program {
    static void Main() {
        DateTime dbDate = new DateTime(2026, 6, 24, 0, 0, 0, DateTimeKind.Utc);
        DateTime reqDate = new DateTime(2026, 6, 24, 0, 0, 0, DateTimeKind.Unspecified);
        
        Console.WriteLine($"Equals: {dbDate == reqDate}");
        Console.WriteLine($"dbDate Ticks: {dbDate.Ticks}");
        Console.WriteLine($"reqDate Ticks: {reqDate.Ticks}");
    }
}
