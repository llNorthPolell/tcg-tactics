import Effect from "@/game/skillEffects/effect";
import Unit from "./unit";

export default class EffectHandler{
    /**
     * Reference to parent
     */
    private readonly unit:Unit;

    constructor(unit:Unit){
        this.unit=unit;
    }

    apply(effect:Effect){
        effect.setTarget(this.unit);
        effect.apply();
    };
}