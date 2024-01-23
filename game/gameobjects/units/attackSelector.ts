import { TILESIZE } from "@/game/config";
import Unit from "./unit";
import { ASSETS } from "@/game/enums/keys/assets";
import { EVENTS } from "@/game/enums/keys/events";
import { EventEmitter } from "@/game/scripts/events";
import { Position } from "@/game/data/types/position";
import { inRange } from "@/game/scripts/util";

export default class AttackSelector extends Phaser.GameObjects.Container{
    private readonly unit:Unit;
    private attacker?: Unit;

    constructor(scene:Phaser.Scene,unit:Unit){
        super(scene,0,0);
        this.unit=unit;

        const bg = scene.add.rectangle(0,0,TILESIZE.width, TILESIZE.height).setOrigin(0);
        this.add(bg);

        const selector = scene.add.image(0,0,ASSETS.ATTACK_SELECTOR)
            .setOrigin(0);
        this.add(selector);

        this.setInteractive(bg,Phaser.Geom.Rectangle.Contains)
            .on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
                ()=>{
                    if (!this.attacker) return;
                    EventEmitter.emit(EVENTS.unitEvent.ATTACK, unit);
                }
            )
        this.hide();

        EventEmitter
        .on(
            EVENTS.uiEvent.SHOW_ATTACK_SELECTOR,
            (attacker:Unit, destination?:Position)=>{
                const attackerPosition = (destination)? destination: attacker.position()?.get(); 
                const thisPosition = this.unit.position()!.get();
                const attackerRange = attacker.getCurrentStats().rng;

                if (!attackerPosition || !thisPosition) return;
                if(attacker.getOwner() === this.unit.getOwner()) return;
                if(!inRange(attackerPosition,thisPosition,attackerRange)) return;

                this.show(attacker);
            }
        )
        .on(
            EVENTS.uiEvent.HIDE_ATTACK_SELECTOR,
            ()=>{
                this.hide();
            }
        )
    }

    show(attacker: Unit){
        this.attacker=attacker;
        this.setVisible(true);
    }

    hide(){
        this.setVisible(false);
        this.attacker=undefined;
    }
}