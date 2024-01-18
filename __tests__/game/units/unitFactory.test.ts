import { CardData } from "@/game/data/types/cardData"
import Player from "@/game/data/playerData"
import { UnitData } from "@/game/data/types/unitData"
import CardFactory from "@/game/gameobjects/cards/cardFactory"
import Unit from "@/game/gameobjects/units/unit"

it("should create a basic unit with no effects with the card provided",()=>{
    const testPlayer = new Player("1","testPlayer");
    const unitData: UnitData = {
        name: "test_soldier",
        unitType: "unit",
        unitClass: "soldier",
        stats: {
            hp: 10,
            sp: 0,
            pwr: 1,
            def: 0,
            mvt: 1,
            rng: 1
        }
    }
    const cardData : CardData= {
        id: "1",
        name: "test_soldier",
        cardType: "unit",
        cost: 1,
        contents: unitData,
        owner: testPlayer
    }
    const card = CardFactory.createCard(cardData)

    const contents = card.getContents();

    expect(contents instanceof Unit).toBe(true);

    const unit = contents as Unit;
    expect(unit.cardId).toBe(cardData.id);
    expect(unit.name).toBe(unitData.name);
    expect(unit.unitType).toBe(unitData.unitType);
    expect(unit.unitClass).toBe(unitData.unitClass);
    expect(unit.base.hp).toBe(unitData.stats.hp);
    expect(unit.base.sp).toBe(unitData.stats.sp);
    expect(unit.base.pwr).toBe(unitData.stats.pwr);
    expect(unit.base.def).toBe(unitData.stats.def);
    expect(unit.base.rng).toBe(unitData.stats.rng);
    expect(unit.base.mvt).toBe(unitData.stats.mvt);

    const currentStats = unit.getCurrentStats();
    expect(currentStats.hp).toBe(unitData.stats.hp);
    expect(currentStats.sp).toBe(unitData.stats.sp);
    expect(currentStats.pwr).toBe(unitData.stats.pwr);
    expect(currentStats.def).toBe(unitData.stats.def);
    expect(currentStats.rng).toBe(unitData.stats.rng);
    expect(currentStats.mvt).toBe(unitData.stats.mvt);

    expect(unit.isActive()).toBe(false);
    expect(unit.getGameObject()).toBe(undefined);
    expect(unit.getEffects().length).toBe(0);
})



