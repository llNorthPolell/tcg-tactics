export interface State{
    name:string,
    nextState?: State | (State|undefined)[],
    entryCondition: ()=>boolean,
    onEnter? :()=>void,
    onUpdate? :()=>void,
    onExit? :()=>void
}


export default class StateManager {
    private prevState: State | undefined;
    private state: State | undefined;

    constructor(initState:State){
        
        this.state=initState;
        if (this.state?.onEnter){
            this.state.onEnter();
        }
    }

    setState (state: State) {
        this.state=state;
    }

    getState(){
        return this.state;
    }

    tryNext(name:string|undefined){
        if (!this.state?.nextState) return;
        if (this.state.name == name) return;
    
        let nextState : State | undefined = undefined;
        if (this.state?.nextState instanceof Array){
            if (!name){
                console.log("Name is required when multiple next states are available");
                return;
            }
            nextState = this.state?.nextState.find(state=> state?.name==name);
            if (!nextState){
                console.log(`Illegal state transition from ${this.state.name} to ${name}`);
                return;
            }
        }
        else
            nextState = this.state?.nextState;

        if (!nextState?.entryCondition()) return;
        this.prevState = this.state;
        
        if (this.state?.onExit)
            this.state.onExit();

        this.state=nextState;

        if(this.state?.onEnter)
            this.state.onEnter();
    }

    undo(){
        this.state=this.prevState;
        this.prevState=undefined;
    }

    update(){
        if (this.state?.onUpdate)
            this.state.onUpdate();
    }

    destroy(){
        this.state=undefined;
        this.prevState=undefined;
    }
}