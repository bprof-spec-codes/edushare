import { FileContent } from "../models/file-content"
import { Subject } from "../models/subject"
import { UploaderDto } from "./uploader-dto"
import { MaterialShortViewDto } from "./material-short-view-dto"

export interface MaterialViewDto {
    id: string
    title: string
    subject: Subject
    description: string
    isRecommended:boolean
    uploadDate: string
    uploader: UploaderDto
    content: FileContent
    isExam: boolean
    averageRating: number
    ratingCount: number
    downloadCount: number
    recommendedMaterials?: MaterialShortViewDto[]
}
