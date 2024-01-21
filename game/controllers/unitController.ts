import Effect from "@/game/skillEffects/effect";
import Card from "../gameobjects/cards/card";
import Unit from "../gameobjects/units/unit";
import Field from "../state/field";
import { Position } from "@/game/data/types/position";
import GameObjectFactory from "../gameobjects/gameObjectFactory";

export default class UnitController{

    private readonly field:Field;

    private movingUnit?:Unit;

    constructor(field:Field){
        this.field=field;
        this.movingUnit=undefined;
    }

    summonUnitByCard(scene:Phaser.Scene, card:Card,position:Position) : Unit{
        const unit = card.getUnit();
        if (!unit)
            throw new Error(`Cannot summon a unit with the card ${card.name}; no unit was initialized...`);

        const owner = card.getOwner();
        if(!owner)
            throw new Error(`Cannot summon a unit with the card ${card.name}; card has no owner...`);

        unit.setOwner(owner);

        const unitGO = GameObjectFactory.createUnitGO(scene,unit);
        unit.linkGameObject(unitGO);
        this.getPositionController(unit).set(position);

        this.field.units.set(`${position.x}_${position.y}`,unit);
        owner.units.register(unit);
        return unit;
    }

    summonUnitByEffect(effect:Effect, index:number=0,position:Position){
        const effectComponents = effect.getComponentsByType("summon");
        if (effectComponents.length === 0)
            throw new Error(`No summon effects found in ${effect.name}`);
        
        const unit = effectComponents[index].unit;

        if (!unit)
            throw new Error(`Unit was not found in ${effect.name}`);

        this.field.units.set(`${position.x}_${position.y}`,unit);
    }

    selectUnit(unit:Unit){
        this.movingUnit=unit;
    }

    cancelMove(){
        if(!this.movingUnit) return;
        const positionController = this.getPositionController(this.movingUnit);
        positionController.cancel()
        this.movingUnit=undefined;
    }

    confirmMove(){
        if(!this.movingUnit) 
            throw new Error("No unit was selected...");
        const positionController = this.getPositionController(this.movingUnit);
        const position = positionController.get();

        this.field.units.delete(`${position.x}_${position.y}`);
        positionController.confirm();
        
        const newPosition = this.movingUnit.position()!.get();
        this.field.units.set(`${newPosition.x}_${newPosition.y}`,this.movingUnit);

        this.movingUnit=undefined;
    }

    removeUnit(unit:Unit){
        const position = this.getPosition(unit);
        this.field.units.delete(`${position.x}_${position.y}`);
    }

    getPosition(unit:Unit){
        const positionController = this.getPositionController(unit);
        return positionController.get();
    }

    getUnitByPosition(position:Position){
        return this.field.units.get(`${position.x}_${position.y}`);
    }

    getSelected(){
        return this.movingUnit;
    }

    private getPositionController(unit:Unit){
        const positionController = unit.position();
        if(!positionController)
            throw new Error(`${unit.name}'s does not have a position controller...`);
        return positionController;
    }
}