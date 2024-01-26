import { TILESIZE } from "@/game/config";
import Unit from "./unit";
import { ASSETS } from "@/game/enums/keys/assets";
import { EVENTS } from "@/game/enums/keys/events";
import { EventEmitter } from "@/game/scripts/events";
import GamePlayer from "../player/gamePlayer";
import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import { GAME_CONSTANT } from "@/game/enums/keys/gameConstants";
import { inRange } from "@/game/scripts/util";
import { AMITY_COLORS } from "@/game/enums/keys/amityColors";

export default class SpellSelector extends Phaser.GameObjects.Container{
    private unit:Unit;
    private selector:Phaser.GameObjects.Image;

    constructor(scene:Phaser.Scene,unit:Unit){
        super(scene,0,0);
        this.unit=unit;

        const bg = scene.add.rectangle(0,0,TILESIZE.width, TILESIZE.height).setOrigin(0);
        this.add(bg);

        this.selector = scene.add.image(0,0,ASSETS.SPELL_SELECTOR)
            .setOrigin(0);
        this.add(this.selector);

        this.setInteractive(bg,Phaser.Geom.Rectangle.Contains)
            .on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
                ()=>{
                    EventEmitter.emit(EVENTS.cardEvent.PLAY, this.unit);
                }
            )
        this.hide();

        EventEmitter
        .on(
            EVENTS.uiEvent.SHOW_SPELL_SELECTOR,
            (sourcePlayer:GamePlayer, targetType:string)=>{
                if (targetType===TARGET_TYPES.none) return;
                if (targetType===TARGET_TYPES.ally && sourcePlayer !== this.unit.getOwner()) return;
                if (targetType===TARGET_TYPES.enemy && sourcePlayer === this.unit.getOwner()) return;
                
                const heroes = sourcePlayer.units.getActiveChampions();
                const thisPosition = this.unit.position()!.get();
                let nearHero = false;
                heroes.forEach(
                    hero=>{
                        const heroPosition = hero.position()?.get();
                        if (!heroPosition)
                            throw new Error(`${hero.name} does not have a position controller initialized...`);

                        if (inRange(heroPosition,thisPosition,GAME_CONSTANT.MAX_SPELL_RANGE))
                            nearHero=true;
                    }
                )
                if(nearHero)
                    this.show((this.unit.getOwner()===sourcePlayer)? AMITY_COLORS.success : AMITY_COLORS.danger);
            }
        )
        .on(
            EVENTS.uiEvent.HIDE_SPELL_SELECTOR,
            ()=>{
                this.hide();
            }
        )
    }

    show(color:number){
        this.selector.tint = color;
        this.setVisible(true);
    }

    hide(){
        this.setVisible(false);
    }
}