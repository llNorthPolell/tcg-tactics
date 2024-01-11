import { CANVAS_SIZE } from "../config";
import { ASSETS } from "../enums/keys/assets";
import { EVENTS } from "../enums/keys/events";
import { SCENES } from "../enums/keys/scenes";
import { EventEmitter } from "../scripts/events";

export default class TurnTransition extends Phaser.Scene{
    private yourTurnSprite?:Phaser.GameObjects.Sprite;
    private oppTurnSprite?:Phaser.GameObjects.Sprite;

    constructor(){
        super({
            key: SCENES.TURN_TRANSITION
        });
    }

    create() {
        // your turn animation
        const yourTurnSprite = this.add.sprite(
            CANVAS_SIZE.width / 2, CANVAS_SIZE.height / 2, ASSETS.YOUR_TURN)
            .setOrigin(0.5);

        yourTurnSprite.setVisible(false);
        const yourTurnAnimation = this.tweens.add({
            targets: yourTurnSprite,
            alpha: { from: 0, to: 1 },
            scale: { from: 2, to: 2.2 },
            ease: 'Quartic.Out',
            duration: 1200,
            repeat: 0,
            yoyo: true,
            persist: true
        });    

        // opponent's turn animation
        const oppTurnSprite = this.add.sprite(
            CANVAS_SIZE.width / 2, CANVAS_SIZE.height / 2, ASSETS.OPPONENT_TURN)
            .setOrigin(0.5);

        oppTurnSprite.setVisible(false);
        const oppTurnAnimation = this.tweens.add({
            targets: oppTurnSprite,
            alpha: { from: 0, to: 1 },
            scale: { from: 2, to: 2.2 },
            ease: 'Quartic.Out',
            duration: 1200,
            repeat: 0,
            yoyo: true,
            persist: true
        }); 


        EventEmitter.on(
            EVENTS.gameEvent.PLAYER_TURN,
            (_playerId: number, _activePlayerIndex:number, isDevicePlayerTurn: boolean)=>{
                if(isDevicePlayerTurn){
                    oppTurnSprite.setVisible(false);
                    yourTurnSprite.setVisible(true);
                    yourTurnAnimation.restart();
                    yourTurnAnimation.play();
                }
                else{
                    yourTurnSprite.setVisible(false);
                    oppTurnSprite.setVisible(true);
                    oppTurnAnimation.restart();
                    oppTurnAnimation.play();
                }
            }
        )
    }
}