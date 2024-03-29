import { Position } from "@/game/data/types/position";
import { FONT } from "@/game/enums/keys/font";

export default class Button extends Phaser.GameObjects.Container {
    bg: Phaser.GameObjects.Rectangle;
    name:string;
    display: Phaser.GameObjects.Text;

    constructor(
        scene:Phaser.Scene, 
        name: string, 
        display: string,
        position: Position,
        width : number,
        height: number,
        bgcolor: number,
        onPointerDown?: ()=>void,
        onPointerUp?: ()=>void,
        onPointerHover?: ()=>void,
        onPointerExit? : ()=>void){
    
        super(scene,position.x,position.y);
        this.name=name;
        this.bg = scene.add.rectangle(
            0,
            0,
            width,
            height,
            bgcolor
        ).setOrigin(0);

        this.display = scene.add.text(
            width/2,
            height/2,
            display,
            {
                color:'#FFF',
                fontFamily:FONT.main,
                fontSize:32
            }
        ).setOrigin(0.5);

        this.add(this.bg);
        this.add(this.display);
        this.scene.add.existing(this);

        this.setInteractive(this.bg,Phaser.Geom.Rectangle.Contains)
            .on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
                ()=>{if(onPointerDown)onPointerDown()}
            )
            .on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
                ()=>{if(onPointerUp)onPointerUp()}
            )
            .on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_OVER,
                ()=>{if(onPointerHover)onPointerHover()}
            )
            .on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_OUT,
                ()=>{if(onPointerExit)onPointerExit()}
            );
        
        this.setScrollFactor(0);
        this.setDepth(Infinity);
    }

    hide(){
        this.setVisible(false);
    }

    show(){
        this.setVisible(true);
    }
}