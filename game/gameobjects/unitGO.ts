import { TILESIZE } from "../config";
import { Position } from "../data/types/position";
import { ASSETS } from "../enums/keys/assets";
import { EVENTS } from "../enums/keys/events";
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

    constructor(scene : Phaser.Scene, unit:Unit){
        super(scene,unit.getPixelPosition().x,unit.getPixelPosition().y);
        
        const unitType = unit.getUnitType();
        const baseColor = unit.getOwner().color;
        this.activeColor = baseColor;
        const darkColor = Phaser.Display.Color.ValueToColor(baseColor).darken(80);
        this.inactiveColor= darkColor.color;
        this.imageAssetName = `${ASSETS.PORTRAIT}_${unitType}_${unit.card.id}`;

        const bg = scene.add.rectangle(
            0,
            0,
            TILESIZE.width,
            TILESIZE.height,
            baseColor
        ).setOrigin(0);
        this.add(bg);

        this.image = scene.add.sprite(TILESIZE.width*0.5,TILESIZE.height*0.5,this.imageAssetName)
            .setOrigin(0.5)
            .setDisplaySize(TILESIZE.width*0.9, TILESIZE.height*0.9);

        if (!scene.textures.exists(this.imageAssetName)){
            loadImage(scene, 
                this.image, 
                unitType, 
                unit.card.id,
                TILESIZE.width*0.9, 
                TILESIZE.height*0.9);
        }
        this.add(this.image);

        if (unit.isActive())
            this.image.setAlpha(1);
        else
            this.image.setAlpha(0.7);

        this.attackSelector = new AttackSelector(scene,unit);
        this.add(this.attackSelector);

        this.spellSelector = new SpellSelector(scene,unit);
        this.add(this.spellSelector);

        this.floatingText = new FloatingText(scene).setOrigin(0.5).setPosition(TILESIZE.width/2,TILESIZE.height/2);
        this.add(this.floatingText);

        this.setInteractive(bg,Phaser.Geom.Rectangle.Contains)
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
}