import { FileContent } from "../models/file-content"
import { Subject } from "../models/subject"
import { UploaderDto } from "./uploader-dto"

export interface MaterialViewDto {
    id: string
    title: string
    subject: Subject
    description: string
    uploadDate: string
    uploader: UploaderDto
    content: FileContent
}
