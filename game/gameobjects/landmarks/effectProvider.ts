import { LandmarkType } from "@/game/enums/landmarkType";
import Landmark from "./landmark";
import Effect from "@/game/skillEffects/effect";
import { EffectData } from "@/game/data/types/effectData";
import EffectFactory from "@/game/skillEffects/effectFactory";

export default class EffectProvider{
    /**
     * Reference to parent
     */
    private readonly landmark: Landmark;

    private effects:Effect[];
    
    constructor(landmark:Landmark){
        this.landmark=landmark;
        let data:EffectData[];

        switch(landmark.type){
            case LandmarkType.STRONGHOLD:
                data = [
                    {
                        name: "Stronghold's Advantage",
                        description: "+2 PWR/DEF",
                        targetType: "ally",
                        duration:-1,
                        trigger: "onCast",			// Note this is onCast, as Stronghold should cast it immediately when it detects an occupant. 
                                                        // If this was onTurnStart, the buff won't be applied until next turn.
                        components:[
                            {
                                type: "stat-change",
                                amount: 2,
                                valueType: "value",
                                stat: "pwr"
                            },
                            {
                                type: "stat-change",
                                amount: 2,
                                valueType: "value",
                                stat: "def"
                            }
                        ],
                        isRemovable: false
                    },
                    {
                        name: "Rest",
                        description: "Recover 2hp at the start of each turn",
                        targetType: "ally",
                        duration:-1,
                        trigger: "onTurnStart",				
                        components:	[
                            {
                                type: "health-change",
                                amount: 2,
                                valueType: "value",
                            }
                        ],
                        isRemovable: false
                    }
                ];

                this.effects = EffectFactory.createEffects(data);
                break;
            case LandmarkType.OUTPOST:
                data = [
                    {
                        name: "Outpost's Advantage",
                        description: "+1 PWR/DEF",
                        targetType: "ally",
                        duration:-1,
                        trigger: "onCast",			// Note this is onCast, as Stronghold should cast it immediately when it detects an occupant. 
                                                        // If this was onTurnStart, the buff won't be applied until next turn.
                        components:[
                            {
                                type: "stat-change",
                                amount: 1,
                                valueType: "value",
                                stat: "pwr"
                            },
                            {
                                type: "stat-change",
                                amount: 1,
                                valueType: "value",
                                stat: "def"
                            }
                        ],
                        isRemovable: false
                    },
                    {
                        name: "Rest",
                        description: "Recover 1hp at the start of each turn",
                        targetType: "ally",
                        duration:-1,
                        trigger: "onTurnStart",				
                        components:	[
                            {
                                type: "health-change",
                                amount: 1,
                                valueType: "value",
                            }
                        ],
                        isRemovable: false
                    }
                ];

                this.effects = EffectFactory.createEffects(data);
                break;
            default:
                this.effects = [];
                break;
        } 
    }

    // TODO: Call effect system and insert buffs
    buffOccupant(){
        const occupant = this.landmark.occupant;
        if(!occupant) return;

        
    }
}