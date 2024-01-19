import { Position } from "../data/types/position";
import { CARD_TYPE } from "../enums/keys/cardType";
import Card from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/player/gamePlayer";
import Unit from "../gameobjects/units/unit";
import FieldSetupScripts from "../scripts/fieldSetupScripts";
import EffectSystem from "../system/effectSystem";
import CardController from "./cardController";
import LandmarkController from "./landmarkController";
import SelectionTileController from "./selectionTileController";
import TurnController from "./turnController";
import UnitController from "./unitController";

export default class MainGameController {
    private readonly scene: Phaser.Scene;
    private readonly turn: TurnController;
    private readonly landmarks: LandmarkController;
    private readonly units: UnitController;
    private readonly selectionTiles: SelectionTileController;
    private readonly cards: CardController;
    private readonly effects: EffectSystem;

    constructor(scene: Phaser.Scene,
        landmarks: LandmarkController,
        turn: TurnController,
        units: UnitController,
        selectionTiles: SelectionTileController,
        cards: CardController,
        effects: EffectSystem) {
        this.scene = scene;
        this.landmarks = landmarks;
        this.turn = turn;
        this.units = units;
        this.selectionTiles = selectionTiles;
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
        this.selectionTiles.hide();
        const activePlayer = this.turn.getActivePlayer();
        this.cards.selectCard(card);
        if (card.cardType!==CARD_TYPE.spell)
            this.selectionTiles.showRallyPoints(activePlayer);
    }


    cancelCard(){
        this.cards.deselectCard();
        this.selectionTiles.hide();
    }


// Unit Events
    selectUnit(unit:Unit){
        this.selectionTiles.hide();
        this.units.selectUnit(unit);
        const position = unit.position()?.get();

        if (!position) 
            throw new Error(`The position controller for ${unit.id} has not been initialized...`);

        const movement = unit.getCurrentStats().mvt;
        const range = unit.getCurrentStats().rng;

        if (unit.isActive())
            this.selectionTiles.showMoves(position,movement,false);
        else
            this.selectionTiles.showAttackRange(position,range);
    }


    moveUnitTo(destination:Position){
        const selected= this.units.getSelected();
        selected?.position()?.moveTo(destination);
    }


    waitUnit(){
        const selected= this.units.getSelected();
        selected?.position()?.confirm();
        this.selectionTiles.hide();
    }


    cancelUnitMove(){
        const selected= this.units.getSelected();
        selected?.position()?.cancel();
        this.selectionTiles.hide();
    }

// Get Data
    getActivePlayer(){
        return this.turn.getActivePlayer();
    }

}