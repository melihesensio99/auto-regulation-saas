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
