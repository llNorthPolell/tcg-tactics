import Buff from "@/game/scripts/skillEffects/basic/buff";
import { checkEffectEnded, createTestUnit } from "./common";
import { ValueType } from "@/game/enums/keys/valueType";
import { UnitStatField } from "@/game/enums/keys/unitStatField";


it("should lower target's max HP once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const maxHPUpSpell = new Buff("Max HP Up",20,ValueType.PERCENTAGE, UnitStatField.HP,3);
    maxHPUpSpell.setTarget(target);
    const applyBuffFn = jest.spyOn(maxHPUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        maxHPUpSpell.apply();

        if (i<3){
            expect(target.getUnitData().maxHP).toBe(36);
        }
        else if (i===3)
            checkEffectEnded(maxHPUpSpell);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.getUnitData().maxHP).toBe(30);
})


it("should lower target's max SP once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const maxSPUpSpell = new Buff("Max SP Up",50,ValueType.PERCENTAGE, UnitStatField.SP,3);
    maxSPUpSpell.setTarget(target);
    const applyBuffFn = jest.spyOn(maxSPUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        maxSPUpSpell.apply();

        if (i<3){
            expect(target.getUnitData().maxSP).toBe(15);
        }
        else if (i===3)
            checkEffectEnded(maxSPUpSpell);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.getUnitData().maxSP).toBe(10);
})


it("should lower target's power once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const pwrUpSpell = new Buff("PWR Up",1,ValueType.VALUE, UnitStatField.PWR,3);
    pwrUpSpell.setTarget(target);
    const applyBuffFn = jest.spyOn(pwrUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        pwrUpSpell.apply();

        if (i<3){
            expect(target.getUnitData().currPwr).toBe(6);
        }
        else if (i===3)
            checkEffectEnded(pwrUpSpell);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.getUnitData().currPwr).toBe(5);
})


it("should lower target's movement range once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const mvtUpSpell = new Buff("Boots",1,ValueType.VALUE, UnitStatField.MVT,3);
    mvtUpSpell.setTarget(target);
    const applyBuffFn = jest.spyOn(mvtUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        mvtUpSpell.apply();

        if (i<3){
            expect(target.getUnitData().currMvt).toBe(4);
        }
        else if (i===3)
            checkEffectEnded(mvtUpSpell);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.getUnitData().currMvt).toBe(3);
})


it("should raise target's power permanently (in this case just 1 turns)", ()=>{
    const target = createTestUnit();
    const pwrUpSpell = new Buff("Blessing of Might",1,ValueType.PERCENTAGE, UnitStatField.PWR,-1);
    pwrUpSpell.setTarget(target);
    const applyBuffFn = jest.spyOn(pwrUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 10; i++){
        pwrUpSpell.apply();


        expect(target.getUnitData().currPwr).toBe(6);
        expect(pwrUpSpell.isActive()).toBe(true);
        expect(pwrUpSpell.getCurrTime()).toBe(0);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.getUnitData().currPwr).toBe(6);
})
