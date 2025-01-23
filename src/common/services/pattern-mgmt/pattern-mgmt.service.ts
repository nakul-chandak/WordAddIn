import { HttpClient } from "../../http";
import { CustomLibrary } from "./models/CustomLibrary";
import { SystemPattern } from "./models/SystemPattern";

export class PatternMgmtServiceImpl {
    getSystemPatterns(): Promise<any> {
        const baseURL = 'common/v1/library/system-library/paginate/lite?order=DESC&page=1&take=50&disablePagination=true';
        return HttpClient.get(baseURL, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }

    getSystemLibrary(id): Promise<any> {
        const baseURL = 'common/v1/library/' + id;
        return HttpClient.get(baseURL, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }

    getCustomPatterns(): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/custom-patterns';
        return HttpClient.get(baseURL, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }

    updateStatus(request: SystemPattern): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/toggle-library-option';
        return HttpClient.post<any>(`${baseURL}`, request, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        });
    }

    getActivePatterns(): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/get-active-patterns';
        return HttpClient.get(baseURL, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }

    getCustomPatternById(id): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/get-library-by-id/' + id;
        return HttpClient.get(baseURL, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }

    updateCustomPattern(request: CustomLibrary): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/update-library-meta/' + request.id;
        return HttpClient.patch(baseURL, request, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }

    updateLibraryNPattern(request: CustomLibrary): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/update-custom-library/' + request.id;
        return HttpClient.patch(baseURL, request, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }

    deletePattern(libraryId: string, patternId): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/' + libraryId + '/term/' + patternId;
        return HttpClient.delete(baseURL, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }
    deleteLibrary(libraryId: string): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/' + libraryId;
        return HttpClient.delete(baseURL, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }
    checkIsLibraryNameAvailble(pattern: any): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/is-library-name-available';
        return HttpClient.post(baseURL, pattern, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }

    AddLibraryNPattern(pattern: any): Promise<any> {
        const baseURL = 'guardrail/v1/patterns/create-custom-library';
        return HttpClient.post(baseURL, pattern, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.sessionStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }
}

const PatternMgmtService = new PatternMgmtServiceImpl();
export { PatternMgmtService };