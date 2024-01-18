import { LandmarkType } from "@/game/enums/landmarkType";
import Landmark from "../landmarks/landmark";
import GamePlayer from "./gamePlayer";

export default class LandmarkManager{
    readonly player:GamePlayer;

    private landmarks: Map<LandmarkType,Landmark[]>;

    constructor(player:GamePlayer){
        this.player=player;
        this.landmarks = new Map();

        this.landmarks.set(LandmarkType.STRONGHOLD,[]);
        this.landmarks.set(LandmarkType.OUTPOST,[]);
        this.landmarks.set(LandmarkType.RALLY_POINT,[]);
        this.landmarks.set(LandmarkType.RESOURCE_NODE,[]);
    }

    registerLandmark(landmark: Landmark) {
        this.landmarks.get(landmark.type)?.push(landmark);
        console.log(`${landmark.id} has been captured by ${this.player.name}`)
    }

    unregisterLandmark(landmarkToRemove: Landmark){
        let landmarkList = this.landmarks.get(landmarkToRemove.type)!;
        landmarkList = landmarkList?.filter(landmark=> landmark == landmarkToRemove);
        this.landmarks.set(landmarkToRemove.type,landmarkList);
    }

    getStartingStronghold(){
        return this.landmarks.get(LandmarkType.STRONGHOLD)![0];
    }

}