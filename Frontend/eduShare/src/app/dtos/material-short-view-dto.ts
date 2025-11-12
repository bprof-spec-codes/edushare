import { Subject } from "../models/subject"
import { UploaderDto } from "./uploader-dto"

export interface MaterialShortViewDto {
    id: string
    title: string
    isRecommended: boolean
    isExam: boolean
    averageRating: number
    ratingCount: number
    subject: Subject
    uploader: UploaderDto
    uploadDate: string
    downloadCount: number
}
