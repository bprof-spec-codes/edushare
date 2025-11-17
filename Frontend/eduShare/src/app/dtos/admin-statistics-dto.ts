import { MaterialShortViewDto } from "./material-short-view-dto";
import { ProfilListViewDto } from "./profil-list-view-dto";

export interface AdminStatisticsDto {
	mostPopularMaterials?: MaterialShortViewDto[];
	mostActiveUsers?: ProfilListViewDto[];
}
