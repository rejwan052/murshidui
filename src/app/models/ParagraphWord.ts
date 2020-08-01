export class ParagraphWord {
    break: boolean;
    index: number;
    content: string;
    relevant: boolean;
    irrelevant: boolean;
    space: boolean;
    punctuation: boolean;
    ltrBlock: boolean;
    words: ParagraphWord[];
}
