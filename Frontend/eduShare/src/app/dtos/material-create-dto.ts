import { FileContentDto } from "./file-content-dto"

export interface MaterialCreateDto {
    title: string
    subject: string
    description?: string
    content: FileContentDto
}
