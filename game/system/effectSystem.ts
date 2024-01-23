import Unit from "../gameobjects/units/unit";
import Field from "../state/field";
import Effect from "@/game/skillEffects/effect";
import GamePlayer from "../gameobjects/player/gamePlayer";

/**
 * Centralized location to handle effects
 */
export default class EffectSystem{
    private readonly field:Field;

    private readonly units: Map<string,Unit>;

    constructor(field:Field,playersInGame:GamePlayer[]){
        this.field=field;
        this.units=field.units;
    }

    /**
     * Applies the provided effects immediately onto a target unit
     * @param effects 
     * @param target 
     */
    cast(effects:Effect[],target:Unit){
        effects.forEach(
            effect=>{
                effect.setTarget(target);
                effect.apply();
                console.log(`Applied ${effect.name} onto ${target.name}`);
            }
        )
    }
}