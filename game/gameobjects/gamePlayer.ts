import Player from "../data/player";
import Deck from "./deck";

export default class GamePlayer{
    readonly id : number;    
    readonly playerInfo: Player;
    readonly color: number;
    readonly deck: Deck;

    constructor(id:number, playerInfo:Player, color:number, deck:Deck){
        this.id=id;
        this.playerInfo=playerInfo;
        this.color=color;
        this.deck = deck;
    }


}