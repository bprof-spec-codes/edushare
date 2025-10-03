import { FileContent } from "./file-content"

export class Material {
    id: string=''
    title: string=''
    description: string=''
    content: FileContent={fileName:'', base64:''}
}
