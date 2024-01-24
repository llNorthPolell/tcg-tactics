import { Position } from "../data/types/position";
import { CARD_TYPE } from "../enums/keys/cardType";
import { EffectTrigger } from "../enums/keys/effectTriggers";
import { EVENTS } from "../enums/keys/events";
import { TARGET_TYPES } from "../enums/keys/targetTypes";
import { TileSelectionType } from "../enums/tileSelectionType";
import Card from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/player/gamePlayer";
import Unit from "../gameobjects/units/unit";
import { EventEmitter } from "../scripts/events";
import FieldSetupScripts from "../scripts/fieldSetupScripts";
import CombatSystem from "../system/combatSystem";
import EffectSystem from "../system/effectSystem";
import CardController from "./cardController";
import LandmarkController from "./landmarkController";
import SelectionGridController from "./selectionGridController";
import TurnController from "./turnController";
import UnitController from "./unitController";

export default class MainGameController {
    private readonly scene: Phaser.Scene;
    private readonly turn: TurnController;
    private readonly landmarks: LandmarkController;
    private readonly units: UnitController;
    private readonly selectionGrid: SelectionGridController;
    private readonly cards: CardController;
    private readonly effects: EffectSystem;
    private readonly combat:CombatSystem;

    constructor(scene: Phaser.Scene,
        landmarks: LandmarkController,
        turn: TurnController,
        units: UnitController,
        selectionGrid: SelectionGridController,
        cards: CardController,
        effects: EffectSystem,
        combat: CombatSystem) {
        this.scene = scene;
        this.landmarks = landmarks;
        this.turn = turn;
        this.units = units;
        this.selectionGrid = selectionGrid;
        this.cards = cards;
        this.effects = effects;
        this.combat=combat;
    }

// Game Events

    startGame() {
        const playersInGame = this.turn.getPlayersInGame();
        FieldSetupScripts.spawnDeckLeaders(this.scene, playersInGame, this.units, this.landmarks);
        playersInGame.forEach(
            (player: GamePlayer) => {
                for (let i = 0; i < 2; i++)
                    this.cards.drawCard(player);

                console.log(`${player.name}: ${JSON.stringify(this.cards.getHand(player).map(card => card.name))}`);
            }
        )
        this.turn.endTurn();
    }


    endTurn() {
        console.log("End Turn");
        const activePlayer = this.turn.getActivePlayer();

        // TODO: Ensure unit GO updates when changing active
        activePlayer.units.getAllActiveUnits().forEach(unit => {
            unit.effectHandler.applyOnTrigger(EffectTrigger.onTurnEnd);
            if (!unit.isActive()) return;
            unit.setActive(false);
            console.log(`${unit.name} has not moved, so it was set to inactive...`);
        });
        //this.effects.onTurnEnd(activePlayer);

        this.turn.endTurn();
    }


    startTurn(activePlayer: GamePlayer) {
        console.log(`${activePlayer.name}'s turn`);

        this.landmarks.updateLandmarks(activePlayer);

        const income = activePlayer.resources.calculateIncome();
        activePlayer.resources.increaseMax();
        activePlayer.resources.generate(income);

        this.cards.drawCard(activePlayer);
        
        activePlayer.units.getAllActiveUnits().forEach(unit => {
            unit.effectHandler.applyOnTrigger(EffectTrigger.onTurnStart);
            unit.setActive(true);
        });

        if (!activePlayer.isDevicePlayer)
            // TODO: Currently make other players pass after 3 seconds for testing purposes. Add AI later.

            if (this.turn.getTurnNumber()===1){
                this.selectUnit(this.units.getUnitByPosition({x:0,y:0})!);
                this.scene.time.addEvent({
                    delay: 1000, callback: () => {
                        this.moveUnitTo({x:2,y:0});
                        this.waitUnit();
                        this.endTurn();
                    }
                })
            }
            else if (this.turn.getTurnNumber()===5){
                this.selectUnit(this.units.getUnitByPosition({x:2,y:0})!);
                this.scene.time.addEvent({
                    delay: 2000, callback: () => {
                        this.moveUnitTo({x:2,y:2});
                        this.waitUnit();
                        this.endTurn();
                    }
                })
            }
            else
                this.scene.time.addEvent({
                    delay: 3000, callback: () => {
                        this.turn.pass(activePlayer.id);
                    }
                })
    }



// Card Events
    selectCard(card:Card){
        EventEmitter.emit(EVENTS.uiEvent.HIDE_SPELL_SELECTOR);
        this.selectionGrid.hide();
        const activePlayer = this.turn.getActivePlayer();
        if(card.getOwner()!== activePlayer) return;

        this.cards.selectCard(activePlayer,card);
        if (card.cardType!==CARD_TYPE.spell){
            this.selectionGrid.showRallyPoints(activePlayer);
            return;
        }

        const selectionType = card.targetType===TARGET_TYPES.position?
            TileSelectionType.PLAY_CARD:TileSelectionType.NONE;
        this.selectionGrid.showSpellRange(activePlayer,selectionType);
        EventEmitter.emit(EVENTS.uiEvent.SHOW_SPELL_SELECTOR,activePlayer,card.targetType);
    }


