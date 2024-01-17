import { Resources } from "@/game/data/types/resources";
import GamePlayer from "./gamePlayer";

export default class ResourceManager{
    /**
     * Reference to parent
     */
    private player:GamePlayer;

    /**
     * Current resources on hand
     */
    private currResource: number;

    /**
     * Maximum resources player can hold on hand
     */
    private maxResource:number;

    constructor(player:GamePlayer){
        this.player=player;
        this.currResource=0;
        this.maxResource=2;
    }

    /**
     * Gives the player the specified amount of resources
     * @param income Amount of resources to give to this player
     */
    generate(income: number){
        let newCurrentResource = this.currResource + income;
        if (newCurrentResource>this.maxResource)
            newCurrentResource=this.maxResource;

        this.currResource=newCurrentResource;

        if (!this.player.isDevicePlayer) return;
    }

    /**
     * Reduces the number of resources from the player's hand
     * @param cost Amount of resources to consume
     * @throws Error when consuming more resources than on hand
     */
    spend(cost:number) {
        if (cost > this.currResource) 
            throw new Error("Not enough resources");

        this.currResource -= cost;
    }


    /**
     * @returns resources on hand and the maximum resources the player can hold
     */
    get():Resources{
        return {
            current: this.currResource,
            max: this.maxResource
        }
    }
}