import { ASSETS } from "../enums/keys/assets";
import { SCENES } from "../enums/keys/scenes";

import { getPlayerColor } from "../enums/keys/playerTints";
import { GAME_STATE } from "../enums/keys/gameState";
import { testPlayer, testPlayer2 } from "../data/dummyData/testPlayers";
import { testFireballCardData, testGuardianCardData, testHealingLightCardData, testMageHeroCardData, testMagicBombCardData, testNaturesBlessingCardData, testRangerCardData, testRangerHeroCardData, testSoldierCardData, testSoldierHeroCardData } from "../data/dummyData/testCards";
import CardFactory from "../gameobjects/cards/cardFactory";
import Deck from "../gameobjects/cards/deck";
import GamePlayer from "../gameobjects/player/gamePlayer";
import FieldSetupScripts from "../scripts/fieldSetupScripts";
import EventDispatcher from "../controllers/eventDispatcher";
import EffectSystem from "../system/effectSystem";
import LandmarkController from "../controllers/landmarkController";
import SelectionGridController from "../controllers/selectionGridController";
import UnitController from "../controllers/unitController";
import TurnController from "../controllers/turnController";
import Field from "../state/field";
import GameState from "../state/gameState";
import CardController from "../controllers/cardController";
import HandUIObject from "../gameobjects/ui/view/handUIObject";
import HandUIController from "../gameobjects/ui/controllers/handUIController";
import UIController from "../controllers/uiController";
import MainGameController from "../controllers/mainGameController";
import UnitControlPanelController from "../gameobjects/ui/controllers/unitCtrlPanelController";
import UnitControlsPanel from "../gameobjects/ui/view/unitControlsPanel";
import UnitStatDisplayController from "../gameobjects/ui/controllers/unitStatDisplayController";
import UnitStatDisplay from "../gameobjects/ui/view/unitStatDisplay";
import EndTurnButtonController from "../gameobjects/ui/controllers/endTurnButtonController";
import EndTurnButton from "../gameobjects/ui/view/endTurnButton";
import ResourceDisplay from "../gameobjects/ui/view/resourceDisplay";
import ResourceDisplayController from "../gameobjects/ui/controllers/resourceDisplayController";
import CardDetailsDisplay from "../gameobjects/ui/view/cardDetailsDisplay";
import CardDetailsDisplayController from "../gameobjects/ui/controllers/cardDetailsDisplayController";
import DeckStatDisplay from "../gameobjects/ui/view/deckStatDisplay";
import DeckStatDisplayController from "../gameobjects/ui/controllers/deckStatDisplayController";
import CombatSystem from "../system/combatSystem";

export default class LoadingScene extends Phaser.Scene {


    preload() {
        //map
        this.load.image(ASSETS.TILE_SET, "./assets/maps/tilesets/tileset.png");
        this.load.image(ASSETS.MAP_ICONS, "./assets/maps/tilesets/mapicons.png");

        this.load.tilemapTiledJSON(ASSETS.TILE_MAP, "./assets/maps/testmap2.json");

        // portrait
        this.load.image(ASSETS.UNDEFINED, "./assets/portraits/undefined.png");

        // icons
        this.load.image(ASSETS.HP_ICON, "./assets/icons/hp.png");
        this.load.image(ASSETS.SP_ICON, "./assets/icons/sp.png");
        this.load.image(ASSETS.PWR_ICON, "./assets/icons/pwr.png");
        this.load.image(ASSETS.DEF_ICON, "./assets/icons/def.png");
        this.load.image(ASSETS.ATTACK_SELECTOR, "./assets/icons/attack.png");
        this.load.image(ASSETS.SPELL_SELECTOR, "./assets/icons/spell.png");
        this.load.image(ASSETS.INCOME_RATE,"./assets/icons/incomeRate.png");
        this.load.image(ASSETS.DECK_COUNT, "./assets/icons/deckCount.png");
        this.load.image(ASSETS.DEATH_COUNT, "./assets/icons/deathCount.png");
        this.load.spritesheet(ASSETS.CLASS_ICONS, "./assets/icons/Class.png", { frameWidth: 31, frameHeight: 31 });

        // ui
        this.load.image(ASSETS.YOUR_TURN, "./assets/ui/your_turn.png");
        this.load.image(ASSETS.OPPONENT_TURN, "./assets/ui/opponent_turn.png");
    }

