import { HttpClient } from "../../http";
import { HttpErrorResponse } from "../article/models/ArticleResponse";
import { ProfanityCheckRequest } from "./models/ProfanityCheckRequest";
import { PromptProtectResponseDto } from "./models/PromptProtectResponse";

class PromptProtectImpl {
    ProcessPromptProtect(request: ProfanityCheckRequest): Promise<PromptProtectResponseDto> {
        const baseURL = '/prompt/clientApp';
        return HttpClient.post<PromptProtectResponseDto>(baseURL, request, {
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.data).catch((err: HttpErrorResponse) => {
            throw err;
        });
    }
}
const PromptProtectService = new PromptProtectImpl();

export { PromptProtectService };
