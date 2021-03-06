const cubec = require('../dist/cubec.min');

test("[model] lock prevent set data", ()=>{
  const model = cubec.model();

  model.lock();

  model.set({a:1,b:2});

  expect(model.get()).toEqual({});
});

test("model lock unlock operator", ()=>{
  const model = cubec.model();

  model.lock();
  model.set({a:1,b:2});

  model.unlock();
  model.set({a:2,b:1});

  expect(model.get()).toEqual({a:2,b:1});
});

test("model event test changeEvent [data]", ()=>{
  const model = cubec.model();
  model.on("change", data=>{
    expect(data).toEqual(model.get());
  });
  model.set({ a:1, b:2 });
});

test("model event test changeKeyEvent [data]", ()=>{
  const model = cubec.model();
  model.on("change:a", avalue=>{
    expect(avalue).toEqual(model.get("a"));
  });
  model.set("a", 1);
});

test("model off event binding", ()=>{
  let value = 1;
  const model = cubec.model();
  model.on("add", ()=>(value+=1));
  model.off("add");
  model.emit("add");

  expect(value).toBe(1);
});

test("model off event binding [target function]", ()=>{
  let value = 1;
  const model = cubec.model();
  const add = function(){
    value+=1;
  };

  model.on("add1", add);
  model.on("add2", add);
  model.on("add3", add);
  model.off("add2", add);
  model.emit("add1,add2,add3");

  expect(value).toBe(3);
});

test("model event test with emit", ()=>{
  const model = cubec.model({
    events: {
      myevent: function(value){
        expect(value).toBe(1);
      }
    }
  });

  model.emit("myevent", 1);
});

test("model event test with emit multiple arguments", ()=>{
  const model = cubec.model({
    events: {
      myevent: function(a,b,c){
        expect(a+b+c).toBe(6);
      }
    }
  });

  model.emit("myevent", 1, 2, 3);
});

test("model event test with emit Array<> multiple arguments", ()=>{
  const model = cubec.model({
    events: {
      myevent: function(a,b,c){
        expect(a+b+c).toBe(6);
      }
    }
  });

  model.emit("myevent", [1, 2, 3]);
});

test("model store test in localStorage", ()=>{
  const model = cubec.model({
    name: "abc",
    plugin: ['store']
  });

  model.set({a:1,b:2});
  model.set({a:2,b:1});

  const model2 = cubec.model({
    name: "abc",
    plugin: ['store']
  });

  expect(model2.get()).toEqual({a:2,b:1});
});

test("model store history for back", ()=>{
  const model = cubec.model({
    name: "abcd",
    plugin: ['history'],
  });

  model.set({a:1});
  model.set({b:2});
  model.set({c:3});

  model.backHistory();

  expect(model.get()).toEqual({ b:2 });
});

test("model store history for back index [-number]", ()=>{
  const model = cubec.model({
    name: "abcd",
    plugin: ['history'],
  });

  model.set({a:1});
  model.set({b:2});
  model.set({c:3});

  model.backHistory(-2);

  expect(model.get()).toEqual({ a:1 });
});

test("model store history for back index [number]", ()=>{
  const model = cubec.model({
    name: "abcd",
    plugin: ['history'],
  });

  model.set({d:4});
  model.set({a:1});
  model.set({b:2});
  model.set({c:3});

  model.backHistory(1);

  expect(model.get()).toEqual({ d:4 });
});

test("model store and clearStore", ()=>{
  const model = cubec.model({
    name: "abcde",
    plugin: ['store']
  });

  model.set({a:1});
  model.set({b:2});
  model.set({c:3});

  expect(model.get()).toEqual({ c: 3 });

  const model2 = cubec.model({
    name: "abcde",
    plugin: ['store']
  });

  expect(model2.get()).toEqual({ c: 3 });

  model.clearStore();

  const model3 = cubec.model({
    name: "abcde",
    plugin: ['store']
  });

  expect(model3.get()).toEqual({ });
});

