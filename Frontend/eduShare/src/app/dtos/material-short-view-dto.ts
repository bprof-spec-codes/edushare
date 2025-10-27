import { UploaderDto } from "./uploader-dto"

export interface MaterialShortViewDto {
    id: string
    title: string
    subject: string
    uploader: UploaderDto
    uploadDate: string
}
