class A {
    protected static readonly id: string = 'a'
    static p() {
        console.log(this.id)
    }

    i() {
        this.p()
    }
}

class B extends A {
    protected static readonly id = 'b'
}

A.p()
B.p()

new A().i()
new B().i()
