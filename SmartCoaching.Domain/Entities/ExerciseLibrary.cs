namespace SmartCoaching.Domain.Entities;

public class ExerciseLibrary
{
    public string Id { get; set; } = string.Empty; // Using the ID from JSON like "0001"
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string BodyPart { get; set; } = string.Empty;
    public string Equipment { get; set; } = string.Empty;
    public string TargetMuscle { get; set; } = string.Empty;
    public string InstructionsEn { get; set; } = string.Empty;
    public string InstructionsTr { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;
}
