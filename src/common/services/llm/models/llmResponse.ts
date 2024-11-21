
export class LlmResponse {
    id: string;
    prompt: string;
    output: Output;
    sourceTypes: string[];
    isFavorite: boolean;
    updatedAt: string;
    createdBy: string;
    createdAt: string;
    deletedAt?: any;
    progressPercentage: number;
  }
  export class Output {
    gpt3: string;
  }