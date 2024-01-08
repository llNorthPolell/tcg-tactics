import Debuff from "@/game/scripts/skillEffects/debuff";
import { checkEffectEnded, createTestUnit } from "./common";
import { ValueType } from "@/game/enums/keys/valueType";
import { UnitStatField } from "@/game/enums/keys/unitStatField";


it("should lower target's max HP once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const maxHPDownSpell = new Debuff("Max HP Down",20,ValueType.PERCENTAGE, UnitStatField.HP,3);
    maxHPDownSpell.setTarget(target);
    const applyDebuffFn = jest.spyOn(maxHPDownSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        maxHPDownSpell.apply();

        if (i<3){
            expect(target.maxHP).toBe(800);
        }
        else if (i===3)
            checkEffectEnded(maxHPDownSpell);
    }

    expect(applyDebuffFn).toHaveBeenCalledTimes(1);
    expect(target.maxHP).toBe(1000);
})


it("should lower target's max SP once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const maxSPDownSpell = new Debuff("SP Down",50,ValueType.PERCENTAGE, UnitStatField.SP,3);
    maxSPDownSpell.setTarget(target);
    const applyDebuffFn = jest.spyOn(maxSPDownSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        maxSPDownSpell.apply();

        if (i<3){
            expect(target.maxSP).toBe(500);
        }
        else if (i===3)
            checkEffectEnded(maxSPDownSpell);
    }

    expect(applyDebuffFn).toHaveBeenCalledTimes(1);
    expect(target.maxSP).toBe(1000);
})


it("should lower target's power once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const pwrDownSpell = new Debuff("PWR Down",10,ValueType.VALUE, UnitStatField.PWR,3);
    pwrDownSpell.setTarget(target);
    const applyDebuffFn = jest.spyOn(pwrDownSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        pwrDownSpell.apply();

        if (i<3){
            expect(target.currPwr).toBe(990);
        }
        else if (i===3)
            checkEffectEnded(pwrDownSpell);
    }

    expect(applyDebuffFn).toHaveBeenCalledTimes(1);
    expect(target.currPwr).toBe(1000);
})



it("should lower target's defence once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const defDownSpell = new Debuff("DEF Down",10,ValueType.VALUE, UnitStatField.DEF,3);
    defDownSpell.setTarget(target);
    const applyDebuffFn = jest.spyOn(defDownSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        defDownSpell.apply();

        if (i<3){
            expect(target.currDef).toBe(990);
        }
        else if (i===3)
            checkEffectEnded(defDownSpell);
    }

    expect(applyDebuffFn).toHaveBeenCalledTimes(1);
    expect(target.currDef).toBe(1000);
})

it("should lower target's movement range once for 3 turns, then be disabled immediately after", ()=>{
    const target = createTestUnit();
    const mvtDownSpell = new Debuff("Blind",1,ValueType.VALUE, UnitStatField.MVT,3);
    mvtDownSpell.setTarget(target);
    const applyDebuffFn = jest.spyOn(mvtDownSpell as any,"applyStatChange");

    for(let i=0 ; i < 5; i++){
        mvtDownSpell.apply();

        if (i<3){
            expect(target.currMvt).toBe(2);
        }
        else if (i===3)
            checkEffectEnded(mvtDownSpell);
    }

    expect(applyDebuffFn).toHaveBeenCalledTimes(1);
    expect(target.currMvt).toBe(3);
})


it("should lower target's power permanently (in this case just 10 turns)", ()=>{
    const target = createTestUnit();
    const pwrDownSpell = new Debuff("Curse of Weakness",10,ValueType.PERCENTAGE, UnitStatField.PWR,-1);
    pwrDownSpell.setTarget(target);
    const applyDebuffFn = jest.spyOn(pwrDownSpell as any,"applyStatChange");

    for(let i=0 ; i < 10; i++){
        pwrDownSpell.apply();


        expect(target.currPwr).toBe(900);
        expect(pwrDownSpell.isActive()).toBe(true);
        expect(pwrDownSpell.getCurrTime()).toBe(0);
    }

    expect(applyDebuffFn).toHaveBeenCalledTimes(1);
    expect(target.currPwr).toBe(900);
})
