import UnitController from "../controllers/unitController";
import { UNIT_CLASS } from "../enums/keys/unitClass";
import Unit from "../gameobjects/units/unit";
import { inRange } from "../scripts/util";
import EffectSystem from "./effectSystem";

export default class CombatSystem{
    constructor(
        private readonly units: UnitController,
        private readonly effects: EffectSystem
    ){}

    initiateFight(attacker:Unit, defender:Unit){
        this.attack(attacker,defender);
        this.attemptRetalliation(attacker,defender);
    }

    attack(attacker:Unit, defender:Unit){
        const defenderDmgTaken = this.calcDamage(attacker, defender);
        console.log(`${attacker.name} attacks ${defender.name}`);
        defender.combat.changeHealth(-defenderDmgTaken);
    }
    
    attemptRetalliation(attacker:Unit, defender:Unit){
        if (!inRange(defender.position()!.get()!,attacker.position()!.get()!,defender.getCurrentStats().rng)) return;
        this.attack(defender,attacker);
        console.log(`${defender.name} retaliates!`);
    }

    private calcDamage(attacker:Unit, defender:Unit):number{
        const attackerStats = attacker.getCurrentStats();
        const defenderStats = defender.getCurrentStats();
    
        let damage = attackerStats.pwr - defenderStats.def;

        switch (attacker.unitClass){
            case UNIT_CLASS.ASSASSIN:
                if (defenderStats.hp < defender.base.hp * 0.5)
                    damage = Math.ceil(damage * 1.2);
                break;
            case UNIT_CLASS.BERSERKER:
                if (attackerStats.hp < attacker.base.hp * 0.5)
                    damage = Math.ceil(damage * 1.2);
                break;
            default:
                break;
        }


        switch (defender.unitClass){
            case UNIT_CLASS.GUARDIAN:
                damage = Math.floor(damage * 0.8);
                break;
        }

        if (damage < 1) damage = 1;
        return damage;
    }

}