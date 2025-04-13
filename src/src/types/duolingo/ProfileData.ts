export interface ProfileData {
    courses: Course[];
    username: string;
}

export interface Course {
    courseId: string;
    fromLanguageId: string;
    isCurrent: boolean;
    learningLanguageId: string;
    learningLanguageName: string;
}