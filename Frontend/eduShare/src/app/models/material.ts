import { FileContent } from "./file-content"

export class Material {
    id: string = ''
    title: string = ''
    subject: string = ''
    description: string = ''
    content: FileContent | null = null
}
