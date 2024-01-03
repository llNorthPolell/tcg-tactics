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
        this.playersInGame = [...playersInGame];
        console.log(`Param: ${JSON.stringify(playersInGame)}, Class Property: ${JSON.stringify(this.playersInGame)}`);
        this.activePlayerIndex = -1;
        this.turn = 1;

        EventEmitter.on(
            EVENTS.gameEvent.NEXT_TURN,
            ()=>{
                if (this.activePlayerIndex==this.playersInGame.length-1){
                    this.activePlayerIndex=-1;
                    this.turn++;
                }
                    
                this.activePlayerIndex++;
                this.activePlayer=this.playersInGame[this.activePlayerIndex];
        
                console.log(`Active Player: ${JSON.stringify(this.activePlayer)}`);
                if (this.activePlayer == this.player)
                    EventEmitter.emit(EVENTS.gameEvent.PLAYER_TURN);
                else 
                    EventEmitter.emit(EVENTS.gameEvent.NON_PLAYER_TURN, this.activePlayer.id);
            }
        ).on(
            EVENTS.gameEvent.END_TURN,
            ()=>{
                EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
            }
        )
        .on(
            EVENTS.gameEvent.NON_PLAYER_TURN,
            (playerId:number)=>{
                console.log(`Player ${playerId}'s turn...`);
                console.log(`Player ${playerId} is not implemented, so will pass...`);
                EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
            }
        );
    }

} 