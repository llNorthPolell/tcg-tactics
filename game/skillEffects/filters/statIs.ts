import Unit from "@/game/gameobjects/units/unit";
import TargetFilter from "./targetFilter";
import { UnitStatField } from "@/game/enums/keys/unitStatField";

export default class StatIs implements TargetFilter{
    constructor(
        public readonly unitStat : string,
        public readonly compareOp: string,
        public readonly amount: number
    ){}

    check(target: Unit): boolean {
        switch(this.unitStat){
            case UnitStatField.HP:
                return this.compare(target.getCurrentStats().hp);
            case UnitStatField.SP:
                return this.compare(target.getCurrentStats().sp);
            case UnitStatField.PWR:
                return this.compare(target.getCurrentStats().pwr);
            case UnitStatField.DEF:
                return this.compare(target.getCurrentStats().def);
            case UnitStatField.MVT:
                return this.compare(target.getCurrentStats().mvt);
            case UnitStatField.RNG:
                return this.compare(target.getCurrentStats().rng);
            default:
                return false;
        }
    }

    private compare(stat:number):boolean{
        switch(this.compareOp){
            case "=":
                return stat === this.amount;
            case ">":
                return stat > this.amount;
            case ">=":
                return stat >= this.amount;
            case "<":
                return stat < this.amount;
            case "<=":
                return stat <= this.amount;
            case "!=":
                return stat != this.amount;
            default:
                return false;
        }
    }
    
}