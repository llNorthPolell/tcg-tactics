export type TargetFilterData = {
    type:string,

    /**
     * Unit class (for isClass filter)
     */
    class?:string,

    /**
     * For statIs filter, the threshold  
     */
    amount?:number,

    /**
     * For statIs filter, the comparator ( >, < , =, etc.)
     */
    compareOp?:string,

    /**
     * The unit's stat to check (for statIs filter)
     */
    stat?:string,

}