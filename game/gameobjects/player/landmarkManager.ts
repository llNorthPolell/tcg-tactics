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
        if (!landmark.capturable)
            throw new Error (`${landmark.id} cannot be owned by any players...`);
        this.landmarks.get(landmark.type)?.push(landmark);
        console.log(`${landmark.id} has been captured by ${this.player.name}`)
        landmark.capturable.getLinkedLandmarks().forEach(
            child=>{
                if (child.capturable)
                    this.landmarks.get(child.type)?.push(child);
            }
        )
    }

    unregisterLandmark(landmarkToRemove: Landmark){
        if (!landmarkToRemove.capturable)
            throw new Error (`${landmarkToRemove.id} cannot be owned by any players...`);
        let landmarkList = this.landmarks.get(landmarkToRemove.type)!;
        landmarkList = landmarkList?.filter(landmark=> landmark == landmarkToRemove);
        this.landmarks.set(landmarkToRemove.type,landmarkList);

        const linkedLandmarks = landmarkToRemove.capturable.getLinkedLandmarks();
        linkedLandmarks.forEach(
            child=>{
                if (!child.capturable)return;
                const newList = this.landmarks.get(child.type)!.filter(landmark=> landmark.id == child.id);
                this.landmarks.set(child.type,newList);
            }
        )
    }

    getStartingStronghold(){
        return this.landmarks.get(LandmarkType.STRONGHOLD)![0];
    }

    get(landmarkType: LandmarkType) : Landmark[]{
        return this.landmarks.get(landmarkType)!;
    }

}