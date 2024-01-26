import Card from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/player/gamePlayer";
import CardDetailsDisplayController from "../gameobjects/ui/controllers/cardDetailsDisplayController";
import DeckStatDisplayController from "../gameobjects/ui/controllers/deckStatDisplayController";
import DiscardWindowController from "../gameobjects/ui/controllers/discardWindowController";
import EndTurnButtonController from "../gameobjects/ui/controllers/endTurnButtonController";
import HandUIController from "../gameobjects/ui/controllers/handUIController";
import ResourceDisplayController from "../gameobjects/ui/controllers/resourceDisplayController";
import UnitControlPanelController from "../gameobjects/ui/controllers/unitCtrlPanelController";
import UnitStatDisplayController from "../gameobjects/ui/controllers/unitStatDisplayController";
import Unit from "../gameobjects/units/unit";
import TurnController from "./turnController";

export default class UIController{
    private readonly turn:TurnController;

    private readonly hand: HandUIController;
    private readonly unitControls: UnitControlPanelController;
    private readonly unitStats: UnitStatDisplayController
    private readonly endTurn: EndTurnButtonController;
    private readonly resources:ResourceDisplayController;
    private readonly cardDetails: CardDetailsDisplayController;
    private readonly deckStats: DeckStatDisplayController;
    private readonly discard: DiscardWindowController;

    private discardMode:boolean;

    constructor(turn:TurnController,
        hand: HandUIController,
        unitControls: UnitControlPanelController,
        unitStats:UnitStatDisplayController,
        endTurn:EndTurnButtonController,
        resources:ResourceDisplayController,
        cardDetails: CardDetailsDisplayController,
        deckStats: DeckStatDisplayController,
        discard:DiscardWindowController){
        this.turn=turn;
        this.hand=hand;
        this.unitControls=unitControls;
        this.unitStats=unitStats;
        this.endTurn=endTurn;
        this.resources=resources;
        this.cardDetails=cardDetails;
        this.deckStats=deckStats;
        this.discard=discard;

        this.discardMode=false;
    }

    handleDrawCard(card:Card){
        this.hand.drawCard(card);
    }

    handlePlayerTurn(activePlayer:GamePlayer){
        if(!activePlayer.isDevicePlayer) return;

        const {current,max} = activePlayer.resources.get();
        const income = activePlayer.resources.calculateIncome();

        this.resources.setCurrent(current);
        this.resources.setMax(max);
        this.resources.setIncome(income);

        this.deckStats.setDeckCount(activePlayer.cards.getDeckCount());

        if(this.discardMode) return;
        this.endTurn.show();
    }

    handleEndTurn(){
        this.handleDeselectUnit();
        if(!this.turn.getActivePlayer().isDevicePlayer)
            this.endTurn.hide();
    }

    handleSelectCard(card:Card){
        if(!this.turn.isDevicePlayerTurn()) return;
        this.cardDetails.hide();
        this.handleDeselectUnit();
        this.hand.select(card);
        this.cardDetails.show(card);
        this.endTurn.hide();
    }

    handleCancelCard(){
        if(!this.turn.isDevicePlayerTurn()) return;
        this.hand.cancel();
        this.cardDetails.hide();
        this.endTurn.show();
    }

    handleSelectUnit(activePlayer:GamePlayer,unit:Unit){
        if(this.discardMode) return;
        this.handleCancelCard();
        this.handleDeselectUnit();
        this.hand.hide();
        this.endTurn.hide();
        this.unitStats.show(unit);
        this.unitControls.show();
        if (unit.isActive() &&
            unit.getOwner() === activePlayer && unit.getOwner()!.isDevicePlayer)
            this.unitControls.showWaitButton();
            
    }

    handleDeselectUnit(){
        this.unitControls.hide();
        this.unitStats.hide();
        this.hand.show();

        if(!this.turn.getActivePlayer().isDevicePlayer) return;
        if(this.discardMode)return;
        this.endTurn.show();
    }

    handlePlayCard(){
        if (!this.turn.isDevicePlayerTurn())return;
        const activePlayer = this.turn.getActivePlayer();
        const {current} = activePlayer.resources.get();

        this.cardDetails.hide();
        this.hand.handlePlayCard();
        this.endTurn.show();
        this.resources.setCurrent(current);
    }


    handleKillUnit(unit:Unit){
        const owner = unit.getOwner();
        if(!owner)
            throw new Error(`${unit.name} does not have an owner...`);
        console.log(`Owner of ${unit.name}: ${owner.name}`)
        if (!owner.isDevicePlayer)return;
        this.deckStats.setDeathCount(owner.units.getCasualties());
    }

    setDiscardMode(heroCard:Card){
        this.discardMode=true;
        this.discard.show(heroCard);
        this.hand.setDiscardMode(true);
    }

    handleSelectDiscard(discard:Card){
        this.discard.setCardToDiscard(discard);
    }

    handleConfirmDiscard(heroCard:Card,discard:Card){
        this.discardMode=false;
        this.discard.hide();
        this.hand.setDiscardMode(false);
        this.hand.handleConfirmDiscard(heroCard,discard);
    }
}