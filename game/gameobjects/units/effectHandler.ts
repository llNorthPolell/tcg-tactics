import Effect from "@/game/skillEffects/effect";
import Unit from "./unit";
import { EffectTrigger } from "@/game/enums/keys/effectTriggers";

export default class EffectHandler{
    private effects: Map<string,Effect[]>;

    constructor(    
        /**
        * Reference to parent
        */
        private readonly unit:Unit
    ){
        this.effects= new Map();

        this.effects.set(EffectTrigger.onTurnStart,[]);
        this.effects.set(EffectTrigger.onTurnEnd,[]);
    }

    applyInstant(effect:Effect){
        effect.setTarget(this.unit);
        effect.apply();
    };

    insertToTriggerList(trigger:string,effect:Effect){
        const list = this.getList(trigger);
        effect.setTarget(this.unit);
        list.push(effect);
    }

    applyOnTrigger(trigger:string){
        const toRemove :number[] = [];
        const list = this.getList(trigger);
        list.forEach(
            (effect:Effect,index:number)=>{
                if (effect.isActive()){
                    console.log(`Apply ${effect.name} onto ${this.unit.name}!`)
                    effect.apply();
                }
                else
                    toRemove.push(index);
            }
        );

        this.clearInactive(trigger,toRemove)
    }

    getList(trigger:string){
        const list = this.effects.get(trigger);
        if (!list)
            throw new Error(`No such effect trigger named ${trigger}...`);
        return list;
    }

    private clearInactive(effectList:string,inactiveIndices:number[]){
        inactiveIndices.forEach(
            (effectIndex:number)=>{
                this.effects.get(effectList)!.splice(effectIndex,1);
            }
        )
    }
    
}