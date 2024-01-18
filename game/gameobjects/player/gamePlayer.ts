import Player from "@/game/data/playerData";
import ResourceManager from "./resourceManager";
import UnitManager from "./unitManager";
import LandmarkManager from "./landmarkManager";
import CardManager from "./cardManager";

export default class GamePlayer{
    /**
     * Id of this player (in game)
     */
    readonly id : number;    
    
    /**
     * Name of this player
     */
    readonly name: string;

    /**
     * Color representing player's team
     */
    readonly color: number;

    /**
     * If true, UI will update accordingly with this player's information
     */
    readonly isDevicePlayer:boolean;

    /**
     * Number representing which team this player is on
     */
    private team: number;

    /**
     * Resource manager for access to generate and spend resources, and get resources on hand
     */
    readonly resources:ResourceManager;

    /**
     * Unit manager for access to active units, heroes, and the player's graveyard
     */
    readonly units:UnitManager;

    /**
     * Landmark manager for access to owned landmarks
     */
    readonly landmarks:LandmarkManager;

    /**
     * Card manager for access to deck and hand
     */
    readonly cards: CardManager;

    constructor(id:number,playerInfo:Player, color:number, team:number,isDevicePlayer:boolean=false){
        this.id=id;
        this.name=playerInfo.name;
        this.color=color;
        this.team=team;
        this.isDevicePlayer=isDevicePlayer;

        this.resources=new ResourceManager(this);
        this.units=new UnitManager(this);
        this.landmarks=new LandmarkManager(this);
        this.cards=new CardManager(this);
    }

    /**
     * Sets the player's team number
     * @param team Number representing which team this player is on
     */
    setTeam(team:number){
        this.team=team;
    }

    /**
     * @returns Number representing which team this player is on
     */
    getTeam():number{
        return this.team;
    }
}