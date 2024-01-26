import { LandmarkType } from "@/game/enums/landmarkType"
import Landmark from "@/game/gameobjects/landmarks/landmark"

export type LandmarksCollection = {
    byType:Map<LandmarkType,Landmark[]>, 
    byLocation:Map<string,Landmark>
}
