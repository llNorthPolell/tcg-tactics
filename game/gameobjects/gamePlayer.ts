import Player from "../data/player";

export default class GamePlayer{
    readonly id : number;    
    readonly playerInfo: Player;
    readonly color: number;
    
    constructor(id:number, playerInfo:Player, color:number){
        this.id=id;
        this.playerInfo=playerInfo;
        this.color=color;
    }


}