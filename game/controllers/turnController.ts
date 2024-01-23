import { EVENTS } from "../enums/keys/events";
import { EventEmitter } from "../scripts/events";
import GameState from "../state/gameState";

export default class TurnController{    
    private readonly gameState:GameState;

    constructor(gameState:GameState){
        this.gameState=gameState;
    }

    endTurn(){
        this.gameState.goToNextPlayer();
    }

    getActivePlayer(){
        return this.gameState.getActivePlayer();
    }
    
    getPlayersInGame(){
        return this.gameState.playersInGame;
    }

    isDevicePlayerTurn(){
        return this.getActivePlayer().isDevicePlayer;
    }
    
    //TODO: Temporary, causes AI to automatically pass
    pass(playerId:number){
        console.log(`Player ${playerId}'s turn...`);
        console.log(`Player ${playerId} is not implemented, so will pass...`);
        EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
    }

    getTurnNumber(){
        return this.gameState.getTurnNumber();
    }
}