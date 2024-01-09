import { CardData } from "@/game/data/cardData";
import { Position } from "@/game/data/types/position";
import Player from "@/game/data/player";
import Unit from "../unit";
import CardGO from "./cardGO";

export abstract class Card<T extends CardData> {
    readonly id: string;
    readonly data: T;
    protected owner: Player;

    protected position: Position;

    protected gameObject? : CardGO;
    
    constructor(id:string, data:T, owner:Player){
        this.id=id;
        this.data=data;
        this.owner=owner;
        this.position = {x:0,y:0};
    }

    setPosition(position:Position){
        this.position=position;
        this.gameObject?.setPosition(position.x,position.y);
    }

    getPosition(){
        return this.position;
    }

    abstract play(target?:Unit | Position) : void;

    render(scene : Phaser.Scene){
        if (!this.gameObject) 
            this.gameObject=new CardGO(scene,this);

        return this.gameObject;
    }

    setOwner(owner:Player){
        this.owner=owner;
    }

    getOwner(){
        return this.owner;
    }
    
    getGameObject(){
        return this.gameObject;
    }
    
    hide(){
        this.gameObject?.setVisible(false);
    }
}