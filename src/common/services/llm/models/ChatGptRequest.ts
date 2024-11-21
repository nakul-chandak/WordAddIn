export enum SourceType {
    GPT3="gpt3",
    BARD="bard",
  }
  
export class ChatGptRequest {

    constructor(inputPrompt:string,sourceType:SourceType=SourceType.GPT3){
        this.prompt=inputPrompt
        this.sourceType=sourceType
    }
    prompt: string;
    readonly sourceType?: SourceType = SourceType.GPT3;
}
  