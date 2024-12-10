export class ProfanityCheckRequest {
    constructor(inputPrompt:string,check_for_profanity:boolean=true){
        this.prompt=inputPrompt
        this.check_for_profanity=check_for_profanity
    }
    prompt: string;
    check_for_profanity: boolean;
}