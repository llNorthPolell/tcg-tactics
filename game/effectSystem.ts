import { Position } from "@/game/data/types/position";
import Unit from "./gameobjects/units/unit";
import Field from "./state/field";
import Effect from "@/game/skillEffects/effect";
import { EffectTrigger } from "@/game/enums/keys/effectTriggers";
import GamePlayer from "./gameobjects/player/gamePlayer";
import Landmark from "./gameobjects/landmarks/landmark";

/**
 * Centralized location to handle effects
 */
export default class EffectSystem{
    readonly field:Field;

    private onTurnStartLists: Map<number,Effect[]>;
    private onTurnEndLists:Map<number,Effect[]>;

    constructor(field:Field){
        this.field=field;

        this.onTurnStartLists=new Map();
        this.onTurnEndLists=new Map();
    }

    /**
     * Applies the effects and stores them in the appropriate runtime lists.
     * @param effects Effects to cast, onto the target if specified
     * @param source Source of the effects. If effect is from a spell card, source is GamePlayer.
     * @param target Target unit or location to apply these effects on.
     */
    castEffects(effects:Effect[],source: GamePlayer|Unit|Landmark, target?:Unit|Position){
        const sourcePlayer = this.getSourcePlayer(source);
        effects.forEach(
            effect=>{
                switch(effect.trigger){
                    case EffectTrigger.onTurnStart:
                        if (!sourcePlayer)
                            throw new Error (`Cannot apply ${effect.name} as source player cannot be determined`);

                        this.addToTurnBasedMap(this.onTurnStartLists, sourcePlayer, effect, target);                 
                        break;
                    case EffectTrigger.onTurnEnd:
                        if (!sourcePlayer)
                            throw new Error (`Cannot apply ${effect.name} as source player cannot be determined`);
    
                        this.addToTurnBasedMap(this.onTurnEndLists, sourcePlayer, effect, target);                 
                        break;

                    default:
                        break;
                }
            }
        )
    }

    private getSourcePlayer(source:GamePlayer|Unit|Landmark){
        if (source instanceof GamePlayer) return source;
        if (source instanceof Unit) return source.getOwner();
        if (source instanceof Landmark) return source.capturable?.getOwner();
        return undefined;
    }
    
    private addToTurnBasedMap(map:Map<number,Effect[]>, sourcePlayer:GamePlayer, effect:Effect, target?:Unit|Position){
        if(!target)
            throw new Error(`Cannot cast ${effect.name} effect without a target...`);

        effect.setTarget(target);

        if (target instanceof Unit){
            const unitOwner = target.getOwner();
            if (!unitOwner)
                throw new Error (`Cannot apply ${effect.name} on ${target.name} as unit does not have an owner`);

            map.get(unitOwner.id)?.push(effect);
        }
        else 
            map.get(sourcePlayer.id)?.push(effect);
               
    }


    onRemove(){

    }


    // Turn-Based
    onTurnStart(player:GamePlayer){
        const onTurnStartList = this.onTurnStartLists.get(player.id);
        if (!onTurnStartList)
            throw new Error (`Failed to locate effects to run at the start of ${player.name}'s turn...`);
        
        onTurnStartList.forEach(
            effect=>{
                effect.apply();
            }
        );
    }

    onTurnEnd(player:GamePlayer){
        const onTurnEndList = this.onTurnStartLists.get(player.id);
        if (!onTurnEndList)
            throw new Error (`Failed to locate effects to run at the end of ${player.name}'s turn...`);
        
        onTurnEndList.forEach(
            effect=>{
                effect.apply();
            }
        );
    }


    // Combat-Based
    onAttack(attacker:Unit,defender:Unit){

    }

    onReceiveHit(attacker:Unit, defender:Unit){

    }

    onKill(attacker:Unit, defender:Unit){

    }

    onDeath(attacker:Unit,defender:Unit){

    }


}