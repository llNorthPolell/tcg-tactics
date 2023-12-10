import { CardData } from "@/game/data/cardData";
import { Card } from "../cards/card";

export default class HandUIObject extends Phaser.GameObjects.Container{

    constructor(scene:Phaser.Scene){
        super(scene,0,0);
    }

    
    render(hand: Card<CardData>[]){
        hand.forEach(card=>{
            const cardContainer = card.render(this.scene);
            this.add(cardContainer);
        });
    }
}