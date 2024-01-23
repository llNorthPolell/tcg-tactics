import { EVENTS } from "@/game/enums/keys/events";
import Unit from "./unit";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { EventEmitter } from "@/game/scripts/events";
import UnitGO from "./unitGO";

export default class CombatController {
    private readonly unit:Unit;

    constructor(unit:Unit){
        this.unit=unit;
    }

    changeHealth(amount:number){
        this.unit.getCurrentStats().hp += amount;
        const gameObject = this.unit.getGameObject() as UnitGO;

        if (amount > 0){
            console.log(`${this.unit.name} heals ${amount} hp!`);
            gameObject.updateHpText();
            gameObject.floatingText.play(`${amount}`,UI_COLORS.heal);
        }
        else {
            console.log(`${this.unit.name} takes ${amount} damage!`);
            gameObject.updateHpText();
            gameObject.floatingText.play(`-${amount}`,UI_COLORS.damage);
        }
        
        
        if (this.unit.getCurrentStats().hp <=0) 
            this.killUnit();
    }

    killUnit(){
        console.log(`${this.unit.id} has been slain...`);
        this.unit.setActive(false);
        this.unit.getGameObject()?.setVisible(false);
        const owner = this.unit.getOwner();
        if(!owner)return;
        owner.units.moveUnitToGraveyard(this.unit);
        EventEmitter.emit(EVENTS.unitEvent.DEATH, this.unit);
    }
}