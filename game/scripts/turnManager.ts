import { EVENTS } from "../enums/keys/events";
import GamePlayer from "../gameobjects/gamePlayer";
import { EventEmitter } from "./events";

export default class TurnManager{
    private playersInGame:GamePlayer[];
    private turn:number;
    private activePlayerIndex: number;
    private activePlayer?:GamePlayer;

    constructor(scene:Phaser.Scene, devicePlayer:GamePlayer, playersInGame:GamePlayer[]){ 
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
            (playerId:number,_activePlayerIndex:number,isDevicePlayerTurn:boolean)=>{
                if (isDevicePlayerTurn) return;

                // TODO: Currently make other players pass after 3 seconds for testing purposes. Add AI later.
                scene.time.addEvent({
                    delay: 3000, callback: ()=>{
                        this.pass(playerId);
                    }
                })
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

        EventEmitter.emit(EVENTS.gameEvent.PLAYER_TURN, this.activePlayer.id, this.activePlayerIndex,this.activePlayer.isDevicePlayer);        
    }

    //TODO: Temporary, causes AI to automatically pass
    pass(playerId:number){
        console.log(`Player ${playerId}'s turn...`);
        console.log(`Player ${playerId} is not implemented, so will pass...`);
        EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
    }
} 