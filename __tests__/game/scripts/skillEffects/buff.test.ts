import Buff from "@/game/scripts/skillEffects/buff";
import { checkEffectEnded, createTestUnit } from "./common";
import { ValueType } from "@/game/enums/valueType";
import { UnitStatField } from "@/game/enums/unitStatField";


it("should lower target's max HP once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const maxHPUpSpell = new Buff("Max HP Up",20,ValueType.PERCENTAGE, UnitStatField.HP,3);
    maxHPUpSpell.target=target;
    const applyBuffFn = jest.spyOn(maxHPUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        maxHPUpSpell.apply();

        if (i<3){
            expect(target.maxHP).toBe(1200);
        }
        else if (i===3)
            checkEffectEnded(maxHPUpSpell);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.maxHP).toBe(1000);
})


it("should lower target's max SP once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const maxSPUpSpell = new Buff("Max SP Up",50,ValueType.PERCENTAGE, UnitStatField.SP,3);
    maxSPUpSpell.target=target;
    const applyBuffFn = jest.spyOn(maxSPUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        maxSPUpSpell.apply();

        if (i<3){
            expect(target.maxSP).toBe(1500);
        }
        else if (i===3)
            checkEffectEnded(maxSPUpSpell);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.maxSP).toBe(1000);
})


it("should lower target's power once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const pwrUpSpell = new Buff("PWR Up",10,ValueType.VALUE, UnitStatField.PWR,3);
    pwrUpSpell.target=target;
    const applyBuffFn = jest.spyOn(pwrUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        pwrUpSpell.apply();

        if (i<3){
            expect(target.currPwr).toBe(1010);
        }
        else if (i===3)
            checkEffectEnded(pwrUpSpell);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.currPwr).toBe(1000);
})



it("should lower target's defence once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const defUpSpell = new Buff("DEF Up",10,ValueType.VALUE, UnitStatField.DEF,3);
    defUpSpell.target=target;
    const applyBuffFn = jest.spyOn(defUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        defUpSpell.apply();

        if (i<3){
            expect(target.currDef).toBe(1010);
        }
        else if (i===3)
            checkEffectEnded(defUpSpell);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.currDef).toBe(1000);
})

it("should lower target's movement range once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const mvtUpSpell = new Buff("Scope",1,ValueType.VALUE, UnitStatField.MVT,3);
    mvtUpSpell.target=target;
    const applyBuffFn = jest.spyOn(mvtUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        mvtUpSpell.apply();

        if (i<3){
            expect(target.currMvt).toBe(4);
        }
        else if (i===3)
            checkEffectEnded(mvtUpSpell);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.currMvt).toBe(3);
})


it("should raise target's power permanently (in this case just 10 turns)", ()=>{
    const target = createTestUnit();
    const pwrUpSpell = new Buff("Blessing of Might",10,ValueType.PERCENTAGE, UnitStatField.PWR,-1);
    pwrUpSpell.target=target;
    const applyBuffFn = jest.spyOn(pwrUpSpell as any,"applyStatChange");

    for(let i=0 ; i < 10; i++){
        pwrUpSpell.apply();


        expect(target.currPwr).toBe(1100);
        expect(pwrUpSpell.isActive()).toBe(true);
        expect(pwrUpSpell.getCurrTime()).toBe(0);
    }

    expect(applyBuffFn).toHaveBeenCalledTimes(1);
    expect(target.currPwr).toBe(1100);
})
