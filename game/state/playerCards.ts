import Card from "../gameobjects/cards/card";
import Deck from "../gameobjects/cards/deck";
import GamePlayer from "../gameobjects/player/gamePlayer";

export default class PlayerCards{
    private readonly player: GamePlayer;

    private deck:Card[];
    private hand:Card[];

    constructor(player: GamePlayer, deck:Deck){
        this.player=player;
        this.deck=deck.getCards();
        this.hand=[];
    }   

    insertCardIntoHand(card:Card){
        this.hand.push(card);
    }

    getIndexInHand(card:Card){
        const cardIndex = this.hand.findIndex(card => card === card);
        if (cardIndex === -1)
            throw new Error(`${card.name} was not in the player's hand!`);
        return cardIndex;
    }


    removeCardFromHand(card:Card){
        const cardIndex=this.getIndexInHand(card);
        this.hand=this.hand.toSpliced(cardIndex,1);
    }

    getHand(){
        return this.hand;
    }


    getDeck(){
        return this.deck;
    }



}