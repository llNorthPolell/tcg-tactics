import SkillEffect from "@/game/scripts/skillEffects/skillEffect";
import Buff from "@/game/scripts/skillEffects/buff";
import { ValueType } from "@/game/enums/valueType";
import { UnitStatField } from "@/game/enums/unitStatField";
import RallyPoint from "./rallyPoint";
import ParentLandmark from "./parentLandmark";
import BaseCapturableLandmark from "./baseCapturableLandmark";

export default class Outpost extends BaseCapturableLandmark implements ParentLandmark{
    private rallyPoints: RallyPoint[];
    readonly effects:SkillEffect[]

    constructor(id:string, x:number,y:number,tile: Phaser.Tilemaps.Tile){
        super(id,x,y,tile);

        this.effects = [
            new Buff(
                "Outpost's Advantage",
                1,
                ValueType.VALUE,
                UnitStatField.PWR,
                -1,
                false
            ),
            new Buff(
                "Outpost's Advantage",
                1,
                ValueType.VALUE,
                UnitStatField.DEF,
                -1,
                false
            )
        ];

        this.rallyPoints = [];
    }
    
    linkRallyPoints(rallyPoints: RallyPoint[]){
        this.rallyPoints = [...this.rallyPoints, ...rallyPoints];
    }

    getRallyPoints(){
        return this.rallyPoints;
    }
    
}