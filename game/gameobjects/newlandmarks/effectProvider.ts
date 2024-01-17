import { LandmarkType } from "@/game/enums/landmarkType";
import Landmark from "./landmark";
import Effect from "@/game/skillEffects/effect";

export default class EffectProvider{
    /**
     * Reference to parent
     */
    private landmark: Landmark;

    //private effects:Effect;
    
    constructor(landmark:Landmark){
        this.landmark=landmark;

        switch(landmark.type){
            case LandmarkType.STRONGHOLD:
                break;
            case LandmarkType.OUTPOST:
                break;
            default:
                break;
        } 
    }


}