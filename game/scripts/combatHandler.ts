import { Position } from "../data/types/position";
import { EVENTS } from "../enums/keys/events";
import { UNIT_CLASS } from "../enums/keys/unitClass";
import GamePlayer from "../gameobjects/player/gamePlayer";
import Unit from "../gameobjects/units/unit";
import { EventEmitter } from "./events";
import DealDamage from "./skillEffects/basic/dealDamage";
import Heal from "./skillEffects/basic/heal";
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
            (caster:GamePlayer,skillEffects:SkillEffect[], target?: Unit | Position)=>{
                skillEffects.forEach(skillEffect=>{
                    skillEffect.setCaster(caster);
                    if (!target)
                        console.log(`Apply ${skillEffect} without a target...`)
                    else if (target instanceof Unit){
                        console.log(`Apply ${skillEffect.name} onto ${target.name}..`);
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
                    else {
                        console.log(`Apply ${skillEffect.name} onto (${target.x},${target.y})..`);
                        if (!skillEffect.duration){
                            skillEffect.setTarget(target);
                            skillEffect.apply();
                            return;
                        }
                    }

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
        attacker.combat.changeHealth(attackerDmgTaken);
    }


    calcDamage(attacker:Unit, defender:Unit):number{
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
