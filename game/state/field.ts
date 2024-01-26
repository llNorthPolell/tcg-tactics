
import { TilemapData } from "@/game/data/types/tilemapData";
import Landmark from "../gameobjects/landmarks/landmark";
import Unit from "../gameobjects/units/unit";
import Game from "./gameState";
import SelectionTileController from "../gameobjects/selectionTiles/selectionTileController";

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
     * Selection tiles for selecting destinations and target positions
     */
    readonly selectionGrid: SelectionTileController[][];


    constructor(game:Game, mapData:TilemapData, landmarksByLocation:Map<string,Landmark>,selectionGrid:SelectionTileController[][]){
        this.game=game;
        this.mapData = mapData;
        this.landmarksByLocation=landmarksByLocation;

        // TODO: Get this data in fieldGenerator
        this.landmarksByType=new Map();

        this.units=new Map();
 
        this.selectionGrid=selectionGrid;
    }

}