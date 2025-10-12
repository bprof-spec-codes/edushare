import { ImageDto } from "./image-dto"
import { MaterialViewForProfileDto } from "./material-view-for-profile-dto"

export interface ProfileViewDto {
    id:string
    fullName:string
    email:string
    image:ImageDto
    materials:MaterialViewForProfileDto[]
}
