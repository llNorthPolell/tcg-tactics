import HeroCard from "@/game/data/heroCard";
import UnitStats from "@/game/data/unitStats";
import SkillEffect from "@/game/scripts/skillEffects/skillEffect";

export const createTestUnit : ()=>UnitStats = () =>{
    const card = new HeroCard("test","test char","soldier",1000,1000,1000,1000,3,"none","none","none",[]);
    return new UnitStats(card);
}

export const checkEffectEnded = (effect :SkillEffect)=>{
    expect(effect.isActive()).toBe(false);
    expect(effect.getCurrTime()).toBe(effect.duration);
}
