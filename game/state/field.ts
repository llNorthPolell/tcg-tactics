
import { TilemapData } from "@/game/data/types/tilemapData";
import Landmark from "../gameobjects/landmarks/landmark";
import Unit from "../gameobjects/units/unit";
import SelectionTile from "../gameobjects/selectionTile";

export default class Field{
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
    readonly selectionTiles?: SelectionTile[][];


    constructor(mapData:TilemapData, landmarksByLocation:Map<string,Landmark>,selectionTiles:SelectionTile[][]){
        this.mapData = mapData;
        this.landmarksByLocation=landmarksByLocation;

        // TODO: Get this data in fieldGenerator
        this.landmarksByType=new Map();

        this.units=new Map();

        this.selectionTiles=selectionTiles;
    }

}