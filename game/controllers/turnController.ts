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
    
    isDevicePlayerTurn(){
        return this.getActivePlayer().isDevicePlayer;
    }
    
    //TODO: Temporary, causes AI to automatically pass
    pass(playerId:number){
        console.log(`Player ${playerId}'s turn...`);
        console.log(`Player ${playerId} is not implemented, so will pass...`);
        this.endTurn();
    }
}