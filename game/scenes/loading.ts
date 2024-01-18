import { ASSETS } from "../enums/keys/assets";
import { SCENES } from "../enums/keys/scenes";

import { getPlayerColor } from "../enums/keys/playerTints";
import { GAME_STATE } from "../enums/keys/gameState";
import { testPlayer, testPlayer2 } from "../data/dummyData/testPlayers";
import { testFireballCardData, testGuardianCardData, testHealingLightCardData, testMageHeroCardData, testMagicBombCardData, testNaturesBlessingCardData, testRangerCardData, testRangerHeroCardData, testSoldierCardData, testSoldierHeroCardData } from "../data/dummyData/testCards";
import CardFactory from "../gameobjects/cards/cardFactory";
import Deck from "../gameobjects/cards/deck";
import GamePlayer from "../gameobjects/player/gamePlayer";

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

        const testPlayerLeader = CardFactory.createCard(testMageHeroCardData);
        const testOpponentLeader = CardFactory.createCard(testRangerHeroCardData);

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

        this.game.registry.set(GAME_STATE.player, testGamePlayer);
        this.game.registry.set(GAME_STATE.opponents, [testGameOpponent])

        this.game.scene.start(SCENES.GAMEPLAY);
    }

    update() {

    }
}