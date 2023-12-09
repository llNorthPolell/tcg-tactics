import SkillEffect from "@/game/scripts/skillEffects/skillEffect";
import CapturableLandmark from "./capturableLandmark";
import Buff from "@/game/scripts/skillEffects/buff";
import { ValueType } from "@/game/enums/valueType";
import { UnitStatField } from "@/game/enums/unitStatField";
import RallyPoint from "./rallyPoint";
import ParentLandmark from "./parentLandmark";
import LandmarkImpl from "./baseLandmark";

export default class Outpost extends LandmarkImpl implements ParentLandmark,CapturableLandmark{
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