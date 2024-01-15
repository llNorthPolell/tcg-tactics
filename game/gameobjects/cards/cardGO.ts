import { CARD_SIZE } from "@/game/config";
import { CardData } from "@/game/data/cardData";
import HeroCardData from "@/game/data/cards/heroCardData";
import SpellCardData from "@/game/data/cards/spellCardData";
import { ASSETS } from "@/game/enums/keys/assets";
import { loadImage } from "@/game/scripts/imageLoader";
import { Card } from "./card";

export default abstract class CardGO<T extends CardData> extends Phaser.GameObjects.Container{
    protected card: Card<T>;

    constructor(scene : Phaser.Scene, card:Card<T>){
        super(scene,card.getPosition().x,card.getPosition().y);
        this.card = card;
        this.renderCardBase(scene,card);
    }

    protected renderCardBase(scene : Phaser.Scene,card:Card<T>){
        const cardType = (card.data instanceof SpellCardData)? "spells" : 
            (card.data instanceof HeroCardData)? "heroes": "units";

        const bg = this.scene.add.rectangle(0,0,CARD_SIZE.width, CARD_SIZE.height,0x000000)
            .setOrigin(0,0)
            .setStrokeStyle(1,0x000000);

        this.add(bg);

        /*const cardNameText = this.scene.add.text(
            CARD_SIZE.width*0.1,CARD_SIZE.height*0.5,card.data.name,
            {
                fontFamily:'"Averia Serif Libre",serif',
                fontSize:16
            }
        );
        this.add(cardNameText);*/

        let image = this.scene.add.sprite(CARD_SIZE.width*0.5,CARD_SIZE.height*0.5,ASSETS.UNDEFINED)
            .setDisplaySize(CARD_SIZE.width*0.98, CARD_SIZE.height*0.98)
            .setOrigin(0.5);

        this.add(image);
        loadImage(scene, image, cardType, card.data.id,CARD_SIZE.width*0.98, CARD_SIZE.height*0.98);


        const costBg = this.scene.add.circle(0,0,CARD_SIZE.width*0.15,0xd9d9d9)
            .setStrokeStyle(1,0x000000)
            .setOrigin(0);
        this.add(costBg);

        const costText = this.scene.add.text(CARD_SIZE.width*0.09,CARD_SIZE.width*0.025,String(card.data.cost),{
            color:'#000',
            fontFamily:'"Sansita",sans-serif',
            fontSize:24
        }).setOrigin(0);
        this.add(costText);
    }

    abstract renderContents():void;
}