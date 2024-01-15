import SkillEffect from "@/game/scripts/skillEffects/skillEffect";
import Buff from "@/game/scripts/skillEffects/buff";
import { ValueType } from "@/game/enums/keys/valueType";
import { UnitStatField } from "@/game/enums/keys/unitStatField";
import RallyPoint from "./rallyPoint";
import ParentLandmark from "./parentLandmark";
import BaseCapturableLandmark from "./baseCapturableLandmark";
import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import ConditionalEffect from "@/game/scripts/skillEffects/conditionalEffect";

export default class Outpost extends BaseCapturableLandmark implements ParentLandmark{
    private rallyPoints: RallyPoint[];
    readonly effects:SkillEffect[]

    constructor(id:string, x:number,y:number,tile: Phaser.Tilemaps.Tile){
        super(id,x,y,tile);

        this.effects = [
            new ConditionalEffect(
                "Outpost's Advantage",
                ()=>{return this.isStandingOnOutpost()},
                [
                    new Buff(
                        "Outpost's Advantage",
                        1,
                        ValueType.VALUE,
                        UnitStatField.PWR,
                        TARGET_TYPES.unit,
                        -1,
                        false
                    ),
                    new Buff(
                        "Outpost's Advantage",
                        1,
                        ValueType.VALUE,
                        UnitStatField.DEF,
                        TARGET_TYPES.unit,
                        -1,
                        false
                    )
                ],
                -1,
                TARGET_TYPES.unit,
                false
            )
            
            
        ];

        this.rallyPoints = [];
    }
    
    isStandingOnOutpost():boolean{
        if(this.occupant) return true;
        return false;
    }

    linkRallyPoints(rallyPoints: RallyPoint[]){
        this.rallyPoints = [...this.rallyPoints, ...rallyPoints];
    }

    getRallyPoints(){
        return this.rallyPoints;
    }
    
}