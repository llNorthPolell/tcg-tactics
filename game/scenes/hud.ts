import { CANVAS_SIZE, HAND_UI_SIZE } from "../config";
import { SCENES } from "../enums/keys/scenes";
import Player from "../gameobjects/player";


export default class HUD extends Phaser.Scene{
    private container?:Phaser.GameObjects.Container;
    private player?: Player;

    constructor(){
        super({
            key: SCENES.HUD,
            active:true
        });
    }

    init(data:any){
        this.player = data.player;
    }

    preload(){

    }

    create(){
        this.container = this.add.container(0,CANVAS_SIZE.height*0.8);
        const bg = this.add.rectangle(
            0,
            0,
            HAND_UI_SIZE.width, 
            HAND_UI_SIZE.height,
            0x565656
        ).setOrigin(0);

        this.container.add(bg);
        
        this.player?.getHandRef().forEach(card=>{
            const container = card.render(this);
            this.container?.add(container);
        });
        

        console.log(JSON.stringify(this.player?.getHandRef()));
    }

    update(){

    }
}