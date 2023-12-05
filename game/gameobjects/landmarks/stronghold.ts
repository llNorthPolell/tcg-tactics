import SkillEffect from "@/game/scripts/skillEffects/skillEffect";
import Player from "../player";
import CapturableLandmark from "./capturableLandmark";
import Buff from "@/game/scripts/skillEffects/buff";
import { ValueType } from "@/game/enums/valueType";
import { UnitStatField } from "@/game/enums/unitStatField";
import ParentLandmark from "./parentLandmark";
import RallyPoint from "./rallyPoint";

export default class Stronghold extends CapturableLandmark implements ParentLandmark{
    private rallyPoints: RallyPoint[];
    readonly effects:SkillEffect[]

    constructor(id:string, x:number,y:number,owner? : Player){
        super(id,x,y,owner);

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
}