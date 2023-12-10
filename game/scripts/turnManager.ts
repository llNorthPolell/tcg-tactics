import { EVENTS } from "../enums/keys/events";
import GamePlayer from "../gameobjects/gamePlayer";
import { EventEmitter } from "./events";

export default class TurnManager{
    private player: GamePlayer;
    private playersInGame:GamePlayer[];
    private turn:number;
    private activePlayerIndex: number;
    private activePlayer?:GamePlayer;

    constructor(player:GamePlayer, playersInGame:GamePlayer[]){ 
        this.player=player;
        this.playersInGame = playersInGame;
        console.log(`Param: ${JSON.stringify(playersInGame)}, Class Property: ${JSON.stringify(this.playersInGame)}`);
        this.activePlayerIndex = -1;
        this.turn = 1;

        EventEmitter.on(
            EVENTS.gameEvent.NEXT_TURN,
            ()=>{
                if (this.activePlayerIndex==this.playersInGame.length){
                    this.activePlayerIndex=-1;
                    this.turn++;
                }
                    
                this.activePlayerIndex++;
                this.activePlayer=this.playersInGame[this.activePlayerIndex];
        
                if (this.activePlayer == this.player)
                    EventEmitter.emit(EVENTS.gameEvent.PLAYER_TURN);
                else 
                    EventEmitter.emit(EVENTS.gameEvent.OPPONENT_TURN, this.activePlayerIndex);
            }
        ).on(
            EVENTS.gameEvent.END_TURN,
            ()=>{
                EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
            }
        )
        .on(
            EVENTS.gameEvent.OPPONENT_TURN,
            (playerNumber:number)=>{
                console.log(`Player ${playerNumber}'s turn...`);
                console.log(`Player ${playerNumber} is not implemented, so will pass...`);
                EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
            }
        );
    }

} 