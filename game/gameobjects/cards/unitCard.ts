import { Card } from "./card";
import Unit from "../unit";
import UnitCardData from "@/game/data/cards/unitCardData";
import { CARD_SIZE } from "@/game/config";

export default class UnitCard implements Card{
    readonly id:string;
    readonly data: UnitCardData;
    
    private container?: Phaser.GameObjects.Container;
    private x: number;
    private y: number;

    constructor(id:string,data:UnitCardData){
        this.id=id;
        this.data=data;
        this.x=0;
        this.y=0;
    }

    setPosition (x: number, y: number){
        this.x=x;
        this.y=y;
    }

    play():Unit{
        return new Unit(this.data);
    }

    render(scene:Phaser.Scene){
        this.container=scene.add.container(this.x,this.y);
        const bg = scene.add.rectangle(0,0,CARD_SIZE.width, CARD_SIZE.height,0x777700)
            .setOrigin(0,0)
            .setStrokeStyle(1,0x000000)
    
        this.container?.add(bg);
        this.container.add(
            scene.add.text(
                CARD_SIZE.width*0.1,CARD_SIZE.height*0.5,this.data.name
            )
        );
        this.container.setInteractive(bg,Phaser.Geom.Rectangle.Contains).on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                console.log(`Viewing card#${this.id}`);
            }
        );
        
        return this.container;
    }
}