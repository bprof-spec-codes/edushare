import { Subject } from "../models/subject"
import { UploaderDto } from "./uploader-dto"

export interface MaterialShortViewDto {
    id: string
    title: string
    isRecommended: boolean
    isExam: boolean
    subject: Subject
    uploader: UploaderDto
    uploadDate: string
}
