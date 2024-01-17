import { CARD_SIZE } from "@/game/config";
import { ASSETS } from "@/game/enums/keys/assets";
import CardGO from "./cardGO";
import Unit from "../units/unit";
import { getClassIcon } from "@/game/enums/keys/unitClass";

export default class CardGOStats{
    constructor(scene:Phaser.Scene, container: CardGO){
        const card = container.getCard();
        const unit = (card.getContents() as Unit)
        const stats = unit.getCurrentStats();

        const healthBg = scene.add.image(
            CARD_SIZE.width-1,
            CARD_SIZE.height,
            ASSETS.HP_ICON
        )
        .setDisplaySize(CARD_SIZE.height*0.2,CARD_SIZE.height*0.2)
        .setOrigin(1);
        container.add(healthBg);

        const healthText = scene.add.text(
            CARD_SIZE.width-1,
            CARD_SIZE.height,
            String(stats.hp),{
            color:'#FFF',
            fontFamily:'"Sansita",sans-serif',
            fontSize:24
        }).setOrigin(1);
        container.add(healthText);

        const pwrBg = scene.add.image(
            1,
            CARD_SIZE.height - (CARD_SIZE.height*0.2),
            ASSETS.PWR_ICON
        )
        .setDisplaySize(CARD_SIZE.height*0.2,CARD_SIZE.height*0.2)
        .setOrigin(0);
        container.add(pwrBg);


        const pwrText = scene.add.text(
            CARD_SIZE.width*0.1,
            CARD_SIZE.height,
            String(stats.pwr),{
            color:'#FFF',
            fontFamily:'"Sansita",sans-serif',
            fontSize:24
        }).setOrigin(0,1);
        container.add(pwrText);

        const classIcon = scene.add.image(
            CARD_SIZE.width-1,
            0,
            ASSETS.CLASS_ICONS,
            getClassIcon(unit.unitClass)
        ).setOrigin(1,0);
        container.add(classIcon);
    }
}