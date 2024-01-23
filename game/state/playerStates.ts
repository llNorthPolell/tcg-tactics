import GamePlayer from "../gameobjects/player/gamePlayer";
import PlayerCards from "./playerCards";

export default class PlayerStates{
    readonly playersInGame: GamePlayer[];
    readonly cards: PlayerCards;

    constructor(playersInGame: GamePlayer[], cards:PlayerCards){
        this.playersInGame=playersInGame;
        this.cards = cards;
    }   
}