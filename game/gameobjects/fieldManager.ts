import CapturableLandmark from "./landmarks/capturableLandmark";
import Stronghold from "./landmarks/stronghold";
import Player from "./player";
import Unit from "./unit";

export interface PlayerFieldData{
    player: Player,
    champions: Unit[],
    activeUnits: Unit[],   
    traps: any[], // TODO: Implement trap spell effects 
    capturables: CapturableLandmark[],
    stronghold?: Stronghold,
    rallyPoints: any[] // TODO: Implement rally points
}

export interface Field{
    neutral: {
        capturables: CapturableLandmark[];
    },
    players: PlayerFieldData[]
}

export default class FieldManager{

    private capturables : CapturableLandmark[];

    private strongholds : Stronghold[];

    private field: Field;

    //TODO: Correct implementation of map data (map object layers and map icons)
    constructor(players: Player[], mapData:any){
        this.capturables=[];
        this.strongholds=[];

        let initPlayerFieldData: PlayerFieldData[] = [];

        players.forEach(
            player=>{
                initPlayerFieldData = [
                    ...initPlayerFieldData,
                    {
                        player:player,
                        champions:[],
                        activeUnits: [],
                        traps: [],
                        capturables: [],
                        stronghold: undefined,
                        rallyPoints: []
                    }
                ]
            }
        )

        this.field = {
            neutral:{capturables:[]},
            players: initPlayerFieldData
        };
    }


}