import { MaterialShortViewDto } from "./material-short-view-dto";

export interface HomepageStatisticsDto {
    materialcount: number
    usercount: number
    subjectcount: number
    lastMaterials: MaterialShortViewDto[]
    downloadcount: number
}
