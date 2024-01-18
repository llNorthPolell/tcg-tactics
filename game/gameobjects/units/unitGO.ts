import { EVENTS } from "@/game/enums/keys/events";
import GameObject from "../common/gameObject";
import FloatingText from "./floatingText";
import { EventEmitter } from "@/game/scripts/events";
import { TILESIZE } from "@/game/config";
import Unit from "./unit";
import { ASSETS } from "@/game/enums/keys/assets";
import { loadImage } from "@/game/scripts/imageLoader";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import { getClassIcon } from "@/game/enums/keys/unitClass";
import { Position } from "@/game/data/types/position";
import { FONT } from "@/game/enums/keys/font";
import { UNIT_TYPE } from "@/game/enums/keys/unitType";
import AttackSelector from "./attackSelector";
import SpellSelector from "./spellSelector";


export default class UnitGO extends Phaser.GameObjects.Container implements GameObject{
    private image: Phaser.GameObjects.Sprite;
    readonly imageAssetName: string;
    
    readonly attackSelector: AttackSelector;
    readonly spellSelector: SpellSelector; 
    readonly floatingText: FloatingText;

    private hpText:Phaser.GameObjects.Text;
    private pwrText:Phaser.GameObjects.Text;

    private readonly unit:Unit;
    
    constructor(scene : Phaser.Scene, unit:Unit,initialPosition:Position){
        super(scene,initialPosition.x,initialPosition.y);
        this.unit = unit;

        const unitType = unit.unitType;
        const baseColor = unit.getOwner()!.color;
        this.imageAssetName = `${ASSETS.PORTRAIT}_${unitType}_${unit.cardId}`;

        const bg = scene.add.rectangle(
            TILESIZE.width/2,
            TILESIZE.height/2,
            TILESIZE.width*0.95,
            TILESIZE.height*0.95,
            baseColor
        ).setOrigin(0.5);
        this.add(bg);

        this.image = scene.add.sprite(TILESIZE.width*0.5,TILESIZE.height*0.5,this.imageAssetName)
            .setOrigin(0.5)
            .setDisplaySize(TILESIZE.width*0.85, TILESIZE.height*0.85);

        if (!scene.textures.exists(this.imageAssetName)){
            loadImage(scene, 
                this.image, 
                unitType, 
                unit.cardId,
                TILESIZE.width*0.85, 
                TILESIZE.height*0.85);
        }
        this.add(this.image);

        if (unit.isActive())
            this.image.setAlpha(1);
        else
            this.image.setAlpha(0.7);

        const classIcon = scene.add.image(
            TILESIZE.width,
            0,
            ASSETS.CLASS_ICONS,
            getClassIcon(unit.unitClass)
        )
        .setDisplaySize(TILESIZE.width*0.3, TILESIZE.height*0.3)
        .setOrigin(1,0);
        this.add(classIcon);

        const healthBg = this.scene.add.image(
            TILESIZE.width-1,
            TILESIZE.height*0.95,
            ASSETS.HP_ICON
        )
        .setDisplaySize(TILESIZE.height*0.3,TILESIZE.height*0.3)
        .setOrigin(1);
        this.add(healthBg);

        this.hpText = this.scene.add.text(
            TILESIZE.width-1,
            TILESIZE.height*0.95,
            String(unit.getCurrentStats().hp),{
            fontFamily:FONT.secondary,
            fontSize:8,
            resolution:3.125
        })
        .setOrigin(1);
        this.add(this.hpText);

        const pwrBg = this.scene.add.image(
            1,
            (TILESIZE.height*0.95) - (TILESIZE.height*0.3),
            ASSETS.PWR_ICON
        )
        .setDisplaySize(TILESIZE.height*0.3,TILESIZE.height*0.3)
        .setOrigin(0);
        this.add(pwrBg);


        this.pwrText = this.scene.add.text(
            TILESIZE.width*0.1,
            TILESIZE.height*0.95,
            String(unit.getCurrentStats().pwr),{
            fontFamily:FONT.secondary,
            fontSize:8,
            resolution:3.125
        }).setOrigin(0,1);
        this.add(this.pwrText);

        if (unitType===UNIT_TYPE.hero){
            const heroGlow = scene.add.rectangle(
                TILESIZE.width/2,
                TILESIZE.height/2,
                TILESIZE.width,
                TILESIZE.height,
                baseColor
            ).setOrigin(0.5);
            this.add(heroGlow);
            heroGlow.preFX?.addGlow(undefined,undefined,undefined,true);
            heroGlow.postFX?.addGlow(undefined,undefined,undefined,true);

            const heroGlowTween = scene.tweens.add(
                {
                    targets: heroGlow,
                    alpha: { from: 0, to: 0.1 },
                    scale: { from: 1, to: 1.1 },
                    ease: 'Quartic.Out',
                    duration: 2000,
                    repeat: -1,
                    yoyo: true,
                    persist: true
                }
            )
        }


        this.attackSelector = new AttackSelector(scene,unit);
        this.add(this.attackSelector);

        this.spellSelector = new SpellSelector(scene,unit);
        this.add(this.spellSelector);

        this.floatingText = new FloatingText(scene).setOrigin(0.5).setPosition(TILESIZE.width/2,TILESIZE.height/2);
        this.add(this.floatingText);

        this.setInteractive(new Phaser.Geom.Rectangle(TILESIZE.width*0.05, TILESIZE.height*0.05,TILESIZE.width,TILESIZE.height),
            Phaser.Geom.Rectangle.Contains)
        .on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                EventEmitter.emit(EVENTS.unitEvent.SELECT,unit);
            }
        );

        this.scene.add.existing(this);
    }

    getPosition(): Position {
        throw new Error("Method not implemented.");
    }

    getImage(){
        return this.image;
    }

    updateHpText(){
        this.hpText.setText(String(this.unit.getCurrentStats().hp));
    }

    updatePwrText(){
        const currPwr = this.unit.getCurrentStats().pwr;
        const basePwr = this.unit.base.pwr;

        this.pwrText.setText(String(currPwr));

        const color = (currPwr < basePwr)? UI_COLORS.damage : 
            (currPwr > basePwr)? UI_COLORS.buff : UI_COLORS.white;

        const rgb = Phaser.Display.Color.IntegerToRGB(color);

        this.pwrText.setColor(Phaser.Display.Color.RGBToString(rgb.r,rgb.g,rgb.b));
    }

    updateActive(){
        this.getImage().setAlpha(this.unit.isActive()?1:0.7);
    }
}