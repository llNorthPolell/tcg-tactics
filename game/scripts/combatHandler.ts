import { Position } from "../data/types/position";
import { EVENTS } from "../enums/keys/events";
import { UNIT_CLASS } from "../enums/keys/unitClass";
import Unit from "../gameobjects/unit";
import { EventEmitter } from "./events";
import SkillEffect from "./skillEffects/skillEffect";
import { inRange } from "./util";

export default class CombatHandler{
    constructor(){

        EventEmitter.on(
            EVENTS.unitEvent.ATTACK,
            (attacker:Unit, defender:Unit)=>{
                if (attacker?.isActive()){
                    this.initiateFight(attacker,defender);
                    EventEmitter.emit(EVENTS.unitEvent.WAIT);
                }
            }
        )
        .on(
            EVENTS.fieldEvent.CAST_SPELL,
            (skillEffects:SkillEffect[], target?: Unit | Position)=>{
                skillEffects.forEach(skillEffect=>{
                    if (!target)
                        console.log(`Apply ${skillEffect} without a target...`)
                    else if (target instanceof Unit)
                        console.log(`Apply ${skillEffect.name} onto ${target.getUnitData().name}..`);
                    else 
                        console.log(`Apply ${skillEffect} to (${target.x},${target.y})...`)

                })
            }
        )

    }
    
    initiateFight(attacker:Unit,defender:Unit):void{
        const attackerStats = attacker.getUnitData();
        const defenderStats = defender.getUnitData();
    
        const defenderDmgTaken = this.calcDamage(attacker, defender);
        defenderStats.currHp -= defenderDmgTaken;
        console.log(`${attacker?.getUnitData().name} attacks ${defender.getUnitData().name}`);
        console.log(`${defender?.getUnitData().name} takes ${defenderDmgTaken} damage!`);

        if (defenderStats.currHp <=0) 
            defender.killUnit();

        if ((attacker.getTargetLocation() && 
            !inRange(defender.getLocation(),attacker.getTargetLocation()!,defender.getUnitData().currRng)) ||
            !inRange(defender.getLocation(),attacker.getLocation()!,defender.getUnitData().currRng)) 
            return;

        const attackerDmgTaken = this.calcDamage(defender, attacker);
        attackerStats.currHp -= attackerDmgTaken;
        console.log(`${defender?.getUnitData().name} retaliates and ${attacker?.getUnitData().name} takes ${attackerDmgTaken} damage!`);

        if (attackerStats.currHp <=0) 
            attacker.killUnit();
    }


    calcDamage(attacker:Unit, defender:Unit):number{
        const attackerStats = attacker.getUnitData();
        const defenderStats = defender.getUnitData();
    
        let damage = attackerStats.currPwr;

        switch (attackerStats.unitClass){
            case UNIT_CLASS.ASSASSIN:
                if (defenderStats.currHp < defenderStats.maxHP * 0.5)
                    damage = Math.ceil(damage * 1.2);
                break;
            case UNIT_CLASS.BERSERKER:
                if (attackerStats.currHp < attackerStats.maxHP * 0.5)
                    damage = Math.ceil(damage * 1.2);
                break;
            default:
                break;
        }


        switch (defenderStats.unitClass){
            case UNIT_CLASS.GUARDIAN:
                damage = Math.ceil(damage * 0.8);
                break;
        }

        return damage;
    }

}
