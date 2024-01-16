import Player from "../data/player";
import { LandmarksCollection } from "../data/types/landmarksCollection";
import { Position } from "../data/types/position";
import { Resources } from "../data/types/resources";
import { EVENTS } from "../enums/keys/events";
import { GAME_CONSTANT } from "../enums/keys/gameConstants";
import { LandmarkType } from "../enums/landmarkType";
import { EventEmitter } from "../scripts/events";
import UnitCard from "./cards/unitCard";
import Deck from "./deck";
import CapturableLandmark from "./landmarks/capturableLandmark";
import Outpost from "./landmarks/outpost";
import ResourceNode from "./landmarks/resourceNode";
import Stronghold from "./landmarks/stronghold";
import Unit from "./unit";

export default class GamePlayer{
    readonly id : number;    
    readonly playerInfo: Player;
    readonly color: number;
    readonly deck: Deck;
    readonly isDevicePlayer:boolean;
    private team: number;

    private activeChampions: Unit[];
    private activeUnits: Unit[];   
    private traps: any[]; // TODO: Implement trap spell effects 
    private landmarksOwned: LandmarksCollection;
    private graveyard: Unit[];

    private currResource: number;
    private maxResource:number;

    constructor(id:number, playerInfo:Player, team:number, color:number, deck:Deck,isDevicePlayer:boolean=false){
        this.id=id;
        this.playerInfo=playerInfo;
        this.team=team;
        this.color=color;
        this.deck = deck;
        this.isDevicePlayer=isDevicePlayer;

        deck.getCards().forEach(
            card=>{
                card.setOwner(this);
            }
        )

        this.activeChampions=[];
        this.activeUnits=[]; 
        this.traps=[];
        this.landmarksOwned={
            strongholds : [],
            outposts: [],
            resourceNodes: [],
            rallyPoints: [] 
        };
        this.graveyard=[];

        this.currResource=0;
        this.maxResource=2;

        EventEmitter.on(
            EVENTS.gameEvent.PLAYER_TURN,
            (activePlayerId:number,_activePlayerIndex:number)=>{
                if (activePlayerId!==id) return;
                if (this.maxResource<GAME_CONSTANT.RESOURCE_LIMIT)
                    this.maxResource++;

            }
        )
        .on(
            EVENTS.playerEvent.GENERATE_RESOURCES,
            (activePlayerId:number,income:number)=>{
                if (activePlayerId!==id) return;
                this.generateResources(income);
            }
        )
    }

    setTeam(team:number){
        this.team=team;
    }

    getTeam(){
        return this.team;
    }

    registerLandmark(landmark: CapturableLandmark) {
        const prevOwner = landmark.getOwner();

        // if landmark was already owned previously, remove it from other previous owner's possession
        if(prevOwner)
            prevOwner.unregisterLandmark(landmark);

        // Give landmark and all surrounding rally points to new owner
        if (landmark instanceof Stronghold)
            this.landmarksOwned.strongholds.push(landmark as Stronghold);
        else if (landmark instanceof Outpost)
            this.landmarksOwned.outposts.push(landmark as Outpost);
        else if (landmark instanceof ResourceNode)
            this.landmarksOwned.resourceNodes.push(landmark as ResourceNode);

        
        if (landmark instanceof Stronghold || landmark instanceof Outpost)
            landmark.getRallyPoints().forEach(
                rallyPoint=>{
                    rallyPoint.tile.tint=this.color;
                    this.landmarksOwned.rallyPoints = [...this.landmarksOwned.rallyPoints!,rallyPoint];
                }
            )
            
        landmark.capture(this);
        landmark.tile.tint = this.color;

        console.log(`${landmark.id} has been captured by ${this.playerInfo.name}`)
    }

    unregisterLandmark(landmark: CapturableLandmark){
        const prevOwner = landmark.getOwner();

        if (!prevOwner) return; 

        console.log(`Remove ${landmark.id} from ${landmark.getOwner()!.id}'s ownership...`);

        if (landmark instanceof Stronghold) {
            prevOwner.landmarksOwned.strongholds =
                prevOwner.landmarksOwned.strongholds.filter(stronghold => stronghold.id != landmark.id);
        }
        else if (landmark instanceof Outpost) {
            prevOwner.landmarksOwned.outposts =
                prevOwner.landmarksOwned.outposts.filter(outpost => outpost.id != landmark.id);
        }
        else if (landmark instanceof ResourceNode)
            prevOwner.landmarksOwned.resourceNodes =
                prevOwner.landmarksOwned.resourceNodes.filter(resourceNode => resourceNode.id != landmark.id);

        if (landmark instanceof Stronghold || landmark instanceof Outpost) {
            const rallyPointsToRemove = landmark.getRallyPoints();
                prevOwner.landmarksOwned.rallyPoints =
                prevOwner.landmarksOwned.rallyPoints?.filter(
                    currRallyPoint => !rallyPointsToRemove.find(rallyPoint => rallyPoint == currRallyPoint));
        }
    }

    registerUnit(unit: Unit){
        this.activeUnits=[...this.activeUnits,unit];
    }

    registerHero(unit:Unit){
        if (unit.card instanceof UnitCard) return;
        this.activeChampions=[...this.activeChampions,unit];
    }

    moveUnitToGraveyard(unit:Unit){
        if (unit.card instanceof UnitCard)
            this.activeUnits = this.activeUnits
                    .filter(activeUnit => activeUnit != unit);
        else 
            this.activeChampions = this.activeChampions
                    .filter(activeChampion => activeChampion != unit);

        this.graveyard.push(unit);
    }

    getLandmarkAt(landmarkType: LandmarkType, location:Position) : CapturableLandmark|undefined{
        switch(landmarkType){
            case LandmarkType.STRONGHOLD:
                return this.landmarksOwned.strongholds.find(stronghold=> stronghold.x == location.x && stronghold.y == location.y);
            case LandmarkType.OUTPOST:
                return this.landmarksOwned.outposts.find(outpost=> outpost.x == location.x && outpost.y == location.y);
            case LandmarkType.RESOURCE_NODE:
                return this.landmarksOwned.resourceNodes.find(resourceNode=> resourceNode.x == location.x && resourceNode.y == location.y);
        }
        return undefined;
    }

    getStartingStronghold() : Stronghold{
        return this.landmarksOwned.strongholds[0]!;
    }

    getLandmarksOwned(){
        return this.landmarksOwned;
    }

    getAllActiveUnits(){
        return [...this.activeUnits, ...this.activeChampions];
    }

    getActiveChampions(){
        return [...this.activeChampions];
    }
    
    getCasualties(){
        return this.graveyard.length;
    }

    generateResources(income: number){
        let newCurrentResource = this.currResource + income;
        if (newCurrentResource>this.maxResource)
            newCurrentResource=this.maxResource;

        this.currResource=newCurrentResource;

        if (!this.isDevicePlayer) return;
        
        EventEmitter.emit(EVENTS.uiEvent.UPDATE_RESOURCE_DISPLAY, this.currResource, this.maxResource, income);
    }

    spendResources(cost:number) {
        if (cost > this.currResource) 
            throw new Error("Not enough resources");

        this.currResource -= cost;

        if (!this.isDevicePlayer) return;

        EventEmitter.emit(EVENTS.uiEvent.UPDATE_RESOURCE_DISPLAY, this.currResource, this.maxResource);
    }

    getResources():Resources{
        return {
            current: this.currResource,
            max: this.maxResource
        }
    }

}