import Player from "../data/player";
import Deck from "./deck";

export default class GamePlayer{
    readonly id : number;    
    readonly playerInfo: Player;
    readonly color: number;
    readonly deck: Deck;
    private team: number;

    constructor(id:number, playerInfo:Player, team:number, color:number, deck:Deck){
        this.id=id;
        this.playerInfo=playerInfo;
        this.team=team;
        this.color=color;
        this.deck = deck;
    }

    setTeam(team:number){
        this.team=team;
    }

    getTeam(){
        return this.team;
    }

}