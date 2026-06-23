export interface Athlete {
    id: string;
    firstName: string;
    lastName: string;
}

export interface CheckIn {
    id: string;
    athleteId: string;
    date: string;
    weightKg: number;
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
    dateOfBirth: string;
    heightCm: number;
    startingWeightKg: number;
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
