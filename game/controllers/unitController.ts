import Effect from "@/game/skillEffects/effect";
import Card from "../gameobjects/cards/card";
import Unit from "../gameobjects/units/unit";
import Field from "../state/field";
import { Position } from "@/game/data/types/position";
import GameObjectFactory from "../gameobjects/gameObjectFactory";
import GamePlayer from "../gameobjects/player/gamePlayer";

export default class UnitController{

    private readonly field:Field;

    constructor(field:Field){
        this.field=field;
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

    /*summonUnitByEffect(effect:Effect, index:number=0,position:Position){
        const effectComponents = effect.getComponentsByType("summon");
        if (effectComponents.length === 0)
            throw new Error(`No summon effects found in ${effect.name}`);
        
        const unit = effectComponents[index].unit;

        if (!unit)
            throw new Error(`Unit was not found in ${effect.name}`);

        this.field.units.set(`${position.x}_${position.y}`,unit);
    }*/

    selectUnit(selectingPlayer:GamePlayer,unit:Unit){
        selectingPlayer.units.selectUnit(unit);
    }

    cancelMove(selectingPlayer:GamePlayer){
        const selected = selectingPlayer.units.getSelected();
        if(!selected) return;
        const positionController = this.getPositionController(selected);
        positionController.cancel()
        selectingPlayer.units.deselectUnit();
    }

    moveTo(unit:Unit,destination:Position){
        unit.position()?.moveTo(destination);
    }

    confirmMove(activePlayer:GamePlayer,unit:Unit){
        const movingUnit = activePlayer.units.getSelected();
        if(!movingUnit)
            throw new Error("No unit was selected...");
        if (unit !== movingUnit)
            throw new Error("Unit provided is not the selected unit...");
        const positionController = this.getPositionController(movingUnit);
        const position = positionController.get();

        this.field.units.delete(`${position.x}_${position.y}`);
        positionController.confirm();
        
        const newPosition = movingUnit.position()!.get();
        this.field.units.set(`${newPosition.x}_${newPosition.y}`,movingUnit);

        activePlayer.units.deselectUnit();
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

    getSelected(player:GamePlayer){
        return player.units.getSelected();
    }

    private getPositionController(unit:Unit){
        const positionController = unit.position();
        if(!positionController)
            throw new Error(`${unit.name}'s does not have a position controller...`);
        return positionController;
    }
}