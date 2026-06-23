using System;
using Npgsql;

class Program
{
    static void Main()
    {
        var connString = "Host=localhost;Port=5434;Database=smartcoachingdb;Username=postgres;Password=Password123!";
        using var conn = new NpgsqlConnection(connString);
        conn.Open();
        
        using var cmd = new NpgsqlCommand("SELECT \"Id\", \"Date\", \"AthleteId\" FROM \"DailyProgresses\"", conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            Console.WriteLine($"Id: {reader.GetGuid(0)}, Date: {reader.GetDateTime(1)}, AthleteId: {reader.GetGuid(2)}");
        }
        Console.WriteLine("Done.");
    }
}
