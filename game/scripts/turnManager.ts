import { EVENTS } from "../enums/keys/events";
import GamePlayer from "../gameobjects/gamePlayer";
import { EventEmitter } from "./events";

export default class TurnManager{
    private devicePlayer: GamePlayer;
    private playersInGame:GamePlayer[];
    private turn:number;
    private activePlayerIndex: number;
    private activePlayer?:GamePlayer;

    constructor(scene:Phaser.Scene, devicePlayer:GamePlayer, playersInGame:GamePlayer[]){ 
        this.devicePlayer=devicePlayer;
        this.playersInGame = [...playersInGame];
        this.activePlayerIndex = -1;
        this.turn = 1;

        EventEmitter.on(
            EVENTS.gameEvent.NEXT_TURN,
            ()=>{
                this.goToNextTurn();
            }
        )
        .on(
            EVENTS.gameEvent.PLAYER_TURN,
            (playerId:number)=>{
                if (playerId == this.devicePlayer.id) return;

                // TODO: Currently make other players pass after 3 seconds for testing purposes. Add AI later.
                /*scene.time.addEvent({
                    delay: 3000, callback: ()=>{*/
                        this.pass(playerId);
                /*    }
                })*/
            }
        );
    }

    goToNextTurn(){
        if (this.activePlayerIndex==this.playersInGame.length-1){
            this.activePlayerIndex=-1;
            this.turn++;
        }
            
        this.activePlayerIndex++;
        this.activePlayer=this.playersInGame[this.activePlayerIndex];

        console.log(`Active Player: ${this.activePlayer.playerInfo.name}, Active Player Index: ${this.activePlayerIndex}`);
        console.log(`Active Player ID: ${this.activePlayer.id}, The Device Player ID: ${this.devicePlayer.id}`);

        const isDevicePlayerTurn = this.activePlayer.id === this.devicePlayer.id;
        EventEmitter.emit(EVENTS.gameEvent.PLAYER_TURN, this.activePlayer.id, this.activePlayerIndex,isDevicePlayerTurn);        
    }

    //TODO: Temporary, causes AI to automatically pass
    pass(playerId:number){
        console.log(`Player ${playerId}'s turn...`);
        console.log(`Player ${playerId} is not implemented, so will pass...`);
        EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
    }
} 