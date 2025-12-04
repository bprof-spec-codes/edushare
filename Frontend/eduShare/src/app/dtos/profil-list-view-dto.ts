import { ImageDto } from "./image-dto"

export interface ProfilListViewDto {
    id:string
    fullName:string
    email:string
    image:ImageDto
    isWarned?: boolean
    isBanned?: boolean
    materialCount?: number
    role: string
}
