export interface Athlete {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    targetCalories?: number;
    targetSteps?: number;
    isOnboardingCompleted?: boolean;
    phoneNumber?: string;
    occupation?: string;
    mainReason?: string;
    shortTermGoal?: string;
    longTermGoal?: string;
    expectations?: string;
    heightCm?: number;
    startingWeightKg?: number;
    trainingHistory?: string;
    currentTrainingRoutine?: string;
    outsidePhysicalActivity?: string;
    hasTrackedMacros?: string;
    hasWorkedWithCoach?: string;
    hearAboutUs?: string;
    additionalNotes?: string;
}

export interface AthletePerformanceDto {
    athleteId: string;
    fullName: string;
    isActiveToday: boolean;
    lastLogDate: string | null;
    hasWorkoutProgram: boolean;
    hasDietProgram: boolean;
    needsAttention: boolean;
    attentionReason: string | null;
}

export interface CoachDashboardDto {
    totalAthletes: number;
    dailyActiveAthletes: number;
    needsAttentionCount: number;
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

export interface UpdateAthleteTargetsRequest {
    targetCalories: number;
    targetSteps: number;
}

export interface SubmitOnboardingFormRequest {
    dateOfBirth: string;
    phoneNumber: string;
    occupation: string;
    mainReason: string;
    shortTermGoal: string;
    longTermGoal: string;
    expectations: string;
    heightCm: number;
    startingWeightKg: number;
    trainingHistory: string;
    currentTrainingRoutine: string;
    outsidePhysicalActivity: string;
    hasTrackedMacros: string;
    hasWorkedWithCoach: string;
    hearAboutUs: string;
    additionalNotes: string;
}
