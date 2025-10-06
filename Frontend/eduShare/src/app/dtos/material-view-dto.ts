import { FileContent } from "../models/file-content"
import { UploaderDto } from "./uploader-dto"

export interface MaterialViewDto {
    id: string
    title: string
    subject: string
    description: string
    uploadDate: string
    uploader: UploaderDto
    content: FileContent
}
