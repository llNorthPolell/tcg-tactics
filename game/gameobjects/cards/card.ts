import { CardData } from "@/game/data/cardData";
import { Position } from "@/game/data/types/position";
import Unit from "../unit";
import CardGO from "./cardGO";
import GamePlayer from "../gamePlayer";

export abstract class Card<T extends CardData> {
    readonly id: string;
    readonly data: T;
    protected owner?: GamePlayer;

    protected position: Position;

    protected gameObject? : CardGO<T>;
    
    constructor(id:string, data:T){
        this.id=id;
        this.data=data;
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

    abstract render(scene : Phaser.Scene) : CardGO<T>;

    setOwner(owner:GamePlayer){
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