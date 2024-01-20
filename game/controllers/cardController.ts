import { EVENTS } from "../enums/keys/events";
import Card from "../gameobjects/cards/card";
import CardManager from "../gameobjects/player/cardManager";
import GamePlayer from "../gameobjects/player/gamePlayer";
import { EventEmitter } from "../scripts/events";

export default class CardController{
    private readonly cardManagers:Map<number,CardManager>;

    constructor(playersInGame:GamePlayer[]){
        this.cardManagers=new Map();
        playersInGame.forEach(player=>this.cardManagers.set(player.id,player.cards));    
    }


    drawCard(activePlayer:GamePlayer){
        const cardManager = this.cardManagers.get(activePlayer.id);
        if (!cardManager)
            throw new Error (`${activePlayer.name} does not have a card manager...`);

        cardManager.drawCard();

        if(activePlayer.isDevicePlayer)
            EventEmitter.emit(EVENTS.uiEvent.UPDATE_HAND,cardManager.getHand());
    }

    removeCard(activePlayer:GamePlayer,card:Card){
        this.cardManagers.get(activePlayer.id)!.removeCardFromHand(card);
    }

    getHand(activePlayer:GamePlayer){
        return this.cardManagers.get(activePlayer.id)!.getHand();
    }

    selectCard(activePlayer:GamePlayer,card:Card){
        this.cardManagers.get(activePlayer.id)!.selectCard(card);
    }

    deselectCard(activePlayer:GamePlayer){
        this.cardManagers.get(activePlayer.id)!.deselectCard();
    }

    getSelectedCard(activePlayer:GamePlayer){
        return this.cardManagers.get(activePlayer.id)!.getSelected();
    }
}