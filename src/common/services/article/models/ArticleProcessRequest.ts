export class ArticleProcessRequest {
    article: string;
    top_k: number;
    assertions?: Array<string>;
    top_n: number;
    recursion_level: number;
    constructor(article: string) {
        this.article = article ?? '';
        this.top_k = 10;
        this.top_n = 5;
        this.recursion_level = 3;
        this.assertions = [];
    }
    toPlainObject() {
        return {
            article: this.article,
            top_k: this.top_k,
            top_n: this.top_n,
            assertions: this.assertions ?? [],
            recursion_level: this.recursion_level,
        };
    }
}
