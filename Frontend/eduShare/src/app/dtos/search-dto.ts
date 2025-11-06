export class SearchDto {
    constructor (
        public name: string = "",
        public semester: number | null = 0,
        public subjectId: string = "",
        public uploaderId: string = ""
    ) { }
}