import { Position } from "../data/types/position";
import { EVENTS } from "../enums/keys/events";
import { UNIT_CLASS } from "../enums/keys/unitClass";
import Unit from "../gameobjects/unit";
import { EventEmitter } from "./events";
import DealDamage from "./skillEffects/dealDamage";
import Heal from "./skillEffects/heal";
import SkillEffect from "./skillEffects/skillEffect";
import { inRange } from "./util";

export default class CombatHandler{
    constructor(){

        EventEmitter.on(
            EVENTS.unitEvent.ATTACK,
            (attacker:Unit, defender:Unit)=>{
                if (attacker?.isActive()){
                    EventEmitter.emit(EVENTS.unitEvent.WAIT);
                    this.initiateFight(attacker,defender);
                }
            }
        )
        .on(
            EVENTS.fieldEvent.CAST_SPELL,
            (skillEffects:SkillEffect[], target?: Unit | Position)=>{
                skillEffects.forEach(skillEffect=>{
                    if (!target)
                        console.log(`Apply ${skillEffect} without a target...`)
                    else if (target instanceof Unit){
                        console.log(`Apply ${skillEffect.name} onto ${target.getUnitData().name}..`);
                        if (!skillEffect.duration){
                            skillEffect.setTarget(target);
                            skillEffect.apply();
                            return;
                        }
                        if (skillEffect instanceof Heal)
                            target.insertBuff(skillEffect);
                        else if (skillEffect instanceof DealDamage)
                            target.insertDebuff(skillEffect);
                    }
                    else 
                        console.log(`Apply ${skillEffect} to (${target.x},${target.y})...`)

                })
            }
        )

    }
    
    initiateFight(attacker:Unit,defender:Unit):void{    
        const defenderDmgTaken = this.calcDamage(attacker, defender);
        console.log(`${attacker?.getUnitData().name} attacks ${defender.getUnitData().name}`);
        defender.takeDamage(defenderDmgTaken);


        if ((attacker.getDestination() && 
            !inRange(defender.getLocation(),attacker.getDestination()!,defender.getUnitData().currRng)) ||
            !inRange(defender.getLocation(),attacker.getLocation()!,defender.getUnitData().currRng)) 
            return;

        const attackerDmgTaken = this.calcDamage(defender, attacker);
        console.log(`${defender?.getUnitData().name} retaliates!`);
        attacker.takeDamage(attackerDmgTaken);
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
                damage = Math.floor(damage * 0.8);
                break;
        }

        if (damage < 1) damage = 1;
        return damage;
    }

}
