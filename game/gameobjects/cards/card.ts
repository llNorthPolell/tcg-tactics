import { CARD_SIZE } from "@/game/config";
import { CardData } from "@/game/data/cardData";
import { EVENTS } from "@/game/enums/keys/events";
import { EventEmitter } from "@/game/scripts/events";

export abstract class Card<T extends CardData> {
    readonly id: string;
    readonly data: T;

    protected container?: Phaser.GameObjects.Container;
    protected x: number;
    protected y: number;

    constructor(id:string, data:T, x=0, y=0){
        this.id=id;
        this.data=data;
        this.x=x;
        this.y=y;
    }

    setPosition(x:number,y:number){
        this.x=x;
        this.y=y;
        this.container?.setPosition(x,y);
    }

    getPosition(){
        return {x: this.x, y: this.y}
    }

    abstract play() : void;

    abstract render(scene:Phaser.Scene):Phaser.GameObjects.Container;

    protected renderGameObject(scene:Phaser.Scene,color:number){
        this.container=scene.add.container(this.x,this.y);
        const bg = scene.add.rectangle(0,0,CARD_SIZE.width, CARD_SIZE.height,color)
            .setOrigin(0,0)
            .setStrokeStyle(1,0x000000);

        this.container?.add(bg);
        this.container.add(
            scene.add.text(
                CARD_SIZE.width*0.1,CARD_SIZE.height*0.5,this.data.name,
                {
                    fontFamily:'"Averia Serif Libre",serif',
                    fontSize:16
                }
            )
        );
        this.container.setInteractive(bg,Phaser.Geom.Rectangle.Contains).on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                EventEmitter.emit(EVENTS.cardEvent.SELECT,this);
            }
        );
        return this.container;
    }

}