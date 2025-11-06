export class SearchDto {
    constructor (
        public name: string = "",
        public semester: number = 0,
        public subjectId: string = "",
        public uploaderId: string = ""
    ) { }
}