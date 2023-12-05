import { CARD_SIZE } from "../config";
import { CardData } from "../data/cardData";
import { EVENTS } from "../enums/keys/events";
import { Card } from "../gameobjects/cards/card";
import Player from "../gameobjects/player";
import { EventEmitter } from "./events";

export default class CardManager{
    private player: Player;

    private deck: Card<CardData>[];
    private hand:Card<CardData>[];
    private graveyard: Card<CardData>[];

    private selected?: Card<CardData>;
    
    constructor(player:Player,deck:Card<CardData>[]){
        this.player= player;
        this.deck=deck;
        this.hand=[];
        this.graveyard=[];

        this.drawCard();
        this.drawCard();
        this.drawCard();

        EventEmitter
        .on(
            EVENTS.cardEvent.SELECT,
            (card : Card<CardData>)=>{
                this.returnCard();
                this.selected = card;
                this.pullOutCard();                
                console.log(`Selected card#${this.selected.id}`);
            }
        )
        .on(
            EVENTS.cardEvent.DESELECT,
            ()=>{
                if (!this.selected) return;
                this.returnCard();
                this.selected=undefined;
                console.log(`Deselected card`);
            }
        )
        .on(
            EVENTS.cardEvent.PLAY,
            ()=>{
                if (!this.selected){
                    console.log("No card is selected...");
                    return;
                }
                console.log(`Play the card ${this.selected?.data.name}`)
                this.playCard();
            }
        )
 
    }

    getHand(){
        return [...this.hand];
    }

    playCard(){
        if (!this.selected){
            console.log("No card is selected...");
            return;
        }

        try{
            const card = this.selected;
            this.player.spendResources(card);
            card.play();
        }
        catch(error){
            console.log((error as Error).message);
        }
        finally{
            EventEmitter.emit(EVENTS.cardEvent.DESELECT);
        }
    }

    drawCard(){
        const cardsLeft = this.deck.length;
        if(cardsLeft===0) return;
        
        const roll = Math.floor(Math.random()*this.deck.length);
        const card = this.deck.splice(roll,1)[0];
        card.setPosition(this.hand.length * CARD_SIZE.width,0);
        this.hand = [...this.hand,card];

        return card;
    }

    pullOutCard(){
        if(!this.selected) return;
        const selectedCurrentPosition = this.selected.getPosition();
        if (selectedCurrentPosition.y !== 0) return;
        const selectedNewPosition = {
            ...selectedCurrentPosition,
            y:selectedCurrentPosition.y-(CARD_SIZE.height*0.05)
        }
        this.selected.setPosition(selectedNewPosition.x,selectedNewPosition.y);
    }

    returnCard(){
        if (!this.selected) return;
        const selectedCurrentPosition = this.selected.getPosition();
        if (selectedCurrentPosition.y===0) return;
        const selectedNewPosition = {
            ...selectedCurrentPosition,
            y:0
        }
        this.selected.setPosition(selectedNewPosition.x,selectedNewPosition.y);
    }
}