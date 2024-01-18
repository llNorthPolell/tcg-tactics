import Effect from "@/game/skillEffects/effect";
import Card from "../gameobjects/cards/card";
import Unit from "../gameobjects/units/unit";
import Field from "../state/field";
import { Position } from "@/game/data/types/position";

export default class UnitController{

    private readonly field:Field;

    private movingUnit?:Unit;

    constructor(field:Field){
        this.field=field;
        this.movingUnit=undefined;
    }

    summonUnitByCard(card:Card,position:Position){
        const unit = card.getContents() as Unit;
        const positionController = unit.position();
        const owner = unit.getOwner();
        if (!positionController) 
            throw new Error(`Position controller has not been initiated in ${unit.name}`);
        if (!owner)
            throw new Error(`${unit.name} does not have an owner...`);
        this.field.units.set(`${position.x}_${position.y}`,unit);
        this.field.unitsByPlayer.get(owner.id)!.push(unit);
    }

    summonUnitByEffect(effect:Effect, index:number=0,position:Position){
        const effectComponents = effect.getComponentsByType("summon");
        if (effectComponents.length === 0)
            throw new Error(`No summon effects found in ${effect.name}`);
        
        const unit = effectComponents[index].unit;

        if (!unit)
            throw new Error(`Unit was not found in ${effect.name}`);

        const positionController = unit.position();
        if (!positionController) 
            throw new Error(`Position controller has not been initiated in ${unit.name}`);

        this.field.units.set(`${position.x}_${position.y}`,unit);
    }

    selectUnit(unit:Unit){
        this.movingUnit=unit;
    }

    confirmMove(unit:Unit, destination:Position){
        const position = this.getPosition(unit);

        this.field.units.delete(`${position.x}_${position.y}`);
        unit.position()?.moveTo(destination);
        this.field.units.set(`${destination.x}_${destination.y}`,unit);
    }

    removeUnit(unit:Unit){
        const position = this.getPosition(unit);
        this.field.units.delete(`${position.x}_${position.y}`);
    }

    getPosition(unit:Unit){
        const positionController = unit.position();
        if(!positionController)
            throw new Error(`${unit.name}'s position is undefined...`);
        return positionController.get();
    }

    getUnitByPosition(position:Position){
        return this.field.units.get(`${position.x}_${position.y}`);
    }

    getUnitsByPlayerId(playerId:number){
        return this.field.unitsByPlayer.get(playerId);
    }

    getSelected(){
        return this.movingUnit;
    }
}