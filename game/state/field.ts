
import { TilemapData } from "@/game/data/types/tilemapData";
import Landmark from "../gameobjects/landmarks/landmark";
import Unit from "../gameobjects/units/unit";
import SelectionTile from "../gameobjects/selectionTile";
import Game from "./gameState";

export default class Field{
    private readonly game:Game;
    /**
     * Contains low level data relating to map
     */
    readonly mapData: TilemapData;

    /**
     * Landmarks on the field grouped by landmark type 
     * @note key = landmark type (i.e. stronghold, outpost, resource_node, etc.)
     * @note value = reference to the corresponding landmark object
     */
    readonly landmarksByType: Map<string, Landmark[]>;

    /**
     * Landmarks on the field stored by location
     * @note key = landmark type (i.e. stronghold, outpost, resource_node, etc.)
     * @note value = reference to the corresponding landmark object
     */
    readonly landmarksByLocation: Map<string,Landmark>;

    /**
     * Units on the field stored by location
     */
    readonly units: Map<string,Unit>;
    
    /**
     * Units on the field stored by player
     */
    readonly unitsByPlayer: Map<number,Unit[]>;
    
    /**
     * Selection tiles for selecting destinations and target positions
     */
    readonly selectionTiles: SelectionTile[][];


    constructor(game:Game, mapData:TilemapData, landmarksByLocation:Map<string,Landmark>,selectionTiles:SelectionTile[][]){
        this.game=game;
        this.mapData = mapData;
        this.landmarksByLocation=landmarksByLocation;

        // TODO: Get this data in fieldGenerator
        this.landmarksByType=new Map();

        this.units=new Map();
        this.unitsByPlayer=new Map();

        game.getPlayers().forEach(
            player=>{
                this.unitsByPlayer.set(player.id,[]);
            }
        );
        
        this.selectionTiles=selectionTiles;
    }

}