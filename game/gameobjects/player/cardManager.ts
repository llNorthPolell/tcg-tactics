import Card from "../cards/card";
import Deck from "../cards/deck";
import GamePlayer from "./gamePlayer";

export default class CardManager{
    /**
     * Reference to parent
     */
    readonly player:GamePlayer;

    private deck?: Card[];
    private hand:Card[];
    private selected?: Card;

    private deckLeader?:Card;

    constructor(player:GamePlayer){
        this.player=player;
        this.hand=[];
    }

    setDeck(deck:Deck){
        this.deck=deck.getCards();
        this.deckLeader=deck.getLeader();
    }
}   