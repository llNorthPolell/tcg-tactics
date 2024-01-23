import { Position } from "@/game/data/types/position";
import Landmark from "../gameobjects/landmarks/landmark";
import GamePlayer from "../gameobjects/player/gamePlayer";
import Field from "../state/field";
import Unit from "../gameobjects/units/unit";

export default class LandmarkController{
    private readonly field:Field;

    constructor(field:Field){
        this.field=field;
    }

    transferLandmark(landmark:Landmark, player:GamePlayer){
        if(!landmark.capturable)
            throw new Error("Landmark cannot be captured...")
        
        const prevOwner = landmark.capturable.getOwner();
        if (prevOwner)
            prevOwner?.landmarks.unregisterLandmark(landmark);

        player.landmarks.registerLandmark(landmark);
        landmark.capturable.setOwner(player);
        landmark.tile.tint=player.color;
    }

    getLandmarkAt(position:Position){
        return this.field.landmarksByLocation.get(`${position.x}_${position.y}`);
    }

    enterLandmark(landmark:Landmark,occupant:Unit){
        landmark.occupant=occupant;
    }

    leaveLandmark(landmark:Landmark){
        this.resetLandmark(landmark)
        landmark.occupant=undefined;       
    }

    resetLandmark(landmark:Landmark){
        if(!landmark.capturable) return;
        landmark.capturable.resetCapture();
    }

    updateLandmarks(activePlayer:GamePlayer){
        const landmarks = this.field.landmarksByLocation;

        landmarks.forEach(landmark=>{
            const occupant = landmark.occupant;
            if(!occupant) return;

            const occupantOwner = occupant.getOwner();
            if(!occupantOwner) return;

            if(occupant.getOwner()!==activePlayer) return;
            const captured = landmark.capturable?.attemptCapture();
            
            if (captured)
                this.transferLandmark(landmark,occupantOwner);
            
        });
    }
}