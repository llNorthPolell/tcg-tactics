import Player from "@/game/data/player";
import ResourceManager from "./resourceManager";
import UnitManager from "./unitManager";

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
    private resources:ResourceManager;

    /**
     * Unit manager for access to active units, heroes, and the player's graveyard
     */
    private units:UnitManager;

    constructor(id:number,playerInfo:Player, color:number, team:number,isDevicePlayer:boolean=false){
        this.id=id;
        this.name=playerInfo.name;
        this.color=color;
        this.team=team;
        this.isDevicePlayer=isDevicePlayer;

        this.resources=new ResourceManager(this);
        this.units=new UnitManager(this);
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
    
    /**
     * Resource manager for access to generate and spend resources, and get resources on hand
     */
    getResourceManager() : ResourceManager{
        return this.resources;
    }

    /**
     * Unit manager for access to active units, heroes, and the player's graveyard
     */
    getUnitManager() : UnitManager{
        return this.units;
    }
}