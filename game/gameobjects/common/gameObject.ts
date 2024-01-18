import { Position } from "@/game/data/types/position";

export default interface GameObject{
    setPosition(x:number,y:number):void;
    getPosition():Position;
    setVisible(visible:boolean):void;
    updateActive():void;
    getAsContainer():Phaser.GameObjects.Container;
}