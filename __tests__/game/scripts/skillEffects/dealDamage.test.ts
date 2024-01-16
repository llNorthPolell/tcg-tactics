import { ValueType } from "@/game/enums/keys/valueType";
import DealDamage from "@/game/scripts/skillEffects/basic/dealDamage"
import { checkEffectEnded, createTestUnit } from "./common";
import SkillEffect from "@/game/scripts/skillEffects/skillEffect";


it("should deal damage once and is diabled immediately after", ()=>{
    const target = createTestUnit();
    const damageSpell = new DealDamage("Cleave",2);
    damageSpell.setTarget(target);
    const applyDamageFn = jest.spyOn(damageSpell as any,"applyChange");

    for(let i=0 ; i < 5; i++){
        damageSpell.apply();
        if (i===0)
            checkEffectEnded(damageSpell);
    }

    expect(applyDamageFn).toHaveBeenCalledTimes(1);
    expect(target.getUnitData().currHp).toBe(28);
})


it("should deal damage 3 times", ()=>{
    const target = createTestUnit();
    const damageSpell = new DealDamage("Burn",1,ValueType.VALUE,3,true);
    damageSpell.setTarget(target);
    const applyDamageFn = jest.spyOn(damageSpell as any,"applyChange");

    for(let i=0 ; i < 5; i++){
        damageSpell.apply();
        if (i===2)
            checkEffectEnded(damageSpell);
    }

    expect(applyDamageFn).toHaveBeenCalledTimes(3);
    expect(target.getUnitData().currHp).toBe(27);
})


it("should deal damage once after 5 turns", ()=>{
    const target = createTestUnit();
    const damageSpell = new DealDamage("Boomerang",3,ValueType.VALUE,5,false,true);
    damageSpell.setTarget(target);
    const applyDamageFn = jest.spyOn(damageSpell as any,"applyChange");

    for(let i=0 ; i < 5; i++){
        damageSpell.apply();
        expect(target.getUnitData().currHp).toBe(30);
        if (i===4)
            checkEffectEnded(damageSpell);
    }

    expect(applyDamageFn).toHaveBeenCalledTimes(1);
    expect(target.getUnitData().currHp).toBe(27);
})


it("should deal 5% damage to target each turn for 3 turns",()=>{
    const target = createTestUnit();
    const damageSpell = new DealDamage("Deadly Poison",5,ValueType.PERCENTAGE,3,true,false); 
    damageSpell.setTarget(target);
    const applyDamageFn = jest.spyOn(damageSpell as any,"applyChange");

    for (let i=0; i<5;i++){
        damageSpell.apply();
        if(i===4)
            checkEffectEnded(damageSpell);
    }
    expect(applyDamageFn).toHaveBeenCalledTimes(3);
    expect(target.getUnitData().currHp).toBe(24);
})


it("should clone",()=>{
    const damageSpell = new DealDamage("Deadly Poison",5,ValueType.PERCENTAGE,3,true,false); 
    const damageSpellClone :SkillEffect= damageSpell.clone();

    expect(damageSpell).not.toBe(damageSpellClone);

    expect(damageSpell.amount).toBe((damageSpellClone as DealDamage).amount);
    expect(damageSpell.duration).toBe(damageSpellClone.duration);
})

