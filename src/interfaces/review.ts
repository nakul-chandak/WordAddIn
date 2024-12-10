import { FluentIcon } from "@fluentui/react-icons";

export interface IReview {
    promptType: string;
    description: string;
    buttonCaption: string;
    isLike:boolean,
    isDisLike:boolean
  }