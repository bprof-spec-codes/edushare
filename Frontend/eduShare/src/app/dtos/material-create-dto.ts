import { FileContentDto } from "./file-content-dto"

export interface MaterialCreateDto {
    title: string
    description?: string
    content: FileContentDto
}
