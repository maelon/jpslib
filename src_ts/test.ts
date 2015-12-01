class C {
    x: string = '123';
    static y: number = 123;
}

namespace N {
    export var x: string;
}

interface Array<T> {
}

//var a: string[] = ['abc', '123', 'ss'];
//var t: [string, number] = [1, 2, '3'];

//((x: string) => string) | ((x: string) => number);

//type F1 = (a: string, b: string) => void;
//type F2 = (a: number, b: number) => void;
//var f: F1 & F2 = (a: string | number, b: string | number) => {};
//f('hello', 'world');
//f(1, 2);
//f(1, 'test');

interface A { a: string; }
interface B extends A { b: string; }
interface C extends B { c: string; }
interface G<T, U extends B> {
    x: T;
    y: U;
}
var v1: G<A, C>;
var v2: G<{ a: string }, C>;
