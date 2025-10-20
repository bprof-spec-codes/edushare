export type JwtPayload = {
    subject?: string
    roles?: string[] | string
    expiration?: number
}