
it("jest should work", ()=>{
    console.log("hello world");

    const expected = "hello world";
    const actual = "hello world";

    expect(expected).toBe(actual);
});

class a {
    private fieldA:string;
    constructor(){
        this.fieldA="initial";
    }

    setFieldA(newFieldA:string){
        this.fieldA=newFieldA;
    }

    getFieldA(){
        return this.fieldA;
    }
}

class b {
    readonly parent: a;

    constructor(parent:a){
        this.parent=parent;
    }

    setFieldA(newFieldA:string){
        this.parent.setFieldA(newFieldA);
    }
}

it("class test",()=>{
    const parent = new a();
    const child = new b(parent);

    child.setFieldA("changed");

    expect(parent.getFieldA()).toBe("changed");
})