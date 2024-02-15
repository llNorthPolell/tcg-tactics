import Unit from "../gameobjects/units/unit";
import Field from "../state/field";
import Effect from "@/game/skillEffects/effect";
import GamePlayer from "../gameobjects/player/gamePlayer";
import { EffectTrigger } from "../enums/keys/effectTriggers";
import { Position } from "../data/types/position";
import { getUnitsInRange } from "../scripts/util";
import { TARGET_TYPES } from "../enums/keys/targetTypes";

/**
 * Centralized location to handle effects
 */
export default class EffectSystem {
    private passives: Map<number, Effect[]>;

    constructor(private readonly field: Field, playersInGame: GamePlayer[]) {
        this.passives = new Map();

        playersInGame.forEach(
            player => {
                this.passives.set(player.id, []);
            }
        )
    }


    cast(sourcePlayer:GamePlayer, effects: Effect[], target: Unit | Position){
        effects.forEach(
            effect=>{
                if (effect.targetType!==TARGET_TYPES.position && !(target instanceof Unit))
                    throw new Error("Attempted to cast an effect meant for units on a location...")


                else if (effect.targetType === TARGET_TYPES.position){
                    if (target instanceof Unit)
                        this.castPosition(sourcePlayer, effect, target.position()!.get());
                    else
                        this.castPosition(sourcePlayer, effect, target as Position);
                }

                else
                    this.castSingleUnit(sourcePlayer,effect,target as Unit);
            }
        )
    }

    /**
     * Applies the provided effect onto a target unit. If the effect trigger is "onCast", will be applied immediately.
     * Otherwise, the effect will be stored in the appropriate list to be applied when the trigger is met.
     * @param effect
     * @param target 
     */
    castSingleUnit(sourcePlayer: GamePlayer, effect: Effect, target: Unit) {
        console.log(`In castSingleUnit with ${effect.name}, ${target.name}. Target.EffectHandler: ${target.effectHandler}`);
        if (effect.targetType === TARGET_TYPES.ally && target.getOwner()?.getTeam() !== sourcePlayer.getTeam())
            return;
        if (effect.targetType === TARGET_TYPES.enemy && target.getOwner()?.getTeam() === sourcePlayer.getTeam())
            return;


        const targetUnit = target as Unit;
        switch (effect.trigger) {
            case EffectTrigger.onTurnStart:
                targetUnit.effectHandler.insertToTriggerList(EffectTrigger.onTurnStart, effect);
                break;
            case EffectTrigger.passive:
                targetUnit.effectHandler.insertToTriggerList(EffectTrigger.passive, effect);
                break;
            default:
                targetUnit.effectHandler.applyInstant(effect);
                console.log(`Cast ${effect.name} successfully on ${target.name}`)
                break;
        }
    }

    /**
     * Applies the provided effect onto a target position
     */
    castPosition(sourcePlayer: GamePlayer, effect:Effect, target: Position) {
        console.log(`In castPosition with ${effect.name}, (${target.x},${target.y}).`)
        const unitsAffected = getUnitsInRange(this.field, target,effect.range);
        console.log(unitsAffected);
        unitsAffected.forEach(
            unit => {
                const subEffects = effect.createSubEffect();
                this.cast(sourcePlayer,subEffects,unit);
            }
        )
    }

    /**
     * Forcefully ends an effect
     */
    forceRemove(effect: Effect) {
        effect.forceRemove();
    }
}