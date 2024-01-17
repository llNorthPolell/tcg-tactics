import { CARD_SIZE } from "@/game/config";
import GameObject from "../common/gameObject";
import Card from "./card";
import { loadImage } from "@/game/scripts/imageLoader";
import { ASSETS } from "@/game/enums/keys/assets";
import CardGOStats from "./cardGOStats";
import { CARD_TYPE } from "@/game/enums/keys/cardType";
import { Position } from "@/game/data/types/position";

export default class CardGO extends Phaser.GameObjects.Container implements GameObject{
    private card:Card;
    private stats?:CardGOStats;

    constructor(scene : Phaser.Scene, card:Card,initialPosition:Position){
        super(scene,initialPosition.x,initialPosition.y);
        this.renderCardBase(scene,card);
        this.card=card;
    }

    protected renderCardBase(scene : Phaser.Scene,card:Card){
        const cardType = card.cardType;

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
        loadImage(scene, image, cardType, card.id,CARD_SIZE.width*0.98, CARD_SIZE.height*0.98);


        const costBg = this.scene.add.circle(0,0,CARD_SIZE.width*0.15,0xd9d9d9)
            .setStrokeStyle(1,0x000000)
            .setOrigin(0);
        this.add(costBg);

        const costText = this.scene.add.text(CARD_SIZE.width*0.09,CARD_SIZE.width*0.025,String(card.cost),{
            color:'#000',
            fontFamily:'"Sansita",sans-serif',
            fontSize:24
        }).setOrigin(0);
        this.add(costText);

        this.stats = (card.cardType === CARD_TYPE.spell)? undefined: new CardGOStats(scene,this);
    }

    getCard(){
        return this.card;
    }

    getStats(){
        return this.stats;
    }

    updateActive(){}
}