import Card from "./cards/card";
import CardGO from "./cards/cardGO";
import UnitGO from "./units/unitGO";
import Unit from "./units/unit";
import { Position } from "@/game/data/types/position";

export default class GameObjectFactory{
    private scene:Phaser.Scene;

    constructor(scene:Phaser.Scene){
        this.scene=scene;
    }

    createCardGO(card:Card,initialPosition:Position={x:0,y:0}) : CardGO{
        return new CardGO(this.scene,card,initialPosition);
    }

    createUnitGO(unit:Unit,initialPosition:Position={x:0,y:0}): UnitGO{
        return new UnitGO(this.scene,unit,initialPosition);
    }
}