import { UploaderDto } from "./uploader-dto"

export interface MaterialShortViewDto {
    id: string
    title: string
    uploader: UploaderDto
    uploadDate: string
}
