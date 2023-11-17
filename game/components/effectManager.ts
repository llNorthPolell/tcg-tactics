import SkillEffect from "../scripts/skillEffects/skillEffect";

export default class EffectManager{

    private effects: SkillEffect[] = [];


    constructor(){
    }


    addEffect(newEffect: SkillEffect){
        this.effects = [...this.effects, newEffect];
    }

    applyEffects(){
        let newEffectsList:SkillEffect[] = [];
        this.effects.forEach(effect=>{
            effect.apply()
            if (effect.isActive())
                newEffectsList = [...newEffectsList,effect];
        });
    }
}