import SkillEffect from "@/game/scripts/skillEffects/skillEffect";
import Buff from "@/game/scripts/skillEffects/basic/buff";
import { ValueType } from "@/game/enums/keys/valueType";
import { UnitStatField } from "@/game/enums/keys/unitStatField";
import ParentLandmark from "./parentLandmark";
import RallyPoint from "./rallyPoint";
import BaseCapturableLandmark from "./baseCapturableLandmark";
import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import Unit from "../unit";
import Heal from "@/game/scripts/skillEffects/basic/heal";
import GamePlayer from "../gamePlayer";

export default class Stronghold extends BaseCapturableLandmark implements ParentLandmark{
    private rallyPoints: RallyPoint[];
    readonly effects:SkillEffect[]

    constructor(id:string, x:number,y:number,tile: Phaser.Tilemaps.Tile){
        super(id,x,y,tile);


        this.effects = [
            new Buff(
                "Stronghold's Advantage",
                2,
                ValueType.VALUE,
                UnitStatField.PWR,
                TARGET_TYPES.ally,
                -1,
                false
            ),
            new Buff(
                "Stronghold's Advantage",
                2,
                ValueType.VALUE,
                UnitStatField.DEF,
                TARGET_TYPES.ally,
                -1,
                false
            ),
            new Heal(
                "Rest",
                2,
                ValueType.VALUE,
                -1,
                TARGET_TYPES.ally,
                true,
                false,
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

    capture(owner:GamePlayer):void{
        this.owner = owner;

        if(!this.occupant) return;
        this.effects.forEach(
            effect=>{
                this.occupant!.insertBuff(effect);
                if (effect.name === "Stronghold's Advantage")
                    effect.apply();
            }
        )
    }

    enter(unit: Unit): void {
        console.log(`${unit.getUnitData().name} has entered ${this.id}`);
        if (unit.getOwner() != this.owner) return;
        this.occupant=unit;
        this.effects.forEach(
            effect=>{
                unit.insertBuff(effect);
                if (effect.name === "Stronghold's Advantage")
                    effect.apply();
            }
        )
    }
    
    leave(): void{
        if (!this.occupant) return;
        console.log(`${this.occupant.getUnitData().name} has left ${this.id}`);
        if (this.occupant.getOwner() == this.owner) {
            this.effects.forEach(
                effect=>{
                    this.occupant?.forceRemoveDebuff(effect);
                    effect.reset();
                }
            )
        }
        this.occupant=undefined;
        this.resetCaptureTick();
    }
}