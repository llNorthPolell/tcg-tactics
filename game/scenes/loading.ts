import { ASSETS } from "../enums/keys/assets";
import { SCENES } from "../enums/keys/scenes";

import { getPlayerColor } from "../enums/keys/playerTints";
import { GAME_STATE } from "../enums/keys/gameState";
import { testPlayer, testPlayer2 } from "../data/dummyData/testPlayers";
import { testFireballCardData, testGuardianCardData, testHealingLightCardData, testMageHeroCardData, testMagicBombCardData, testNaturesBlessingCardData, testRangerCardData, testRangerHeroCardData, testSoldierCardData, testSoldierHeroCardData } from "../data/dummyData/testCards";
import CardFactory from "../gameobjects/cards/cardFactory";
import Deck from "../gameobjects/cards/deck";
import GamePlayer from "../gameobjects/player/gamePlayer";
import FieldGenerator from "../fieldGenerator";
import EventDispatcher from "../controllers/eventDispatcher";
import EffectSystem from "../effectSystem";
import LandmarkController from "../controllers/landmarkController";
import SelectionTileController from "../controllers/selectionTileController";
import UnitController from "../controllers/unitController";
import TurnController from "../controllers/turnController";
import Field from "../state/field";
import GameState from "../state/gameState";

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

        const testGamePlayer = new GamePlayer(1, testPlayer, getPlayerColor(1), 1, true);
        testGamePlayer.cards.setDeck(testPlayerDeck);

        const testGameOpponent = new GamePlayer(2, testPlayer2, getPlayerColor(2), 2);
        testGameOpponent.cards.setDeck(testOpponentDeck);

        const playersInGame= [testGamePlayer,testGameOpponent];

        console.log("Generating Field...");
        const gameplayScene = this.game.scene.getScene(SCENES.GAMEPLAY);
        const tilemapData = FieldGenerator.generateMap(gameplayScene);
        const selectionTiles = FieldGenerator.generateHighlightTiles(gameplayScene,tilemapData);
        const landmarksData = FieldGenerator.loadLandmarks(tilemapData);
        FieldGenerator.assignInitialLandmarks(tilemapData,landmarksData.byType,playersInGame);

        console.log("Initializing Game State");
        const gameState = new GameState(playersInGame);
        const field = new Field(gameState,tilemapData,landmarksData.byLocation,selectionTiles);
        

        console.log("Initializing Controllers");
        const turnController = new TurnController(gameState);
        const unitsController = new UnitController(field);
        const selectionTilesController = new SelectionTileController(field,unitsController);
        const landmarksController = new LandmarkController(field);
        const effectsSystem = new EffectSystem(field,playersInGame);
        const eventDispatcher = new EventDispatcher(landmarksController,
            turnController,unitsController,selectionTilesController,effectsSystem);



        console.log("Starting game...")
        this.game.registry.set(GAME_STATE.playersInGame, playersInGame);
        this.game.registry.set(GAME_STATE.tilemapData, tilemapData);
        this.game.registry.set(GAME_STATE.selectionTiles, selectionTiles);
        this.game.registry.set(GAME_STATE.landmarksData, landmarksData);

        this.game.registry.set(GAME_STATE.state, gameState);
        this.game.registry.set(GAME_STATE.field, field);

        this.game.registry.set(GAME_STATE.turnController, turnController);
        this.game.registry.set(GAME_STATE.unitsController, unitsController);
        this.game.registry.set(GAME_STATE.selectionTilesController, selectionTilesController);
        this.game.registry.set(GAME_STATE.landmarksController, landmarksController);
        this.game.registry.set(GAME_STATE.effectsSystem, effectsSystem);
        this.game.registry.set(GAME_STATE.eventDispatcher, eventDispatcher);

        this.game.scene.start(SCENES.GAMEPLAY);
    }

    update() {

    }
}