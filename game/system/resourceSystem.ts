import GamePlayer from "../gameobjects/player/gamePlayer";
import ResourceManager from "../gameobjects/player/resourceManager";

export default class ResourceSystem {
    private readonly resources: Map<number,ResourceManager>;

    constructor(playersInGame:GamePlayer[]){
        this.resources=new Map();

        playersInGame.forEach(
            player=>{
                this.resources.set(player.id,player.resources);
            }
        );
    }

    generate(activePlayer:GamePlayer){
        const resources = this.getResources(activePlayer);
        const income = resources.calculateIncome();
        resources.generate(income);
    }   

    spend(activePlayer:GamePlayer, cost:number){
        const resources = this.getResources(activePlayer);
        resources.spend(cost);
    }

    get(activePlayer:GamePlayer){
        const resources = this.getResources(activePlayer);
        return resources.get();
    }

    private getResources(activePlayer:GamePlayer){
        const resources = this.resources.get(activePlayer.id);

        if (!resources)
            throw new Error (`Failed to get resource manager for ${activePlayer.name}`);

        return resources;
    }
}