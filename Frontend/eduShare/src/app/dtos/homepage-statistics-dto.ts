import { MaterialShortViewDto } from "./material-short-view-dto";

export interface HomepageStatisticsDto {
    materialCount: number
    userCount: number
    subjectCount: number
    lastMaterials: MaterialShortViewDto[]
    downloadCount: number
}
