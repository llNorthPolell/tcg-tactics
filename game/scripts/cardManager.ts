import { CARD_SIZE } from "../config";
import { CardData } from "../data/cardData";
import { Position } from "../data/types/position";
import { RESOURCE_LIMIT, Resources } from "../data/types/resources";
import { EVENTS } from "../enums/keys/events";
import { Card } from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/gamePlayer";
import { EventEmitter } from "./events";

export default class CardManager{
    private player: GamePlayer;

    private deck: Card<CardData>[];
    private hand:Card<CardData>[];
    private selected?: Card<CardData>;
    
    private currResource: number;
    private maxResource:number;

    constructor(player:GamePlayer){
        this.player= player;
        this.deck=player.deck.getCards();
        this.hand=[];

        this.currResource=0;
        this.maxResource=2;
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_RESOURCE_DISPLAY, this.currResource, this.maxResource);
        this.handleEvents(); 
    }

    private handleEvents(){
        EventEmitter
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (_activePlayerId:number,_activePlayerIndex:number, isDevicePlayerTurn:boolean)=>{
                if (!isDevicePlayerTurn) return;
                if (this.maxResource<RESOURCE_LIMIT)
                    this.maxResource++;

                this.drawCard();
            }
        )
        .on(
            EVENTS.playerEvent.GENERATE_RESOURCES,
            (income:number)=>{
                this.generateResources(income);
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
            (location: Position)=>{
                if (!this.selected){
                    console.log("No card is selected...");
                    return;
                }
                console.log(`Play the card ${this.selected?.data.name} at ${JSON.stringify(location)}`)
                this.playCard(location);
            }
        )
    }

    generateResources(income: number){
        let newCurrentResource = this.currResource + income;
        if (newCurrentResource>this.maxResource)
            newCurrentResource=this.maxResource;

        this.currResource=newCurrentResource;
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_RESOURCE_DISPLAY, this.currResource, this.maxResource)
    }

    spendResources(card: Card<CardData>) {
        const cost = card.data.cost;

        if (cost > this.currResource) 
            throw new Error("Not enough resources");

        this.currResource -= cost;

        EventEmitter.emit(EVENTS.uiEvent.UPDATE_RESOURCE_DISPLAY, this.currResource, this.maxResource)
    }

    getResources():Resources{
        return {
            current: this.currResource,
            max: this.maxResource
        }
    }

    getHand(){
        return [...this.hand];
    }

    playCard(location:Position){
        if (!this.selected){
            console.log("No card is selected...");
            return;
        }

        try{
            this.spendResources(this.selected);
            this.selected.play(location);
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
        card.setPosition(this.hand.length * CARD_SIZE.width,0);
        this.hand = [...this.hand,card];
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_HAND,this.getHand());

        return card;
    }

    removeSelected(){
        this.hand = this.hand.filter(card=> card!==this.selected);
        this.selected!.hide();
        this.selected=undefined;
        this.repositionCardsInHand();
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_HAND, this.hand);
    }

    repositionCardsInHand(){
        let c=0;
        this.hand.forEach(
            card=>{
                card.setPosition(c*CARD_SIZE.width,0);
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