import { EffectData } from "../data/types/effectData";
import { EffectDataComponent } from "../data/types/effectDataComponent";
import { TargetFilterData } from "../data/types/targetFilterData";
import { SPELL_EFFECT_TYPE } from "../enums/keys/spellEffectType";
import Effect from "./effect";
import EffectComponent from "./effectComponent";
import IsClass from "./filters/isClass";
import StatIs from "./filters/statIs";
import TargetFilter from "./filters/targetFilter";
import HealthChange from "./healthChange";
import StatChange from "./statChange";

export default class EffectFactory{
    static createEffects(effectData:EffectData[]):Effect[]{
        let effects:Effect[]=[];
        effectData.forEach(
            data=>{ 
                const components = this.createEffectComponents(data.components);
                const targetFilters = this.createFilters(data.targetFilters)
                const newEffect = new Effect(data,targetFilters,components);

                effects.push(newEffect);
            }
        );

        return effects;
    }


    private static createEffectComponents(components?:EffectDataComponent[]):EffectComponent[]{
        if (!components) return [];
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
                    effectComponents.push(newComponent);
            }
        )
        return effectComponents;
    }


    private static createFilters(filterDataList?:TargetFilterData[]): TargetFilter[]{
        if (!filterDataList) return [];
        let filters : TargetFilter[] = [];
        filterDataList.forEach(
            (filterData:TargetFilterData)=>{
                switch(filterData.type){
                    case "isClass":
                        filters.push(new IsClass(filterData.class!));
                        break;
                    case "statIs":
                        filters.push(new StatIs(filterData.stat!, filterData.compareOp!, filterData.amount!));
                    default:
                        break;
                }
            }
        )

        return filters;
    }
}