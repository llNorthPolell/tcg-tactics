import { CardData } from "../data/cardData";
import { Card } from "./cards/card";
import HeroCard from "./cards/heroCard";

export default class Deck{
    private cards:Card<CardData>[];
    private leader: HeroCard;

    constructor(cards:Card<CardData>[], leader:HeroCard){
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