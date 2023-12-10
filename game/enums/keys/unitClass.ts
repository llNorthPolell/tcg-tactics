export const UNIT_CLASS = Object.freeze({
    SOLDIER: 'Soldier',
    BERSERKER: 'Berserker',
    GUARDIAN: 'Guardian',
    RANGER: 'Ranger',
    ASSASSIN: 'Assassin',
    MAGE: 'Mage',
    LANCER: 'Lancer',
    TOWER: 'Tower'
});

export const CLASS_ICON_MAPPING = Object.freeze({
    SOLDIER:1,
    BERSERKER:3,
    RANGER:4,
    ASSASSIN:5,
    GUARDIAN:6,
    TOWER:7,
    MAGE:9,
    LANCER:13
})

export const ICON_SIZE = {
    width:31,
    height:31
}


export function getClassIcon(unitClass:string){
    switch(unitClass){
        case UNIT_CLASS.SOLDIER:
            return CLASS_ICON_MAPPING.SOLDIER;
        case UNIT_CLASS.GUARDIAN:
            return CLASS_ICON_MAPPING.GUARDIAN;
        case UNIT_CLASS.RANGER:
            return CLASS_ICON_MAPPING.RANGER;
        case UNIT_CLASS.MAGE:
            return CLASS_ICON_MAPPING.MAGE;
        case UNIT_CLASS.LANCER:
            return CLASS_ICON_MAPPING.LANCER;
        case UNIT_CLASS.TOWER:
            return CLASS_ICON_MAPPING.TOWER;
        case UNIT_CLASS.BERSERKER:
            return CLASS_ICON_MAPPING.BERSERKER;
        case UNIT_CLASS.ASSASSIN:
            return CLASS_ICON_MAPPING.ASSASSIN;
        default:
            return CLASS_ICON_MAPPING.SOLDIER;
    }
}