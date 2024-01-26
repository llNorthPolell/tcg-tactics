import Card from "./cards/card";
import CardGO from "./cards/cardGO";
import UnitGO from "./units/unitGO";
import Unit from "./units/unit";
import { Position } from "@/game/data/types/position";

export default class GameObjectFactory{

    static createCardGO(scene:Phaser.Scene,card:Card,initialPosition:Position={x:0,y:0}) : CardGO{
        return new CardGO(scene,card,initialPosition);
    }

    static createUnitGO(scene:Phaser.Scene,unit:Unit): UnitGO{
        return new UnitGO(scene,unit);
    }
}