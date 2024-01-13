import { CARD_SIZE } from "@/game/config";
import CardGO from "./cardGO";
import UnitCard from "./unitCard";
import { ASSETS } from "@/game/enums/keys/assets";
import UnitCardData from "@/game/data/cards/unitCardData";
import { getClassIcon } from "@/game/enums/keys/unitClass";

export default class UnitCardGO extends CardGO<UnitCardData>{
    constructor(scene : Phaser.Scene, card:UnitCard){
        super(scene,card);

        this.renderContents();
    }

    renderContents(){
        const healthBg = this.scene.add.image(
            CARD_SIZE.width-1,
            CARD_SIZE.height,
            ASSETS.HP_ICON
        )
        .setDisplaySize(CARD_SIZE.height*0.2,CARD_SIZE.height*0.2)
        .setOrigin(1);
        this.add(healthBg);

        const healthText = this.scene.add.text(
            CARD_SIZE.width-1,
            CARD_SIZE.height,
            String(this.card.data.hp),{
            color:'#FFF',
            fontFamily:'"Sansita",sans-serif',
            fontSize:24
        }).setOrigin(1);
        this.add(healthText);

        const pwrBg = this.scene.add.image(
            1,
            CARD_SIZE.height - (CARD_SIZE.height*0.2),
            ASSETS.PWR_ICON
        )
        .setDisplaySize(CARD_SIZE.height*0.2,CARD_SIZE.height*0.2)
        .setOrigin(0);
        this.add(pwrBg);


        const pwrText = this.scene.add.text(
            CARD_SIZE.width*0.1,
            CARD_SIZE.height,
            String(this.card.data.pwr),{
            color:'#FFF',
            fontFamily:'"Sansita",sans-serif',
            fontSize:24
        }).setOrigin(0,1);
        this.add(pwrText);

        const classIcon = this.scene.add.image(
            CARD_SIZE.width-1,
            0,
            ASSETS.CLASS_ICONS,
            getClassIcon(this.card.data.unitClass)
        ).setOrigin(1,0);
        this.add(classIcon);
    }
}