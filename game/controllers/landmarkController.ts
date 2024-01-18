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

    updateLandmarks(){
        const landmarks = this.field.landmarksByLocation;

        landmarks.forEach(landmark=>{
            const captured = landmark.capturable?.attemptCapture();
            if (captured){
                const occupant = landmark.occupant;
                if (!occupant)
                    throw new Error ("Failed to capture landmark; no occupant was found...");
                const newOwner = occupant.getOwner();
                if (!newOwner)
                    throw new Error (`Failed to capture landmark; ${occupant} does not have an owner...`);
                this.transferLandmark(landmark,newOwner);
            }
        });
    }
}