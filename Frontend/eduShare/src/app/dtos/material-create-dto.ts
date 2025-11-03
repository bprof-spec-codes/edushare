import { FileContentDto } from "./file-content-dto"

export interface MaterialCreateDto {
    title: string
    subjectId: string
    description?: string
    content: FileContentDto
}
