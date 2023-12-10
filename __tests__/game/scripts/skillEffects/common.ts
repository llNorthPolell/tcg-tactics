import UnitCardData from "@/game/data/cards/unitCardData";
import UnitStats from "@/game/data/unitData";
import SkillEffect from "@/game/scripts/skillEffects/skillEffect";

export const createTestUnit : ()=>UnitStats = () =>{
    const card = new UnitCardData("test","test char","soldier",1000,1000,1000,1000,3,1,1);
    return new UnitStats(card);
}

export const checkEffectEnded = (effect :SkillEffect)=>{
    expect(effect.isActive()).toBe(false);
    expect(effect.getCurrTime()).toBe(effect.duration);
}
