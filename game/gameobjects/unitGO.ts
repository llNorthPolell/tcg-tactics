import { TILESIZE } from "../config";
import HeroCardData from "../data/cards/heroCardData";
import { Position } from "../data/types/position";
import { ASSETS } from "../enums/keys/assets";
import { EVENTS } from "../enums/keys/events";
import { CLASS_ICON_MAPPING, getClassIcon } from "../enums/keys/unitClass";
import { EventEmitter } from "../scripts/events";
import { loadImage } from "../scripts/imageLoader";
import AttackSelector from "./attackSelector";
import FloatingText from "./floatingText";
import SpellSelector from "./spellSelector";
import Unit from "./unit";

export default class UnitGO extends Phaser.GameObjects.Container{
    private image: Phaser.GameObjects.Sprite;
    readonly imageAssetName: string;
    
    private readonly activeColor: number;
    private readonly inactiveColor:number;

    readonly attackSelector: AttackSelector;
    readonly spellSelector: SpellSelector; 
    readonly floatingText: FloatingText;

    private hpText:Phaser.GameObjects.Text;
    private pwrText:Phaser.GameObjects.Text;

    private unit: Unit;

    constructor(scene : Phaser.Scene, unit:Unit){
        super(scene,unit.getPixelPosition().x,unit.getPixelPosition().y);
        this.unit = unit;

        const unitType = unit.getUnitType();
        const baseColor = unit.getOwner().color;
        this.activeColor = baseColor;
        const darkColor = Phaser.Display.Color.ValueToColor(baseColor).darken(80);
        this.inactiveColor= darkColor.color;
        this.imageAssetName = `${ASSETS.PORTRAIT}_${unitType}_${unit.card.id}`;

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
                unit.card.id,
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
            getClassIcon(unit.getUnitData().unitClass)
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
            String(unit.getUnitData().currHp),{
            color:'#FFF',
            fontFamily:'"Sansita",sans-serif',
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
            String(unit.getUnitData().currPwr),{
            color:'#FFF',
            fontFamily:'"Sansita",sans-serif',
            fontSize:8,
            resolution:3.125
        }).setOrigin(0,1);
        this.add(this.pwrText);

        if (unit.card instanceof HeroCardData){
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

    getImage(){
        return this.image;
    }

    updateHpText(){
        this.hpText.setText(String(this.unit.getUnitData().currHp));
    }

    updatePwrText(){
        this.hpText.setText(String(this.unit.getUnitData().currPwr));
    }
}