import { TILESIZE } from "@/game/config";
import SpellCard from "../cards/spellCard";
import Unit from "./unit";
import { ASSETS } from "@/game/enums/keys/assets";
import { EVENTS } from "@/game/enums/keys/events";
import { EventEmitter } from "@/game/scripts/events";
import { TARGET_TYPES } from "@/game/enums/keys/targetTypes";
import { AMITY_COLORS } from "@/game/enums/keys/amityColors";

export default class SpellSelector extends Phaser.GameObjects.Container{
    private unit:Unit;
    private spellCard?: SpellCard;
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
                    if (!this.spellCard) return;
                    console.log(`Cast ${this.spellCard.data.name} onto ${this.unit.name}!`)
                    EventEmitter.emit(EVENTS.cardEvent.PLAY, this.unit);
                }
            )
        this.hide();
    }

    show(spellCard:SpellCard){
        const spellCardOwnerId = spellCard.getOwner()!.id;
        const unitOwnerId = this.unit.getOwner()!.id;
        const targetType = spellCard.data.targetType;

        if (spellCardOwnerId===unitOwnerId && targetType===TARGET_TYPES.enemy) return;
        if (spellCardOwnerId!==unitOwnerId && targetType===TARGET_TYPES.ally) return;

        this.spellCard=spellCard;

        this.selector.tint = (spellCard.data.targetType === TARGET_TYPES.ally)?
            AMITY_COLORS.success :
            (spellCard.data.targetType === TARGET_TYPES.enemy)?
                AMITY_COLORS.danger :
                AMITY_COLORS.none;

        // TODO: Allies currently show up as danger since they are not owned by player
        if (spellCard.data.targetType === TARGET_TYPES.position){
            if (spellCardOwnerId == unitOwnerId) this.selector.tint = AMITY_COLORS.success
            else this.selector.tint = AMITY_COLORS.danger;
        }
        this.setVisible(true);
    }

    hide(){
        this.setVisible(false);
    }
}