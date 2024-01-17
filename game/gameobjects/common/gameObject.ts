export default interface GameObject{
    setPosition(x:number,y:number):void;
    setVisible(visible:boolean):void;
    updateActive():void;
}