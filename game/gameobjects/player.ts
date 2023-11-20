import { CARD_SIZE } from "../config";
import { Card } from "./cards/card";
import HeroCard from "./cards/heroCard";
import Unit from "./unit";

export default class Player{
    private id : number;
    

    private strongholds: any[]; //TODO: assign stronghold
    private availableRallyPoints:any; // TODO: make rally point object

    private resources: number;
    private resourcePerTurn: number;

    private unitsOnField:Unit[];

    private deck: Card[];
    private hand:Card[];
    private graveyard: Card[];

    private turnActive:boolean;

    constructor(id:number, deck:Card[]){
        this.id=id;
        this.deck=deck;
        this.hand=[];
        this.graveyard=[];
        this.unitsOnField=[];

        this.turnActive=false;

        this.strongholds=[];

        this.resources = 0;
        this.resourcePerTurn=1;
        
        this.drawCard();
        this.drawCard();
        this.drawCard();
    }

    getHandRef(){
        return this.hand;
    }

    playCard(card: HeroCard){
        this.resources -= card.data.cost;
        return card.play();
    }

    drawCard(){
        const cardsLeft = this.deck.length;
        if(cardsLeft===0) return;
        
        // fisher-yates style random draw
        const roll = Math.floor(Math.random()*this.deck.length);
        const card = this.deck.splice(roll,1)[0];
        card.setPosition(this.hand.length * CARD_SIZE.width,0);
        this.hand = [...this.hand,card];

        return card;
    }


    takeTurn(){
        this.turnActive=true;
    }

    endTurn(){
        this.turnActive=false;

        // TODO: notify turn manager
    }

}