    create() {
        console.log("Now Loading...");

        console.log("Loading Player Information...");
        const testPlayerLeader = CardFactory.createCard(testMageHeroCardData);
        const testOpponentLeader = CardFactory.createCard(testRangerHeroCardData);

        console.log("Loading Player Decks...");
        const testPlayerDeckCards = [
            CardFactory.createCard(testSoldierHeroCardData),
            CardFactory.createCard(testSoldierCardData),
            CardFactory.createCard(testSoldierCardData),
            CardFactory.createCard(testSoldierCardData),
            CardFactory.createCard(testRangerCardData),
            CardFactory.createCard(testRangerCardData),
            CardFactory.createCard(testGuardianCardData),
            CardFactory.createCard(testFireballCardData),
            CardFactory.createCard(testHealingLightCardData),
            CardFactory.createCard(testMagicBombCardData),
            CardFactory.createCard(testNaturesBlessingCardData),
        ]

        const testPlayerDeck = new Deck(testPlayerDeckCards, testPlayerLeader);
        const testOpponentDeck = new Deck([], testOpponentLeader);

        const testGamePlayer = new GamePlayer(1, testPlayer, getPlayerColor(1), 1, testPlayerDeck, true);
        const testGameOpponent = new GamePlayer(2, testPlayer2, getPlayerColor(2), 2, testOpponentDeck);

        const playersInGame= [testGamePlayer,testGameOpponent];

        console.log("Generating Field...");
        const gameplayScene = this.game.scene.getScene(SCENES.GAMEPLAY);
        
        const tilemapData = FieldSetupScripts.generateMap(gameplayScene);
        const selectionGrid = FieldSetupScripts.generateSelectionGrid(gameplayScene,tilemapData);
        const landmarksData = FieldSetupScripts.loadLandmarks(tilemapData);
        FieldSetupScripts.assignInitialLandmarks(tilemapData,landmarksData.byType,playersInGame);

        console.log("Initializing Game State");
        const gameState = new GameState(playersInGame);
        const field = new Field(gameState,tilemapData,landmarksData.byLocation,selectionGrid);
        

        console.log("Initializing Controllers");
        const turnController = new TurnController(gameState);
        const unitsController = new UnitController(field);
        const selectionGridController = new SelectionGridController(field,unitsController);
        const landmarksController = new LandmarkController(field);
        const cardController = new CardController(playersInGame);
        const effectsSystem = new EffectSystem(field,playersInGame);
        const combatSystem = new CombatSystem(unitsController,effectsSystem)
        const mainController = new MainGameController(gameplayScene,landmarksController,
            turnController,unitsController,selectionGridController,cardController,effectsSystem,
            combatSystem);

        console.log("Initializing UI");
        const hudScene = this.game.scene.getScene(SCENES.HUD);
        const handUIObject = new HandUIObject(hudScene);
        const unitControlsPanel = new UnitControlsPanel(hudScene);
        const unitStatDisplay = new UnitStatDisplay(hudScene);
        const endTurnButton = new EndTurnButton(hudScene);
        const resourceDisplay = new ResourceDisplay(hudScene);
        const cardDetailsDisplay = new CardDetailsDisplay(hudScene);
        const deckStatDisplay = new DeckStatDisplay(hudScene);

        const handUIController = new HandUIController(handUIObject,testGamePlayer);
        const unitControlsPanelController = new UnitControlPanelController(unitControlsPanel);
        const unitStatDisplayController = new UnitStatDisplayController(unitStatDisplay)
        const endTurnButtonController = new EndTurnButtonController(endTurnButton);
        const resourceDisplayController = new ResourceDisplayController(resourceDisplay);
        const cardDetailsDisplayController = new CardDetailsDisplayController(cardDetailsDisplay);
        const deckStatDisplayController = new DeckStatDisplayController(deckStatDisplay);

        const uiController = new UIController(turnController,
            handUIController,unitControlsPanelController,unitStatDisplayController,endTurnButtonController,
            resourceDisplayController, cardDetailsDisplayController,deckStatDisplayController);

        const eventDispatcher = new EventDispatcher(gameplayScene,mainController,uiController);

        console.log("Starting game...")
        this.game.registry.set(GAME_STATE.playersInGame, playersInGame);
        this.game.registry.set(GAME_STATE.tilemapData, tilemapData);
        this.game.registry.set(GAME_STATE.selectionGrid, selectionGrid);
        this.game.registry.set(GAME_STATE.landmarksData, landmarksData);

        this.game.registry.set(GAME_STATE.state, gameState);
        this.game.registry.set(GAME_STATE.field, field);

        this.game.registry.set(GAME_STATE.turnController, turnController);
        this.game.registry.set(GAME_STATE.unitsController, unitsController);
        this.game.registry.set(GAME_STATE.selectionGridController, selectionGridController);
        this.game.registry.set(GAME_STATE.landmarksController, landmarksController);
        this.game.registry.set(GAME_STATE.cardController,cardController);
        this.game.registry.set(GAME_STATE.effectsSystem, effectsSystem);
        this.game.registry.set(GAME_STATE.combatSystem,combatSystem);
        this.game.registry.set(GAME_STATE.mainController,mainController)
        
        this.game.registry.set(GAME_STATE.handUIObject, handUIObject);
        this.game.registry.set(GAME_STATE.unitControlsPanel, unitControlsPanel);
        this.game.registry.set(GAME_STATE.unitStatDisplay, unitStatDisplay);
        this.game.registry.set(GAME_STATE.endTurnButton,endTurnButton);
        this.game.registry.set(GAME_STATE.resourceDisplay,resourceDisplay);
        this.game.registry.set(GAME_STATE.cardDetailsDisplayController,cardDetailsDisplayController)
        this.game.registry.set(GAME_STATE.deckStatDisplayController,deckStatDisplayController);
        this.game.registry.set(GAME_STATE.cardDetailsDisplay,cardDetailsDisplay)
        this.game.registry.set(GAME_STATE.deckStatDisplay,deckStatDisplay);

        this.game.registry.set(GAME_STATE.handUIController, handUIController);
        this.game.registry.set(GAME_STATE.unitCtrlPanelController, unitControlsPanelController);
        this.game.registry.set(GAME_STATE.unitStatDisplayController, unitStatDisplayController);
        this.game.registry.set(GAME_STATE.endTurnButtonController,endTurnButtonController)
        this.game.registry.set(GAME_STATE.resourceDisplayController,resourceDisplayController);

        this.game.registry.set(GAME_STATE.uiController,uiController);
        this.game.registry.set(GAME_STATE.eventDispatcher, eventDispatcher);

        this.game.scene.start(SCENES.GAMEPLAY);
    }

    update() {

    }
}