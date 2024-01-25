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
    /**
     * Scene where game objects are created
     */
    private readonly scene: Phaser.Scene;

    /**
     * Controller for managing turn-based system
     */
    private readonly turn: TurnController;

    /**
     * Controller for managing landmarks (capturing, buffing occupants, etc.)
     */
    private readonly landmarks: LandmarkController;

    /**
     * Controller for managing units (summoning, selecting, moving, etc.)
     */
    private readonly units: UnitController;

    /**
     * Controller for managing selection grid (show and hide selection tiles)
     */
    private readonly selectionGrid: SelectionGridController;

    /**
     * Controller for managing cards (draw, select, remove)
     */
    private readonly cards: CardController;

    /**
     * Centralized system for managing skill effects in play
     */
    private readonly effects: EffectSystem;

    /**
     * Centralized system for managing fights
     */
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

    /**
     * Called at the very beginning of the game to do final setup of the game
     */
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

    /**
     * Called when the player clicks the "End Turn" button
     */
    endTurn() {
        console.log("End Turn");

        this.turn.getPlayersInGame().forEach(
            player=>{
                this.cancelUnitMove(player);
            }
        )

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

    /**
     * Called after end turn. Players will draw cards and generate income. 
     * Units will attempt to capture unowned landmarks and apply onTurnStart effects.
     * @param activePlayer The player who is taking the turn
     */
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
                this.selectUnit(this.units.getUnitByPosition({x:0,y:0})!,activePlayer);
                this.scene.time.addEvent({
                    delay: 1000, callback: () => {
                        this.moveUnitTo({x:2,y:0},activePlayer);
                        this.waitUnit(activePlayer);
                        EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
                    }
                })
            }
            else if (this.turn.getTurnNumber()===5){
                this.selectUnit(this.units.getUnitByPosition({x:2,y:0})!,activePlayer);
                this.scene.time.addEvent({
                    delay: 2000, callback: () => {
                        this.moveUnitTo({x:2,y:2},activePlayer);
                        this.waitUnit(activePlayer);
                        EventEmitter.emit(EVENTS.gameEvent.NEXT_TURN);
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
    /**
     * Call to select a card from hand. Selection tiles and appropriate spell selectors should be 
     * highlighted. If the card is not from the active player's hand, an error should be thrown.
     * @param card The card that was selected
     */
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

    /**
     * Call to deselect a card from hand. Selection tiles and spell selectors should be hidden.
     */
    cancelCard(){
        EventEmitter.emit(EVENTS.uiEvent.HIDE_SPELL_SELECTOR);
        const activePlayer = this.turn.getActivePlayer();
        this.cards.deselectCard(activePlayer);
        this.selectionGrid.hide();
    }

    /**
     * Call to play a card onto the target unit or location (depending on whether card is a spell or unit).
     * If the active player does not have enough resources, an error should be thrown.
     * @param target Location or Unit to play the card
     */
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
                this.playSpellCard(activePlayer,card, target);
                break;
            default:
                break;
        }

        console.log(`Played ${card.name}!`)
        return true;
    }

    /**
     * Call to play a unit or hero card.
     * @param card The card that is being played
     * @param position The location to summon the unit in tiles
     */
    playUnitCard(card:Card,position:Position){
        this.units.summonUnitByCard(this.scene, card,position);
    }

    /**
     * Call to play a single target spell card.
     * @param card The card that is being played
     * @param target The unit or location to apply the spell
     */
    playSpellCard(sourcePlayer:GamePlayer,card:Card,target:Unit|Position){
        const effects = card.getEffects();

        if (!effects)
            throw new Error(`No effects were defined in ${card.name}...`);

        this.effects.cast(sourcePlayer,effects,target);
    }

// Unit Events
    /**
     * Call to select a unit. All existing selectors should be hidden first. The previous selected unit
     * should be deselected first. Show all applicable selection tiles and attack selectors.
     * @param unit The unit to select
     */
    selectUnit(unit:Unit, selectingPlayer:GamePlayer=this.turn.getDevicePlayer()){
        EventEmitter.emit(EVENTS.uiEvent.HIDE_ATTACK_SELECTOR);
        EventEmitter.emit(EVENTS.uiEvent.HIDE_SPELL_SELECTOR);
        console.log(`select ${unit.name}`)
        
        if (unit === selectingPlayer.units.getSelected()) return;

        this.cancelUnitMove();
        this.units.selectUnit(selectingPlayer,unit);
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
            EventEmitter.emit(EVENTS.uiEvent.SHOW_ATTACK_SELECTOR,unit);
    }

    /**
     * Call to move the selected unit to a location. Unit should still be active once moved.
     * To confirm the move, the player must click the "Wait" button or attack an enemy unit.
     * @param destination The location to move the unit.
     */
    moveUnitTo(destination:Position,selectingPlayer:GamePlayer=this.turn.getDevicePlayer()){
        EventEmitter.emit(EVENTS.uiEvent.HIDE_ATTACK_SELECTOR);
        const unit = this.units.getSelected(selectingPlayer);
        if(!unit) 
            throw new Error("No unit was selected...");
        this.units.moveTo(unit,destination);

        EventEmitter.emit(EVENTS.uiEvent.SHOW_ATTACK_SELECTOR,unit,destination);
    }

    /**
     * Call to confirm a unit's move without attacking an enemy. The previous landmark should unregister
     * the unit from its occupancy and the any new landmark should register the new unit as its occupant. 
     */
    waitUnit(selectingPlayer:GamePlayer=this.turn.getDevicePlayer()){
        const unit = this.units.getSelected(selectingPlayer);
        if(!unit)
            throw new Error("Failed to wait unit; no unit was selected...");

        const prevPosition = unit.position()?.get();
        
        if (!prevPosition)
            throw new Error(`Failed to wait unit; ${unit.name} does not have a game object defined...`);

        const oldLandmark = this.landmarks.getLandmarkAt(prevPosition);

        this.units.confirmMove(selectingPlayer,unit);
        EventEmitter.emit(EVENTS.uiEvent.HIDE_ATTACK_SELECTOR);
        this.selectionGrid.hide();

        const position = unit.position()!.get();

        if (!position)
            throw new Error(`Failed to wait unit; ${unit.name} does not have a game object defined...`);

        const newLandmark = this.landmarks.getLandmarkAt(position);
    
        if (oldLandmark == newLandmark) return;
        if(oldLandmark)
            this.landmarks.leaveLandmark(oldLandmark);    
        if(newLandmark)
            this.landmarks.enterLandmark(newLandmark,unit);
    }

    /**
     * Called when the unit wants to deselect a unit. Attack selectors and highlighted tiles 
     * should be hidden. The unit should be moved back to its original position.
     */
    cancelUnitMove(selectingPlayer:GamePlayer=this.turn.getDevicePlayer()){
        this.units.cancelMove(selectingPlayer);
        this.selectionGrid.hide();
        EventEmitter.emit(EVENTS.uiEvent.HIDE_ATTACK_SELECTOR);
    }

    /**
     * Called to have the selected unit attack an enemy unit. The combat system should be called
     * to initiate a fight.
     * @param target The enemy unit to attack
     */
    attackUnit(target:Unit,selectingPlayer:GamePlayer=this.turn.getDevicePlayer()){
        const attacker = this.units.getSelected(selectingPlayer);
        if (!attacker)
            throw new Error("Failed to initiate fight; attacker is missing...");
        this.waitUnit();
        this.combat.initiateFight(attacker,target);
        
    }

    /**
     * Called when a unit is killed (current hp = 0). The unit should be removed from the field. 
     * @param unit The unit that was killed
     */
    killUnit(unit:Unit){
        this.units.removeUnit(unit);
    }

// Get Data
    /**
     * @returns The player who is taking the turn
     */
    getActivePlayer(){
        return this.turn.getActivePlayer();
    }

}