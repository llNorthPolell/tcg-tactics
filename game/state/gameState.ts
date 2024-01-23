import { EVENTS } from "@/game/enums/keys/events";
import GamePlayer from "../gameobjects/player/gamePlayer";
import { EventEmitter } from "@/game/scripts/events";

export default class GameState{
    readonly playersInGame: GamePlayer[];
    private activePlayerIndex:number;
    private turn:number;

    constructor(playersInGame:GamePlayer[]){
        this.playersInGame=playersInGame;

        this.activePlayerIndex=-1;
        this.turn = 0;
    }

    goToNextPlayer(){
        if (this.activePlayerIndex==this.playersInGame.length-1)
            this.goToNextTurn();
        
        this.activePlayerIndex++;
        const activePlayer=this.playersInGame[this.activePlayerIndex];

        EventEmitter.emit(EVENTS.gameEvent.PLAYER_TURN, activePlayer);        
    }

    private goToNextTurn(){
        this.activePlayerIndex=-1;
        this.turn++;
    }

    getActivePlayer(){
        return this.playersInGame[this.activePlayerIndex];
    }

    getPlayers(){
        return this.playersInGame;
    }

    getTurnNumber(){
        return this.turn;
    }
}