    cancelCard(){
        EventEmitter.emit(EVENTS.uiEvent.HIDE_SPELL_SELECTOR);
        const activePlayer = this.turn.getActivePlayer();
        this.cards.deselectCard(activePlayer);
        this.selectionGrid.hide();
    }

    playCard(target: Unit | Position) :boolean {
        const activePlayer = this.turn.getActivePlayer();
        const card = this.cards.getSelectedCard(activePlayer);
        const resources = activePlayer.resources;

        if (!card)
            throw new Error("Failed to play card; no card was selected...");

        
        resources.spend(card.cost);
        this.cancelCard();

        this.cards.removeCard(activePlayer, card);


        switch (card.cardType) {
            case CARD_TYPE.unit:
            case CARD_TYPE.hero:
                if (target instanceof Unit)
                    throw new Error("Invalid summon location...");
                this.playUnitCard(card, target);
                break;
            case CARD_TYPE.spell:
                if (!(target instanceof Unit))
                    throw new Error("Position target spells not implemented yet...");
                this.playSpellCard(card, target);
                break;
            default:
                break;
        }

        console.log(`Played ${card.name}!`)
        return true;
    }


    playUnitCard(card:Card,position:Position){
        this.units.summonUnitByCard(this.scene, card,position);
    }

    playSpellCard(card:Card,target:Unit){
        const effects = card.getEffects();

        if (!effects)
            throw new Error(`No effects were defined in ${card.name}...`);

        this.effects.cast(effects,target);
    }

// Unit Events
    selectUnit(unit:Unit){
        EventEmitter.emit(EVENTS.uiEvent.HIDE_ATTACK_SELECTOR);
        console.log(`select ${unit.name}`)
        if (unit === this.units.getSelected()) return;
        this.cancelUnitMove();
        this.units.selectUnit(unit);
        const position = unit.position()?.get();

        if (!position) 
            throw new Error(`The position controller for ${unit.id} has not been initialized...`);

        const movement = unit.getCurrentStats().mvt;
        const range = unit.getCurrentStats().rng;

        if (unit.isActive() && this.turn.isDevicePlayerTurn())
            this.selectionGrid.showMoves(position,movement,false);
        else
            this.selectionGrid.showAttackRange(position,range);

        if (unit.isActive())
            EventEmitter.emit(EVENTS.uiEvent.SHOW_ATTACK_SELECTOR,this.units.getSelected());
    }


    moveUnitTo(destination:Position){
        EventEmitter.emit(EVENTS.uiEvent.HIDE_ATTACK_SELECTOR);
        this.units.moveTo(destination);

        EventEmitter.emit(EVENTS.uiEvent.SHOW_ATTACK_SELECTOR,this.units.getSelected(),destination);
    }


    waitUnit(){
        const unit = this.units.getSelected();
        if(!unit)
            throw new Error("Failed to wait unit; no unit was selected...");

        const prevPosition = unit.position()?.get();
        
        if (!prevPosition)
            throw new Error(`Failed to wait unit; ${unit.name} does not have a game object defined...`);

        const oldLandmark = this.landmarks.getLandmarkAt(prevPosition);
        if(oldLandmark)
            this.landmarks.leaveLandmark(oldLandmark);    

        this.units.confirmMove();

        const position = unit.position()!.get();

        if (!position)
            throw new Error(`Failed to wait unit; ${unit.name} does not have a game object defined...`);

        const newLandmark = this.landmarks.getLandmarkAt(position);
        if(newLandmark)
            this.landmarks.enterLandmark(newLandmark,unit);
        this.selectionGrid.hide();

        EventEmitter.emit(EVENTS.uiEvent.HIDE_ATTACK_SELECTOR);
    }


    cancelUnitMove(){
        this.units.cancelMove();
        this.selectionGrid.hide();
        EventEmitter.emit(EVENTS.uiEvent.HIDE_ATTACK_SELECTOR);
    }


    attackUnit(target:Unit){
        const attacker = this.units.getSelected();
        if (!attacker)
            throw new Error("Failed to initiate fight; attacker is missing...");
        this.waitUnit();
        this.combat.initiateFight(attacker,target);
        
    }

    killUnit(unit:Unit){
        this.units.removeUnit(unit);
    }

// Get Data
    getActivePlayer(){
        return this.turn.getActivePlayer();
    }

}