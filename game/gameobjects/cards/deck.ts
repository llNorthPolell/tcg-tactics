import Card from "./card";

export default class Deck{
    constructor(
        private cards:Card[], 
        private leader: Card
    ){}

    getCards(){
        return this.cards;
    }

    getLeader(){
        return this.leader;
    }
}