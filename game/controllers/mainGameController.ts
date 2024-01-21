import { Position } from "../data/types/position";
import { CARD_TYPE } from "../enums/keys/cardType";
import Card from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/player/gamePlayer";
import Unit from "../gameobjects/units/unit";
import FieldSetupScripts from "../scripts/fieldSetupScripts";
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

    constructor(scene: Phaser.Scene,
        landmarks: LandmarkController,
        turn: TurnController,
        units: UnitController,
        selectionGrid: SelectionGridController,
        cards: CardController,
        effects: EffectSystem) {
        this.scene = scene;
        this.landmarks = landmarks;
        this.turn = turn;
        this.units = units;
        this.selectionGrid = selectionGrid;
        this.cards = cards;
        this.effects = effects;
    }

// Game Events

    startGame() {
        const playersInGame = this.turn.getPlayersInGame();
        FieldSetupScripts.spawnDeckLeaders(this.scene, playersInGame, this.units);
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
            if (!unit.isActive()) return;
            unit.setActive(false);
            console.log(`${unit.name} has not moved, so it was set to inactive...`);
        });
        this.effects.onTurnEnd(activePlayer);

        this.turn.endTurn();
    }


    startTurn(activePlayer: GamePlayer) {
        console.log(`${activePlayer.name}'s turn`);

        this.landmarks.updateLandmarks();

        const income = activePlayer.resources.calculateIncome();
        activePlayer.resources.increaseMax();
        activePlayer.resources.generate(income);

        this.cards.drawCard(activePlayer);
        this.effects.onTurnStart(activePlayer);

        activePlayer.units.getAllActiveUnits().forEach(unit => {
            unit.setActive(true);
        });

        if (!activePlayer.isDevicePlayer)
            // TODO: Currently make other players pass after 3 seconds for testing purposes. Add AI later.
            this.scene.time.addEvent({
                delay: 3000, callback: () => {
                    this.turn.pass(activePlayer.id);
                }
            })
    }



// Card Events
    selectCard(card:Card){
        this.selectionGrid.hide();
        const activePlayer = this.turn.getActivePlayer();
        if(card.getOwner()!== activePlayer) return;
        
        this.cards.selectCard(activePlayer,card);
        if (card.cardType!==CARD_TYPE.spell)
            this.selectionGrid.showRallyPoints(activePlayer);
    }


    cancelCard(){
        const activePlayer = this.turn.getActivePlayer();
        this.cards.deselectCard(activePlayer);
        this.selectionGrid.hide();
    }

    playCard(position:Position){
        const activePlayer = this.turn.getActivePlayer();
        const card = this.cards.getSelectedCard(activePlayer);
        if (!card)
            throw new Error("Failed to play card; no card was selected...");
        const resources = activePlayer.resources;

        try {
            resources.spend(card.cost);
            this.cards.removeCard(activePlayer,card);
            this.cancelCard();
            this.units.summonUnitByCard(this.scene, card,position);
            console.log(`Played ${card.name} !`)
        }
        catch(error){
            console.error(error);
        }
    }


// Unit Events
    selectUnit(unit:Unit){
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
    }


    moveUnitTo(destination:Position){
        const selected= this.units.getSelected();
        selected?.position()?.moveTo(destination);
    }


    waitUnit(){
        this.units.confirmMove();
        this.selectionGrid.hide();
    }


    cancelUnitMove(){
        this.units.cancelMove();
        this.selectionGrid.hide();
    }

// Get Data
    getActivePlayer(){
        return this.turn.getActivePlayer();
    }

}