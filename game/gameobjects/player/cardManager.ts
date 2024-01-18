import { GAME_CONSTANT } from "@/game/enums/keys/gameConstants";
import Card from "../cards/card";
import Deck from "../cards/deck";
import GamePlayer from "./gamePlayer";
import { CARD_TYPE } from "@/game/enums/keys/cardType";

export default class CardManager{
    /**
     * Reference to parent
     */
    readonly player:GamePlayer;

    private deck: Card[];
    private hand:Card[];

    private deckLeader?:Card;

    constructor(player:GamePlayer, deck:Deck){
        this.player=player;
        this.hand=[];
        this.deck=deck.getCards();
        this.deckLeader=deck.getLeader();
    }

    drawCard(){
        const cardsLeft = this.deck.length;
        if(cardsLeft===0) return;

        let roll = Math.floor(Math.random()*this.deck.length);

        // Uncomment to debug handling situation of drawing hero card when at max hand size
        /*while (this.hand.length < GAME_CONSTANT.MAX_HAND_SIZE && this.deck[roll].cardType === CARD_TYPE.hero){
            console.log(`Testing: Rolled a hero, roll again!`);
            roll = Math.floor(Math.random()*this.deck.length);
        }*/

        const card = this.deck.splice(roll,1)[0];

        if(this.hand.length >= GAME_CONSTANT.MAX_HAND_SIZE){
            if (card.cardType === CARD_TYPE.hero)
                console.log("Maximum hand size reached! You've drawn a hero. Please discard a card from your hand.");
            else
                console.log(`Maximum hand size reached! Card ${card.name} was discarded...`)
            return;
        }

        this.insertCardToHand(card);
        return card;
    }


    insertCardToHand(card:Card){
        this.hand.push(card);
    }

    removeCardFromHand(cardToRemove:Card){
        this.hand = this.hand.filter(card=> card!==cardToRemove);
    }
    
    getHand(){
        return this.hand;
    }

    getLeader(){
        return this.deckLeader;
    }
}   