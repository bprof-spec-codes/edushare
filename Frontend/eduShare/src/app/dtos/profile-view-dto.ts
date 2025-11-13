import { ImageDto } from "./image-dto"
import { MaterialShortViewDto } from "./material-short-view-dto"
import { MaterialViewForProfileDto } from "./material-view-for-profile-dto"

export interface ProfileViewDto {
    id:string
    fullName:string
    email:string
    image:ImageDto
    materials:MaterialShortViewDto[]
    isWarned?: boolean
    isBanned?: boolean
    warnedAt?: string
    bannedAt?: string
}
