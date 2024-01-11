import { CARD_SIZE } from "@/game/config";
import { CardData } from "@/game/data/cardData";
import HeroCardData from "@/game/data/cards/heroCardData";
import SpellCardData from "@/game/data/cards/spellCardData";
import { ASSETS } from "@/game/enums/keys/assets";
import { EVENTS } from "@/game/enums/keys/events";
import { EventEmitter } from "@/game/scripts/events";
import { loadImage } from "@/game/scripts/imageLoader";
import { Card } from "./card";

export default class CardGO extends Phaser.GameObjects.Container{
    constructor(scene : Phaser.Scene, card:Card<CardData>){
        super(scene,card.getPosition().x,card.getPosition().y);

        const cardType = (card.data instanceof SpellCardData)? "Spells" : 
            (card.data instanceof HeroCardData)? "Heroes": "Units";
        
        const color = (card.data instanceof SpellCardData)? 0x000077 : 
            (card.data instanceof HeroCardData)? 0x770000: 0x777700;


        const bg = this.scene.add.rectangle(0,0,CARD_SIZE.width, CARD_SIZE.height,color)
        .setOrigin(0,0)
        .setStrokeStyle(1,0x000000);

        this.add(bg);
        this.add(
            this.scene.add.text(
                CARD_SIZE.width*0.1,CARD_SIZE.height*0.5,card.data.name,
                {
                    fontFamily:'"Averia Serif Libre",serif',
                    fontSize:16
                }
            )
        );
        
        this.setInteractive(bg,Phaser.Geom.Rectangle.Contains).on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            ()=>{
                EventEmitter.emit(EVENTS.cardEvent.SELECT,card);
            }
        );

        let image = this.scene.add.sprite(CARD_SIZE.width*0.5,CARD_SIZE.height*0.5,ASSETS.UNDEFINED)
            .setDisplaySize(CARD_SIZE.width*0.9, CARD_SIZE.height*0.9)
            .setOrigin(0.5);

        this.add(image);
        loadImage(scene, image, cardType, card.data.id,CARD_SIZE.width*0.9, CARD_SIZE.height*0.9);
    }
}