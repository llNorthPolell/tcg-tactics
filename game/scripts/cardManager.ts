/*import { CARD_SIZE } from "../config";
import { CardData } from "../data/types/cardData";
import { Position } from "../data/types/position";
import { EVENTS } from "../enums/keys/events";
import { GAME_CONSTANT } from "../enums/keys/gameConstants";
import { Card } from "../gameobjects/cards/card";
import HeroCard from "../gameobjects/cards/heroCard";
import GamePlayer from "../gameobjects/gamePlayer";
import Unit from "../gameobjects/unit";
import { EventEmitter } from "./events";

export default class CardManager{
    private player: GamePlayer;

    private deck: Card<CardData>[];
    private hand:Card<CardData>[];
    private selected?: Card<CardData>;
    private cardToDiscard?: Card<CardData>;

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
                this.hand.forEach(
                    (card: Card<CardData>)=>{
                        if (isDevicePlayerTurn)
                            card.getGameObject()?.setInteractive();
                        else
                            card.getGameObject()?.disableInteractive();
                    }
                );

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
            }
        )
        .on(
            EVENTS.cardEvent.SELECT_DISCARD,
            (card:Card<CardData>)=>{
                if (card instanceof HeroCard){
                    console.log(`Cannot discard hero cards...`);
                    return;
                }
                console.log(`Select ${card.data.name} to discard...`);
                this.cardToDiscard = card;
            }
        )
        .on(
            EVENTS.cardEvent.CONFIRM_DISCARD,
            (heroCard:HeroCard, discard:Card<CardData>)=>{
                console.log(`Discarded ${discard.data.name}!`);
                this.removeCard(discard);
                console.log(`${heroCard.data.name} has been inserted into your hand!`);
                this.insertCard(heroCard);
            }
        )
        .on(
            EVENTS.cardEvent.CANCEL,
            ()=>{
                if (!this.selected) return;
                this.returnCard();
                this.selected=undefined;
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

        let roll = Math.floor(Math.random()*this.deck.length);

        // Uncomment to debug handling situation of drawing hero card when at max hand size
        while (this.hand.length < GAME_CONSTANT.MAX_HAND_SIZE && this.deck[roll] instanceof HeroCard){
            console.log(`Testing: Rolled a hero, roll again!`);
            roll = Math.floor(Math.random()*this.deck.length);
        }

        const card = this.deck.splice(roll,1)[0];

        if(this.hand.length >= GAME_CONSTANT.MAX_HAND_SIZE){
            if (card instanceof HeroCard){
                console.log("Maximum hand size reached! You've drawn a hero. Please discard a card from your hand.");
                EventEmitter.emit(EVENTS.uiEvent.UPDATE_HAND,this.getHand(),card);
                EventEmitter.emit(EVENTS.uiEvent.SHOW_DISCARD_WINDOW,card);
            }
            else
                console.log(`Maximum hand size reached! Card ${card.data.name} was discarded...`)
            EventEmitter.emit(EVENTS.uiEvent.UPDATE_DECK_COUNTER,this.deck.length);
            return;
        }

        this.insertCard(card);
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_DECK_COUNTER,this.deck.length);
        return card;
    }

    insertCard(card:Card<CardData>){
        card.setPosition({x:this.hand.length * CARD_SIZE.width,y:0});
        this.hand = [...this.hand,card];
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_HAND,this.getHand());
    }

    removeCard(cardToRemove:Card<CardData>){
        this.hand = this.hand.filter(card=> card!==cardToRemove);
        this.repositionCardsInHand();
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_HAND, this.hand);
    }

    removeSelected(){
        if(!this.selected) return;
        this.removeCard(this.selected);
        this.selected!.hide();
        this.selected=undefined;
    }

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
        this.changeSelectedCardPosition(
            this.selected?.getPosition().x,
            this.selected?.getPosition().y-(CARD_SIZE.height*0.05));
    }

    returnCard(){
        if(!this.selected) return;
        this.changeSelectedCardPosition(this.selected?.getPosition().x,0);
    }

    private changeSelectedCardPosition(x:number,y:number){
        if (!this.selected) return;
        const selectedCurrentPosition = this.selected.getPosition();
        if (selectedCurrentPosition.y===y) return;
        this.selected.setPosition({x,y});
    }
}*/