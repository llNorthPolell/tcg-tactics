import { LandmarkType } from "@/game/enums/landmarkType";
import Landmark from "../landmarks/landmark";
import GamePlayer from "./gamePlayer";

export default class LandmarkManager{
    private strongholds:Landmark[];
    private outposts:Landmark[];
    private rallyPoints:Landmark[];
    private resourceNodes:Landmark[];

    constructor(
        public readonly player:GamePlayer
    ){
        this.strongholds=[];
        this.outposts=[];
        this.rallyPoints=[];
        this.resourceNodes=[];
    }

    registerLandmark(landmark: Landmark) {
        if (!landmark.capturable)
            throw new Error (`${landmark.id} cannot be owned by any players...`);
        
        switch(landmark.type){
            case LandmarkType.STRONGHOLD: 
                this.strongholds.push(landmark);
                break;
            case LandmarkType.OUTPOST:
                this.outposts.push(landmark);
                break;
            case LandmarkType.RALLY_POINT:
                this.rallyPoints.push(landmark);
                break;
            case LandmarkType.RESOURCE_NODE:
                this.resourceNodes.push(landmark);
                break;
            default:
                break;
        }

        console.log(`${landmark.id} has been captured by ${this.player.name}`)
        landmark.capturable.getLinkedLandmarks().forEach(
            child=>{
                if (child.capturable)
                    this.registerLandmark(child);
            }
        )
    }

    unregisterLandmark(landmarkToRemove: Landmark){
        if (!landmarkToRemove.capturable)
            throw new Error (`${landmarkToRemove.id} cannot be owned by any players...`);

        switch(landmarkToRemove.type){
            case LandmarkType.STRONGHOLD: 
                this.strongholds= this.strongholds.filter(stronghold=> stronghold != landmarkToRemove);
                break;
            case LandmarkType.OUTPOST:
                this.outposts= this.outposts.filter(outpost=> outpost != landmarkToRemove);
                break;
            case LandmarkType.RALLY_POINT:
                this.rallyPoints= this.rallyPoints.filter(rallyPoint=> rallyPoint != landmarkToRemove);
                break;
            case LandmarkType.RESOURCE_NODE:
                this.resourceNodes= this.resourceNodes.filter(resourceNode=> resourceNode != landmarkToRemove);
                break;
            default:
                break;
        }


        const linkedLandmarks = landmarkToRemove.capturable.getLinkedLandmarks();
        linkedLandmarks.forEach(
            child=>{
                if (!child.capturable)return;
                this.unregisterLandmark(child);
            }
        )
    }

    getStartingStronghold(){
        return this.strongholds[0];
    }

    get(landmarkType: LandmarkType) : Landmark[]{
        switch(landmarkType){
            case LandmarkType.STRONGHOLD: 
                return this.strongholds;
            case LandmarkType.OUTPOST:
                return this.outposts;
            case LandmarkType.RALLY_POINT:
                return this.rallyPoints;
            case LandmarkType.RESOURCE_NODE:
                return this.resourceNodes;
            default:
                return [];
        }
    }

}