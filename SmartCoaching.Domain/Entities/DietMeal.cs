using SmartCoaching.Domain.Common;
using System;

namespace SmartCoaching.Domain.Entities;

public class DietMeal : BaseEntity
{
    public Guid AthleteId { get; set; }
    public Athlete Athlete { get; set; }

    public string MealName { get; set; }
    public string Foods { get; set; }
    public string Notes { get; set; }
}
