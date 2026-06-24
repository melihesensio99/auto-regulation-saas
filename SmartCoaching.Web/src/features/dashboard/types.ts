export interface Athlete {
    id: string;
    firstName: string;
    lastName: string;
}

export interface AthletePerformanceDto {
    athleteId: string;
    fullName: string;
    heightCm: number;
    weeklyTargetCalories: number;
    weeklyConsumedCalories: number;
    isMetCalorieTarget: boolean;
    weeklyTargetSteps: number;
    weeklyTakenSteps: number;
    isMetStepTarget: boolean;
    latestWeightKg: number;
    latestFrontPhotoUrl: string | null;
    isSlacking: boolean;
    remainingSubscriptionDays: number;
    isActiveToday: boolean;
    weeklyComplianceRatePercentage: number;
    aiInsight: string | null;
    startingWeightKg: number;
}

export interface CoachDashboardDto {
    totalAthletes: number;
    dailyActiveAthletes: number;
    aiInsight: string;
    athletePerformances: AthletePerformanceDto[];
}

export interface ProgressLog {
    id: string;
    athleteId: string;
    date: string;
    consumedCalories: number;
    takenSteps: number;
    isWorkoutCompleted: boolean;
    weightKg: number | null;
    notes: string | null;
    frontPhotoUrl: string | null;
    backPhotoUrl: string | null;
    sidePhotoUrl: string | null;
    aiAnalysis: string | null;
    coachFeedback: string | null;
}

export interface AddFeedbackRequest {
    feedback: string;
}

export interface CreateAthleteRequest {
    firstName: string;
    lastName: string;
    email: string;
    subscriptionEndDate: string;
}

export interface WorkoutExercise {
    dayName: string;
    exerciseName: string;
    sets: number;
    reps: string;
    restTimeInSeconds: number;
    notes: string | null;
}

export interface AssignWorkoutProgramRequest {
    exercises: WorkoutExercise[];
}

export interface WorkoutExerciseResponse {
    id: string;
    exerciseName: string;
    sets: number;
    reps: string;
    restTimeInSeconds: number;
    notes: string | null;
}

export interface WorkoutDay {
    dayName: string;
    exercises: WorkoutExerciseResponse[];
}

export interface AthleteWorkoutProgram {
    athleteId: string;
    days: WorkoutDay[];
}

export interface DietMealDto {
    order: number;
    mealName: string;
    foods: string;
    notes: string;
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
}

export interface AssignDietProgramRequest {
    generalDietNotes: string;
    meals: DietMealDto[];
}

export interface DietMealResponseDto {
    id: string;
    order: number;
    mealName: string;
    foods: string;
    notes: string;
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
}

export interface AthleteDietProgram {
    athleteId: string;
    generalDietNotes: string;
    meals: DietMealResponseDto[];
}

export interface SubmitOnboardingFormRequest {
    dateOfBirth: string;
    heightCm: number;
    startingWeightKg: number;
    injuryHistory: string;
    goals: string;
    lifestyle: string;
    supplementUsage: string;
    dietaryPreferences: string;
}
