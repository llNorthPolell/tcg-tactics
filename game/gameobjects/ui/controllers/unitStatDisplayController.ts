import { getClassIcon } from "@/game/enums/keys/unitClass";
import Unit from "../../units/unit";
import UnitStatDisplay from "../view/unitStatDisplay";
import UnitGO from "../../units/unitGO";
import { UI_COLORS } from "@/game/enums/keys/uiColors";

export default class UnitStatDisplayController{
    private readonly ui:UnitStatDisplay;

    constructor(ui:UnitStatDisplay){
        this.ui=ui;
    }

    show(unit:Unit){
        const current = unit.getCurrentStats();
        this.ui.setUnitName(unit.name);
        this.ui.setPortrait((unit.getGameObject() as UnitGO).imageAssetName);
        this.ui.setClassIcon(getClassIcon(unit.unitClass));
        this.ui.setHP(current.hp);
        this.ui.setSP(current.sp);

        this.updatePwrText(unit);
        this.updateDefText(unit);

        this.ui.show();
    }

    private updatePwrText(unit:Unit){
        const current = unit.getCurrentStats();
        const color = (current.pwr < unit.base.pwr)? UI_COLORS.damage : 
            (current.pwr > unit.base.pwr)? UI_COLORS.buff : UI_COLORS.white;

        this.ui.setPwr(current.pwr,color);
    }
    
    private updateDefText(unit:Unit){
        const current = unit.getCurrentStats();
        const color = (current.def < unit.base.def)? UI_COLORS.damage : 
            (current.def > unit.base.def)? UI_COLORS.buff : UI_COLORS.white;

        this.ui.setDef(current.def,color);
    }

    hide(){
        this.ui.hide();
    }
}