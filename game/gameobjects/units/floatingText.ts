import { EventEmitter } from "@/game/scripts/events";
import { TILESIZE } from "../../config";
import { FONT } from "../../enums/keys/font";
import { EVENTS } from "@/game/enums/keys/events";

export default class FloatingText extends Phaser.GameObjects.Text{
    private animation:Phaser.Tweens.Tween;

    constructor(scene:Phaser.Scene){
        super(scene,0,0,"",{
            fontFamily:FONT.main,/*'"Averia Serif Libre",serif',*/
            fontSize:16
        });

        this.animation = scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0.5 },
            y: {from:(TILESIZE.height*0.5), to:-(TILESIZE.height*0.5) },
            ease: 'Linear.None',
            duration: 1000,
            repeat: 0,
            yoyo: false,
            persist: true,
            onComplete: ()=>{
                this.setVisible(false);
            }
        });
    }

    play(text:string,color:number){
        this.setText(text);
        const rgb = Phaser.Display.Color.IntegerToRGB(color)
        this.setColor(Phaser.Display.Color.RGBToString(rgb.r,rgb.g,rgb.b));
        this.setVisible(true);
        this.animation.restart();
        this.animation.play();
    }
}