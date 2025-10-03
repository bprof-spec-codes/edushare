import { FileContent } from "../models/file-content"

export interface MaterialCreateDto {
    title: string
    description?: string
    content: FileContent
}
