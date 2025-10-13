import { ImageContent } from "./image-content"

export class Profile {
    id:string=''
    fullName:string=''
    email:string=''
    image:ImageContent | null = null
}
