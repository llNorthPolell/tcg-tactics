import SkillEffect from "@/game/scripts/skillEffects/skillEffect";
import CapturableLandmark from "./capturableLandmark";
import Buff from "@/game/scripts/skillEffects/buff";
import { ValueType } from "@/game/enums/valueType";
import { UnitStatField } from "@/game/enums/unitStatField";
import ParentLandmark from "./parentLandmark";
import RallyPoint from "./rallyPoint";
import BaseLandmark from "./baseLandmark";

export default class Stronghold extends BaseLandmark implements ParentLandmark,CapturableLandmark{
    private rallyPoints: RallyPoint[];
    readonly effects:SkillEffect[]

    constructor(id:string, x:number,y:number,tile: Phaser.Tilemaps.Tile){
        super(id,x,y,tile);

        this.effects = [
            new Buff(
                "Stronghold's Advantage",
                3,
                ValueType.VALUE,
                UnitStatField.PWR,
                -1,
                false
            ),
            new Buff(
                "Stronghold's Advantage",
                3,
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