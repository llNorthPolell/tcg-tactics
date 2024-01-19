import Card from "../gameobjects/cards/card";
import GamePlayer from "../gameobjects/player/gamePlayer";
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

    constructor(turn:TurnController,
        hand: HandUIController,
        unitControls: UnitControlPanelController,
        unitStats:UnitStatDisplayController,
        endTurn:EndTurnButtonController,
        resources:ResourceDisplayController){
        this.turn=turn;
        this.hand=hand;
        this.unitControls=unitControls;
        this.unitStats=unitStats;
        this.endTurn=endTurn;
        this.resources=resources;
    }

    handlePlayerTurn(activePlayer:GamePlayer){
        if(!activePlayer.isDevicePlayer) return;

        const {current,max} = activePlayer.resources.get();
        const income = activePlayer.resources.calculateIncome();

        this.resources.setCurrent(current);
        this.resources.setMax(max);
        this.resources.setIncome(income);

        this.hand.update();
        this.endTurn.show();
    }

    handleEndTurn(){
        this.endTurn.hide();
    }

    handleSelectCard(card:Card){
        if(!this.turn.isDevicePlayerTurn()) return;
        this.hand.select(card);
        this.endTurn.hide();
    }

    handleCancelCard(){
        this.hand.cancel();
        if(!this.turn.isDevicePlayerTurn()) return;
        this.endTurn.show();
    }

    updateHand(){
        if(!this.turn.isDevicePlayerTurn()) return;
        this.hand.update();
    }

    handleSelectUnit(activePlayer:GamePlayer,unit:Unit){
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
        this.endTurn.show();
    }
}