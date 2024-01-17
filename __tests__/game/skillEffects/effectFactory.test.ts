import { EffectData } from "@/game/data/effectData"
import Effect from "@/game/skillEffects/effect";
import EffectFactory from "@/game/skillEffects/effectFactory"
import HealthChange from "@/game/skillEffects/healthChange";
import StatChange from "@/game/skillEffects/statChange";

it("should create an effect called \"Fireball\" that deals 2 damage, and additionally deals 1 damage at the start of each turn for the next 3 turns",()=>{
    const data:EffectData[] = [
        {
            name: "Fireball",
            description: "Deals 2 damage",
            targetType: "enemy",
            triggers: ["onCast"],				// This happens immediately when the effect is applied
            components:[{
                type: "health-change",
                amount: -2,
                valueType: "value"
            }],
            isRemovable: true
        },
        {
            name: "Burn",
            description: "Deals 1 damage per turn for 3 turns",
            targetType: "enemy",
            duration:3,
            triggers: ["onTurnStart"],				//This happens next turn  and is inserted into target as a debuff 
            components: [{
                type: "health-change",
                amount: -1,
                valueType: "value"
            }],
            isRemovable: true
        }
    ]

    const effects:Effect[] = EffectFactory.createEffect(data);

    expect(effects.length).toBe(2); 

    const instantEffect = effects[0];
    expect(instantEffect.name).toBe("Fireball");
    expect(instantEffect.description).toBe("Deals 2 damage");
    expect(instantEffect.targetType).toBe("enemy");
    expect(instantEffect.duration).toBe(0);
    expect(instantEffect.triggers[0]).toBe("onCast");
    expect(instantEffect.isRemovable).toBe(true);
    expect(instantEffect.getComponents().length).toBe(1);
    expect(instantEffect.getComponents()[0] instanceof HealthChange).toBe(true);

    const instantComponent = instantEffect.getComponents()[0] as HealthChange;
    expect(instantComponent.amount).toBe(-2);
    expect(instantComponent.valueType).toBe("value");

    const dotEffect = effects[1];
    expect(dotEffect.name).toBe("Burn");
    expect(dotEffect.description).toBe("Deals 1 damage per turn for 3 turns");
    expect(dotEffect.targetType).toBe("enemy");
    expect(dotEffect.duration).toBe(3);
    expect(dotEffect.triggers[0]).toBe("onTurnStart");
    expect(dotEffect.isRemovable).toBe(true);
    expect(dotEffect.getComponents().length).toBe(1);
    expect(dotEffect.getComponents()[0] instanceof HealthChange).toBe(true);

    const dotComponent = dotEffect.getComponents()[0] as HealthChange;
    expect(dotComponent.amount).toBe(-1);
    expect(dotComponent.valueType).toBe("value");
});



it("should create an effect called \"Stronghold's Advantage\" that provides buffs that +2 PWR/DEF, recover 2 hp per turn",()=>{
    const data:EffectData[] = [
        {
            name: "Stronghold's Advantage",
            description: "+2 PWR/DEF",
            targetType: "ally",
            duration:-1,
            triggers: ["onCast"],			// Note this is onCast, as Stronghold should cast it immediately when it detects an occupant. 
                                            // If this was onTurnStart, the buff won't be applied until next turn.
            components:[
                {
                    type: "stat-change",
                    amount: 2,
                    valueType: "value",
                    stat: "pwr"
                },
                {
                    type: "stat-change",
                    amount: 2,
                    valueType: "value",
                    stat: "def"
                }
            ],
            isRemovable: false
        },
        {
            name: "Rest",
            description: "Recover 2hp at the start of each turn",
            targetType: "ally",
            duration:-1,
            triggers: ["onTurnStart"],				
            components:	[
                {
                    type: "health-change",
                    amount: 2,
                    valueType: "value",
                }
            ],
            isRemovable: false
        }
    ]

    const effects:Effect[] = EffectFactory.createEffect(data);

    expect(effects.length).toBe(2); 

    const instantEffect = effects[0];
    expect(instantEffect.name).toBe("Stronghold's Advantage");
    expect(instantEffect.description).toBe("+2 PWR/DEF");
    expect(instantEffect.targetType).toBe("ally");
    expect(instantEffect.duration).toBe(-1);
    expect(instantEffect.triggers[0]).toBe("onCast");
    expect(instantEffect.isRemovable).toBe(false);
    expect(instantEffect.getComponents().length).toBe(2);
    expect(instantEffect.getComponents()[0] instanceof StatChange).toBe(true);
    expect(instantEffect.getComponents()[1] instanceof StatChange).toBe(true);

    const pwrComponent = instantEffect.getComponents()[0] as StatChange;
    expect(pwrComponent.amount).toBe(2);
    expect(pwrComponent.valueType).toBe("value");

    const defComponent = instantEffect.getComponents()[1] as StatChange;
    expect(defComponent.amount).toBe(2);
    expect(defComponent.valueType).toBe("value");

    const regenEffect = effects[1];
    expect(regenEffect.name).toBe("Rest");
    expect(regenEffect.description).toBe("Recover 2hp at the start of each turn");
    expect(regenEffect.targetType).toBe("ally");
    expect(regenEffect.duration).toBe(-1);
    expect(regenEffect.triggers[0]).toBe("onTurnStart");
    expect(regenEffect.isRemovable).toBe(false);
    expect(regenEffect.getComponents().length).toBe(1);
    expect(regenEffect.getComponents()[0] instanceof HealthChange).toBe(true);

    const regenComponent = regenEffect.getComponents()[0] as HealthChange;
    expect(regenComponent.amount).toBe(2);
    expect(regenComponent.valueType).toBe("value");
});