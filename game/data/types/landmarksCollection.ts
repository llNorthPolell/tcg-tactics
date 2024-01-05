import Outpost from "@/game/gameobjects/landmarks/outpost";
import RallyPoint from "@/game/gameobjects/landmarks/rallyPoint";
import ResourceNode from "@/game/gameobjects/landmarks/resourceNode";
import Stronghold from "@/game/gameobjects/landmarks/stronghold";

export type LandmarksCollection = {
    strongholds : Stronghold[],
    outposts: Outpost[],
    resourceNodes: ResourceNode[],
    rallyPoints?:RallyPoint[],
}