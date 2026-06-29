using Microsoft.Data.Sqlite;
using System.Text.Json;
using System;

var dbPath = @"../SmartCoaching.Web/SmartCoaching.sqlite";
if (!System.IO.File.Exists(dbPath))
{
    dbPath = @"../SmartCoaching.sqlite";
}
Console.WriteLine($"DB Path: {dbPath}");

var json = System.IO.File.ReadAllText(@"../SmartCoaching.Infrastructure/Persistence/Seed/exercises.json");
var arr = JsonDocument.Parse(json).RootElement.EnumerateArray();

using var conn = new SqliteConnection($"Data Source={dbPath}");
conn.Open();
using var tx = conn.BeginTransaction();
using var cmd = conn.CreateCommand();
cmd.Transaction = tx;
cmd.CommandText = "UPDATE ExerciseLibraries SET VideoUrl = @video WHERE Id = @id";
var pVideo = cmd.Parameters.Add("@video", SqliteType.Text);
var pId = cmd.Parameters.Add("@id", SqliteType.Text);

foreach(var el in arr)
{
    pId.Value = el.GetProperty("id").GetString();
    var gifProp = el.TryGetProperty("gif_url", out var p) ? p.GetString() : "";
    pVideo.Value = gifProp ?? "";
    cmd.ExecuteNonQuery();
}
tx.Commit();
Console.WriteLine("Done!");
