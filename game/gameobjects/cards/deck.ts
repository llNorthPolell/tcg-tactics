import Card from "./card";

export default class Deck{
    private cards:Card[];
    private leader: Card;

    constructor(cards:Card[], leader:Card){
        this.cards=cards;
        this.leader=leader;
    }

    getCards(){
        return this.cards;
    }

    getLeader(){
        return this.leader;
    }
}