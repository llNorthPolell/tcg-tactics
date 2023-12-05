import { CardData } from "../data/cardData";
import { EVENTS } from "../enums/keys/events";
import { EventEmitter } from "../scripts/events";
import { Card } from "./cards/card";
import Unit from "./unit";

export default class Player{
    private id : number;
    
    private strongholds: any[]; //TODO: assign stronghold
    private availableRallyPoints:any; // TODO: make rally point object

    private currResource: number;
    private maxResource:number;
    private resourcePerTurn: number;

    private unitsOnField:Unit[];

    private turnActive:boolean;

    constructor(id:number){
        this.id=id;
        this.unitsOnField=[];

        this.turnActive=false;

        this.strongholds=[];

        this.currResource = 0;
        this.maxResource=2;
        this.resourcePerTurn=2;

        EventEmitter.on(
            EVENTS.gameEvent.PLAYER_TURN,
            ()=>{
                this.takeTurn();
            }
        )
    }

    spendResources(card: Card<CardData>) {
        const cost = card.data.cost;

        if (cost > this.currResource) 
            throw new Error("Not enough resources");

        this.currResource -= cost;
    }

    getResources(){
        return {
            current: this.currResource,
            max: this.maxResource,
            perTurn: this.resourcePerTurn
        }
    }


    takeTurn(){
        this.turnActive=true;

        this.generateResources();
    }

    generateResources(){
        let newCurrentResource = this.currResource+ this.resourcePerTurn;
        if (newCurrentResource>this.maxResource)
            newCurrentResource=this.maxResource;

        this.currResource=newCurrentResource;
    }


    endTurn(){
        this.turnActive=false;

        // TODO: notify turn manager
    }

}