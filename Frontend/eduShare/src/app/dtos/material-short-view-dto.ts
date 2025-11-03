import { Subject } from "../models/subject"
import { UploaderDto } from "./uploader-dto"

export interface MaterialShortViewDto {
    id: string
    title: string
    subject: Subject
    uploader: UploaderDto
    uploadDate: string
}
