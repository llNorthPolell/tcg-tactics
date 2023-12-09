import { CARD_SIZE } from "@/game/config";
import { CardData } from "@/game/data/cardData";
import { Position } from "@/game/data/position";
import { EVENTS } from "@/game/enums/keys/events";
import { EventEmitter } from "@/game/scripts/events";
import GamePlayer from "../gamePlayer";
import { ASSETS } from "@/game/enums/keys/assets";

export abstract class Card<T extends CardData> {
    readonly id: string;
    readonly data: T;
    protected owner: GamePlayer;

    protected container?: Phaser.GameObjects.Container;
    protected x: number;
    protected y: number;
    protected image?: Phaser.GameObjects.Sprite;

    constructor(id:string, data:T, owner:GamePlayer,x=0, y=0){
        this.id=id;
        this.data=data;
        this.x=x;
        this.y=y;
        this.owner=owner;
    }

    setPosition(x:number,y:number){
        this.x=x;
        this.y=y;
        this.container?.setPosition(x,y);
    }

    getPosition(){
        return {x: this.x, y: this.y}
    }

    abstract play(location:Position) : void;

    abstract render(scene:Phaser.Scene):Phaser.GameObjects.Container;

    protected renderGameObject(scene:Phaser.Scene,color:number,cardType:string){
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

        this.image = scene.add.sprite(CARD_SIZE.width*0.5,CARD_SIZE.height*0.5,ASSETS.UNDEFINED)
            .setDisplaySize(CARD_SIZE.width*0.9, CARD_SIZE.height*0.9)
            .setOrigin(0.5);

        this.container.add(this.image);
        this.loadImage(scene, cardType);

        return this.container;
    }

    protected loadImage(scene:Phaser.Scene,cardType:string){
        const assetName=`${ASSETS.PORTRAIT}_${cardType}_${this.data.id}`;
        scene.load.image(assetName, `assets/portraits/${cardType}/${this.data.id}.png`);
        scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            this.image?.setTexture(assetName)
            .setOrigin(0.5)
            .setPosition(CARD_SIZE.width*0.5,CARD_SIZE.height*0.5)
            .setDisplaySize(CARD_SIZE.width*0.9, CARD_SIZE.height*0.9);
        });
        scene.load.start();

    }

    setOwner(owner:GamePlayer){
        this.owner=owner;
    }

    getOwner(){
        return this.owner;
    }
    
    hide(){
        this.container?.setVisible(false);
    }
}