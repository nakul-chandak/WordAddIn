export class PromptProtectResponseDto {
    id: string;
    prompt: string;
    is_profanity_para: boolean
    promptsInfoResponseDto: PromptInfoResponseDto[]
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    isFavorite: boolean;
    progressPercentage: number;
}

export class PromptInfoResponseDto {  
    sentence: string
    profanityCheckResponseDto: ProfanityCheckResponseDto[]
}

export class ProfanityCheckResponseDto {    
    profanity: string
    index: number
    word: string
}