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
    exerciseLibraryId?: string;
    targetMuscle?: string;
    gifUrl?: string;
    imageUrl?: string;
    instructions?: string | null;
}

export interface AssignWorkoutProgramRequest {
    exercises: WorkoutExercise[];
}

export interface WorkoutExerciseResponse {
    id: string;
    dayName: string;
    exerciseName: string;
    sets: number;
    reps: string;
    restTimeInSeconds: number;
    notes: string | null;
    exerciseLibraryId?: string | null;
    targetMuscle?: string | null;
    gifUrl?: string | null;
    imageUrl?: string | null;
    instructions?: string | null;
}

export interface AthleteWorkoutProgram {
    athleteId: string;
    exercises: WorkoutExerciseResponse[];
}

export interface DietMealDto {
    order: number;
    mealName: string;
    foods: string;
    notes: string;
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
}

export interface AthleteDietProgram {
    athleteId: string;
    generalDietNotes: string;
    meals: DietMealResponseDto[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
}

export interface UpdateAthleteTargetsRequest {
    targetCalories: number;
    targetSteps: number;
}

export interface AgentChatRequest {
    message: string;
    contextAthleteId?: string | null;
    contextAthleteName?: string | null;
}

export interface AgentChatResponse {
    textReply: string;
    uiAction?: string | null;
    actionData?: unknown;
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
