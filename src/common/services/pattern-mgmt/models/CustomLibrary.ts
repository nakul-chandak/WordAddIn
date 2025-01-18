import { List } from "@fluentui/react"

export class CustomLibrary {
    libraryComment: string;
    id: string;
    libraryGroup: string;
    libraryType: string;
    patterns: Pattern[];

   
    constructor(id, libraryGroup, libraryComment, libraryType, patterns) {
        this.id = id;
        this.libraryGroup = libraryGroup;
        this.libraryComment = libraryComment;
        this.libraryType = libraryType;
        this.patterns = patterns;
    }
}

export class Pattern {
    action: string;
    description: string;
    expressionType: string;
    id: string;
    label: string;
    pattern: string;
    constructor(id, label, pattern, expressionType, description) {
        this.id = id;
        this.description = description;
        this.label = label;
        this.expressionType = expressionType;
        this.pattern = pattern;
    }
}
