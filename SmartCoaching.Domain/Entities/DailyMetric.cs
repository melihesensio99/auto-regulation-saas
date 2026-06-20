using SmartCoaching.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartCoaching.Domain.Entities
{
    public class DailyMetric : BaseEntity
    {
        private DailyMetric()
        {
        }

        public DailyMetric(Guid athleteId, decimal weight, int caloriesConsumed, int stepCount, int fatigueScore ,string? notes = null)
        {
            AthleteId = athleteId;
            Weight = weight;
            CaloriesConsumed = caloriesConsumed;
            StepCount = stepCount;
            FatigueScore = fatigueScore;
            Notes = notes;

        }

        public Guid AthleteId { get; private set; }
        public decimal Weight { get; private set; }
        public int CaloriesConsumed { get; private set; }
        public int StepCount { get; private set; }
        public int FatigueScore { get; private set; }
        public string? Notes { get; private set; }
       
    }
}
