export interface HttpErrorResponse {
    statusCode: number,
    message: string
}
export interface Result {
    id?: string
    articleName: string
    articleId?: string
    source: string
    excerpt: string
    score: number
    accept:boolean
}


export interface Assertion {
    id: string,
    articleId: string,
    colorCode?: string,
    articleName: string,
    articleIndex?: number,
    riskAssessment?: string,
    assertPosition: number,
    topRanks: Result[]
}

export interface AssertionResult {
    id: string
    userId: string
    article: string
    updatedAt: string
    createdBy: string
    createdAt: string
    percentage?: number,
    deletedAt: any
    isFavorite?:boolean
    time?:string
    isCompleted?:boolean;
    tag?: string
    progressPercentage: number
    tags?: string[]
    assertions: Assertion[]
  }



export interface ArticleUpdateRequest {
    isFavorite: boolean,
    progressPercentage: number
    id: string
}
