import { ImageDto } from "./image-dto"
import { MaterialShortViewDto } from "./material-short-view-dto"
import { MaterialViewForProfileDto } from "./material-view-for-profile-dto"

export class ProfileViewDto {
    id:string = ""
    fullName:string = ""
    email:string = ""
    image:ImageDto = new ImageDto
    materials:MaterialShortViewDto[] = []
    isWarned?: boolean
    isBanned?: boolean
    warnedAt?: string
    bannedAt?: string
}
