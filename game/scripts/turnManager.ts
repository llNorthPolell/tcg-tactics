import Player from "../gameobjects/player";
import { EventEmitter } from "./events";

export default class TurnManager{
    private players:Player[];
    private turn:number;
    private activePlayerIndex: number;
    private activePlayer?:Player;

    constructor(players=[]){ 
        this.players = players;
        this.activePlayerIndex = 1;
        this.turn = 1;

        EventEmitter.on(
            'turn-end',
            this.next,
            this
        );
    }


    next(){
        if (this.activePlayerIndex==this.players.length){
            this.activePlayerIndex=-1;
            this.turn++;
        }
            
        this.activePlayerIndex++;
        this.activePlayer=this.players[this.activePlayerIndex];

    }
} 