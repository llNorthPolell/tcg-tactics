import { EVENTS } from "../enums/keys/events";
import { EventEmitter } from "../scripts/events";
import GameState from "../state/gameState";

export default class TurnController{    
    constructor(
        private readonly gameState:GameState
    ){}

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

    getDevicePlayer(){
        const devicePlayer = this.gameState.getDevicePlayer();

        if (!devicePlayer)
            throw new Error("Device player not found...")
        
        return devicePlayer;
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