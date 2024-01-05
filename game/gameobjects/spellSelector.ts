import { TILESIZE } from "../config";
import { AMITY_COLORS } from "../enums/keys/amityColors";
import { ASSETS } from "../enums/keys/assets";
import { TARGET_TYPES } from "../enums/keys/targetTypes";
import SpellCard from "./cards/spellCard";
import Unit from "./unit";

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
                    //EventEmitter.emit(EVENTS.unitEvent.ATTACK, this.attacker, unit);
                    console.log(`Cast ${this.spellCard.data.name} onto ${this.unit.getUnitData().name}!`)
                }
            )
        this.hide();
    }

    show(spellCard:SpellCard){
        const spellCardOwnerId = spellCard.getOwner().id;
        const unitOwnerId = this.unit.getOwner().playerInfo.id;
        const targetType = spellCard.data.targetType;

        if (spellCardOwnerId===unitOwnerId && targetType===TARGET_TYPES.enemy) return;
        if (spellCardOwnerId!==unitOwnerId && targetType===TARGET_TYPES.ally) return;

        this.spellCard=spellCard;

        this.selector.tint = (spellCard.data.targetType === TARGET_TYPES.ally)?
            AMITY_COLORS.success :
            (spellCard.data.targetType === TARGET_TYPES.enemy)?
                AMITY_COLORS.danger :
                AMITY_COLORS.none;

        this.setVisible(true);
    }

    hide(){
        this.setVisible(false);
    }
}