import { ASSETS } from "@/game/enums/keys/assets";
import { HAND_UI_SIZE, PORTRAIT_SIZE } from "@/game/config";
import { CLASS_ICON_MAPPING, getClassIcon } from "@/game/enums/keys/unitClass";
import { FONT } from "@/game/enums/keys/font";
import { UI_COLORS } from "@/game/enums/keys/uiColors";
import Unit from "../../units/unit";
import UnitGO from "../../units/unitGO";


const UNIT_STAT_ICON_SIZE = {
    width: HAND_UI_SIZE.width*0.05,
    height:HAND_UI_SIZE.width*0.05
}

const UNIT_STAT_FONT_SIZE=32;

const UNIT_CLASS_ICON_SIZE ={
    width: UNIT_STAT_ICON_SIZE.width*0.5,
    height: UNIT_STAT_ICON_SIZE.height*0.5
}

export default class UnitStatDisplay extends Phaser.GameObjects.Container{
    private readonly image:Phaser.GameObjects.Sprite;
    private readonly classIcon: Phaser.GameObjects.Sprite;
    private readonly unitNameText:Phaser.GameObjects.Text;
    private readonly unitHPText:Phaser.GameObjects.Text;
    private readonly unitSPText:Phaser.GameObjects.Text;
    private readonly unitPwrText:Phaser.GameObjects.Text;
    private readonly unitDefText:Phaser.GameObjects.Text;

    constructor(scene:Phaser.Scene){
        super(scene,0,0);

        const mainStyle = {
            fontFamily: FONT.main,
            fontSize:20
        };
        const secondaryStyle = {
            fontFamily: FONT.secondary,
            fontSize:20
        };

        this.image = scene.add.sprite(PORTRAIT_SIZE.width*0.5,PORTRAIT_SIZE.height*0.5,ASSETS.UNDEFINED)
            .setDisplaySize(PORTRAIT_SIZE.width, PORTRAIT_SIZE.height)
            .setOrigin(0.5);

        const hpContainer = scene.add.container(HAND_UI_SIZE.width*0.15, HAND_UI_SIZE.height*0.7);
        const hpIcon = scene.add.image(0, 0,ASSETS.HP_ICON)
            .setDisplaySize(UNIT_STAT_ICON_SIZE.width,UNIT_STAT_ICON_SIZE.height)
            .setOrigin(0.5);
        this.unitHPText = scene.add.text(0, 0,"0",secondaryStyle)
            .setFontSize(UNIT_STAT_FONT_SIZE)
            .setOrigin(0.5);
        hpContainer.add(hpIcon);
        hpContainer.add(this.unitHPText);

        const spContainer = scene.add.container(HAND_UI_SIZE.width*0.25, HAND_UI_SIZE.height*0.7);
        const spIcon = scene.add.image(0, 0,ASSETS.SP_ICON)
            .setDisplaySize(UNIT_STAT_ICON_SIZE.width,UNIT_STAT_ICON_SIZE.height)
            .setOrigin(0.5);    
        this.unitSPText = scene.add.text(0, 0,"0",secondaryStyle)
            .setFontSize(UNIT_STAT_FONT_SIZE)
            .setOrigin(0.5);
        spContainer.add(spIcon);
        spContainer.add(this.unitSPText);

        const pwrContainer = scene.add.container(HAND_UI_SIZE.width*0.35, HAND_UI_SIZE.height*0.7);
        const pwrIcon = scene.add.image(0, 0,ASSETS.PWR_ICON)
            .setDisplaySize(UNIT_STAT_ICON_SIZE.width,UNIT_STAT_ICON_SIZE.height)
            .setOrigin(0.5);
        this.unitPwrText = scene.add.text(0, 0,"0",secondaryStyle)
            .setFontSize(UNIT_STAT_FONT_SIZE)
            .setOrigin(0.5);
        pwrContainer.add(pwrIcon);
        pwrContainer.add(this.unitPwrText);

        const defContainer = scene.add.container(HAND_UI_SIZE.width*0.45,HAND_UI_SIZE.height*0.7);
        const defIcon = scene.add.image(0,0,ASSETS.DEF_ICON)
            .setDisplaySize(UNIT_STAT_ICON_SIZE.width,UNIT_STAT_ICON_SIZE.height)
            .setOrigin(0.5);
        this.unitDefText = scene.add.text(0, 0,"0",secondaryStyle)
            .setFontSize(UNIT_STAT_FONT_SIZE)
            .setOrigin(0.5);
        defContainer.add(defIcon);
        defContainer.add(this.unitDefText);

        this.unitNameText = scene.add.text(
            HAND_UI_SIZE.width*0.15,
            HAND_UI_SIZE.height *0.2, 
            "unit name",
            mainStyle
        ).setOrigin(0,0.5);

        const classIconContainer = scene.add.container(HAND_UI_SIZE.width*0.125,HAND_UI_SIZE.height*0.2)
        const classIconBg = scene.add.rectangle(0,0,UNIT_CLASS_ICON_SIZE.width, UNIT_CLASS_ICON_SIZE.height,0x000000)
            .setStrokeStyle(2,0xffffff)
            .setOrigin(0.5);
        this.classIcon = scene.add.sprite(0,0, ASSETS.CLASS_ICONS,CLASS_ICON_MAPPING.SOLDIER)
            .setDisplaySize(UNIT_CLASS_ICON_SIZE.width,UNIT_CLASS_ICON_SIZE.height)
            .setOrigin(0.5);
        classIconContainer.add(classIconBg);
        classIconContainer.add(this.classIcon);

        this.add(this.image);
        this.add(this.unitNameText);
        this.add(classIconContainer);
        this.add(hpContainer);
        this.add(spContainer);
        this.add(pwrContainer);
        this.add(defContainer);
    }

    show(){
        this.setVisible(true);
    }

    hide(){
        this.setVisible(false);
    }

    isVisible(){
        return this.visible;
    }

    setUnitName(name:string){
        this.unitNameText.setText(name);
    }

    setClassIcon(classIconFrame:number){
        this.classIcon.setTexture(ASSETS.CLASS_ICONS, classIconFrame);
    }

    setPortrait(imageAssetName:string){
        this.image.setTexture(imageAssetName);
    }

    setHP(hp:number){
        this.unitHPText.setText(String(hp));
    }

    setSP(sp:number){
        this.unitSPText.setText(String(sp));
    }

    setPwr(pwr:number,color:number=UI_COLORS.white){
        this.unitPwrText.setText(String(pwr));
        const rgb = Phaser.Display.Color.IntegerToRGB(color);
        this.unitPwrText.setColor(Phaser.Display.Color.RGBToString(rgb.r,rgb.g,rgb.b));
    }

    setDef(def:number,color:number=UI_COLORS.white){
        this.unitDefText.setText(String(def));
        const rgb = Phaser.Display.Color.IntegerToRGB(color);
        this.unitDefText.setColor(Phaser.Display.Color.RGBToString(rgb.r,rgb.g,rgb.b)); 
    }


}