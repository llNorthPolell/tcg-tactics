import { EffectData } from "../data/effectData";
import { EffectDataComponent } from "../data/effectDataComponent";
import { SPELL_EFFECT_TYPE } from "../enums/keys/spellEffectType";
import Effect from "./effect";
import EffectComponent from "./effectComponent";
import HealthChange from "./healthChange";
import StatChange from "./statChange";

export default class EffectFactory{
    static createEffect(effectData:EffectData[]):Effect[]{
        let effects:Effect[]=[];
        effectData.forEach(
            data=>{ 
                const components = this.createEffectComponents(data.components);

                const newEffect = new Effect(
                    data.name,
                    data.description,
                    data.targetType,
                    data.duration,
                    data.range,
                    data.triggers,
                    data.isRemovable);

                newEffect.addComponents(components);

                effects = [...effects,newEffect];
            }
        );

        return effects;
    }


    private static createEffectComponents(components:EffectDataComponent[]):EffectComponent[]{
        let effectComponents :EffectComponent[]=[];
        components.forEach(
            component=>{
                const stat = component.stat;
                const amount = component.amount;
                const valueType = component.valueType;
                let newComponent:EffectComponent|undefined;
                switch(component.type){
                    case SPELL_EFFECT_TYPE.healthChange:
                        if (!amount) return;
                        newComponent = new HealthChange(amount,valueType);
                        break;
                    case SPELL_EFFECT_TYPE.statChange:
                        if(!stat || !amount)return;
                        newComponent = new StatChange(stat,amount,valueType);
                        break;
                    default:
                        break;
                }
                if(newComponent)
                    effectComponents=[...effectComponents,newComponent];
            }
        )
        return effectComponents;
    }
}