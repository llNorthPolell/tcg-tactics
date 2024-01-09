import { CARD_SIZE } from "../config";
import { CardData } from "../data/cardData";
import { Position } from "../data/types/position";
import { EVENTS } from "../enums/keys/events";
import { Card } from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/gamePlayer";
import Unit from "../gameobjects/unit";
import { EventEmitter } from "./events";

export default class CardManager{
    private player: GamePlayer;

    private deck: Card<CardData>[];
    private hand:Card<CardData>[];
    private selected?: Card<CardData>;

    constructor(player:GamePlayer){
        this.player= player;
        this.deck=player.deck.getCards();
        this.hand=[];
        
        this.handleEvents(); 
    }

    private handleEvents(){
        EventEmitter
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (_activePlayerId:number,_activePlayerIndex:number, isDevicePlayerTurn:boolean)=>{
                if (!isDevicePlayerTurn) return;

                this.drawCard();
            }
        )
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
            EVENTS.cardEvent.CANCEL,
            ()=>{
                if (!this.selected) return;
                this.returnCard();
                this.selected=undefined;
                console.log(`Deselected card`);
            }
        )
        .on(
            EVENTS.cardEvent.PLAY,
            (target?: Unit | Position)=>{
                if (!this.selected){
                    console.log("No card is selected...");
                    return;
                }

                this.playCard(target);
            }
        )
    }

    getHand(){
        return [...this.hand];
    }

    playCard(target?: Unit | Position){
        if (!this.selected){
            console.log("No card is selected...");
            return;
        }

        try{
            this.player.spendResources(this.selected.data.cost);
            this.selected.play(target);
            this.removeSelected();
        }
        catch(error){
            console.log((error as Error).message);
        }
        finally{
            EventEmitter.emit(EVENTS.cardEvent.CANCEL);
        }
    }

    drawCard(){
        const cardsLeft = this.deck.length;
        if(cardsLeft===0) return;
        
        const roll = Math.floor(Math.random()*this.deck.length);
        const card = this.deck.splice(roll,1)[0];
        card.setPosition({x:this.hand.length * CARD_SIZE.width,y:0});
        this.hand = [...this.hand,card];
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_HAND,this.getHand());
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_DECK_COUNTER,this.deck.length);
        return card;
    }

    /**
     * Deselects card and redraws them
     */
    removeSelected(){
        this.hand = this.hand.filter(card=> card!==this.selected);
        this.selected!.hide();
        this.selected=undefined;
        this.repositionCardsInHand();
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_HAND, this.hand);
    }

    /**
     * Sets positions and redraws cards in hand
     */
    repositionCardsInHand(){
        let c=0;
        this.hand.forEach(
            card=>{
                card.setPosition({x:c*CARD_SIZE.width,y:0});
                c++;
            }
        )
    }

    pullOutCard(){
        if(!this.selected) return;
        const selectedCurrentPosition = this.selected.getPosition();
        if (selectedCurrentPosition.y !== 0) return;
        const selectedNewPosition = {
            ...selectedCurrentPosition,
            y:selectedCurrentPosition.y-(CARD_SIZE.height*0.05)
        }
        this.selected.setPosition({x:selectedNewPosition.x,y:selectedNewPosition.y});
    }

    returnCard(){
        if (!this.selected) return;
        const selectedCurrentPosition = this.selected.getPosition();
        if (selectedCurrentPosition.y===0) return;
        const selectedNewPosition = {
            ...selectedCurrentPosition,
            y:0
        }
        this.selected.setPosition({x:selectedNewPosition.x,y:selectedNewPosition.y});
    }
}