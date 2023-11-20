import { ValueType } from "@/game/enums/valueType";
import DealDamage from "@/game/scripts/skillEffects/dealDamage"
import { checkEffectEnded, createTestUnit } from "./common";


it("should deal damage once and is diabled immediately after", ()=>{
    const target = createTestUnit();
    const damageSpell = new DealDamage(100);
    damageSpell.target=target;
    const applyDamageFn = jest.spyOn(damageSpell as any,"applyDamage");

    for(let i=0 ; i < 5; i++){
        damageSpell.apply();
        if (i===0)
            checkEffectEnded(damageSpell);
    }

    expect(applyDamageFn).toHaveBeenCalledTimes(1);
    expect(target.currHp).toBe(900);
})


it("should deal damage 3 times", ()=>{
    const target = createTestUnit();
    const damageSpell = new DealDamage(100,ValueType.VALUE,3,true);
    damageSpell.target=target;
    const applyDamageFn = jest.spyOn(damageSpell as any,"applyDamage");

    for(let i=0 ; i < 5; i++){
        damageSpell.apply();
        if (i===2)
            checkEffectEnded(damageSpell);
    }

    expect(applyDamageFn).toHaveBeenCalledTimes(3);
    expect(target.currHp).toBe(700);
})


it("should deal damage once after 5 turns", ()=>{
    const target = createTestUnit();
    const damageSpell = new DealDamage(100,ValueType.VALUE,5,false,true);
    damageSpell.target=target;
    const applyDamageFn = jest.spyOn(damageSpell as any,"applyDamage");

    for(let i=0 ; i < 5; i++){
        damageSpell.apply();
        if (i===4)
            checkEffectEnded(damageSpell);
    }

    expect(applyDamageFn).toHaveBeenCalledTimes(1);
    expect(target.currHp).toBe(900);
})


it("should deal 5% damage to target each turn for 3 turns",()=>{
    const target = createTestUnit();
    const damageSpell = new DealDamage(5,ValueType.PERCENTAGE,3,true,false); 
    damageSpell.target=target;
    const applyDamageFn = jest.spyOn(damageSpell as any,"applyDamage");

    for (let i=0; i<5;i++){
        damageSpell.apply();
        if(i===4)
            checkEffectEnded(damageSpell);
    }
    expect(applyDamageFn).toHaveBeenCalledTimes(3);
    expect(target.currHp).toBe(858);
})

