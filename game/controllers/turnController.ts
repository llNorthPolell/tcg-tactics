import Game from "../state/game";

export default class TurnController{    
    private readonly game:Game;

    constructor(game:Game){
        this.game=game;
    }

    endTurn(){
        this.game.goToNextPlayer();
    }

    //TODO: Temporary, causes AI to automatically pass
    pass(playerId:number){
        console.log(`Player ${playerId}'s turn...`);
        console.log(`Player ${playerId} is not implemented, so will pass...`);
        this.endTurn();
    }
}