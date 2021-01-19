# Chipper Docs

The tool consists of two (`Chipper` class instance and `useChip` hook) and a half (`ChipperOperator` class) exported elements.<br>
You don't have to use `useChip` hook, because state can be accessed from outside of react components. It won't be reactive though, so no re-rendering logic to keep everything in check.

## 0.5) `ChipperOperator`

You can use `ChipperOperator` class to create a new instance of Chipper, however, `useChip` hook won't be compatible with it. You could write a new hook by yourself to handle other instances (or I'll probably write this hook for you to copy and paste in you code - I don't know).<br>
Please treat this `0.5)` point as an information that stuff like that can be done, should need be,

## 1) `Chipper`

First, let's set up the initial store (you can omit this step):

```javascript
import Chipper from "chipper";

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }],
  ["friends", { joey: "how you doin'?" }],
]);

// or you can add bits of state from anywhere you like outside of
Chipper.createQueue([["user", { uid: "12345", name: "piglet" }]]);
// or in a component
Chipper.createQueue([["theme", { dark: true, color: "pink" }]]);
```

As you can see, we pass an array of tuples to a `createQueue()` method. We do that, because the store is built on top of a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object (why rewrite something that works great out of the box, right?)<br>

You can go commando and use `Chipper`'s methods to read and set up the store yourself from somewhere random and/or outside of React using side effects of `queryQueue()` method. You don't have to use `createQueue()` to populate the state, however it takes precedence over other methods. Just keep in mind that `set()` methods used across this plugin either overwrite existing state or create a new one.

```javascript
import Chipper from "chipper";

// add to Chipper somewhere in your code
Chipper.queryQueue("user", { uid: "12345", name: "piglet" });

// or
Chipper.queryQueue("user").set({ uid: "12345", name: "piglet" });

// or if for some reason you want to change one chip from another chip
Chipper.queryQueue("theme").get(); // { dark: true, color: "pink" }
Chipper.queryQueue("user").set({ dark: false, color: "purple" }, "theme"); // notice the second argument "theme"
Chipper.queryQueue("theme").get(); // { dark: false, color: "purple" }

// grab default from Chipper somewhere else in your code
Chipper.queryQueue("user").get(); // { uid: "12345", name: "piglet" }

// or if you want to grab some chip's state from another chip
Chipper.queryQueue("user").get("theme"); // { dark: false, color: "purple" }
```

**Note:** These are some of the building blocks of `useChip` hook.
I had a case of having to update state outside of React once, so I wanted to make sure I'll have an easy way of adding data from wherever, whenever.

## 2) `useChip`

If you work with React/React-Native do yourself a favor and `useChip`. It's easier that way.<br>
`useChip` handles re-rendering and subscription to state of matching components that use it.

### a) read

Use `data` and/or `status` props from the returned object to read the chip.
`data` can be changed by you, `status` is handled by the plugin:

```javascript
import { useChip } from 'chipper';

const MyComponent = () => {
  const { data, status } = useChip('user');

  console.log(data); // { uid: "12345", name: "piglet" }
  console.log(status); // { type: "IDLE", message: undefined }

  return (...)
}
```

### b) write

You can use `useChip` itself to add data to your state by passing something as a second argument. If the state with given key exists, the second argument is ignored, because `Chipper.createQueue()` takes precedence.

```javascript
const user = useChip("user", { details: "redacted" }).get().data; // { uid: "12345", name: "piglet" };

const chips = useChip("eatChips", { better: "not" }).get().data; // { better: 'not' };
```

`useChip` gives you a bunch of ways to add data to your state:

```javascript
import { useChip } from 'chipper';

const MyComponent = () => {
  const { set } = useChip('user');

  // using primitives to change data
  set('hello world');

  // using selectors to change data
  set((draft) => {
    draft.uid = 'new_uid';
  });

  // using mocked primitives to change data and status
  set('hello world', { timeout: 2000 }); // this handles changes to chip's status and sets chip's data after 2 seconds

  // using mocked selectors to change data and status
  set((draft) => {
    draft.uid = 'new_uid';
  }, { timeout: 2000 });

  // using async to change data and status (timeout is ignored)
  set(Promise(...));

  return (...)
}
```

### c) meddle

`useChip` also introduces `api` property with access to some lower level `Chipper` methods. You can go naughty and put your hands on state of other chips from here. This re-renders all components subscribed to the piece of state that's being changed.

```javascript
import { useChip } from 'chipper';

const MyComponent = () => {
  const { api } = useChip('user');

  api.set({ dark: false, color: "purple" }) // updates 'user' data
  api.set({ dark: false, color: "purple" }, "theme") // updates 'theme' data
  api.get() // grabs data and status from 'user' state
  api.get('theme') // grabs data and status from 'theme' state
  api.cut() // removes 'user' state
  api.cut('theme') // removes 'theme' state

  return (...)
}
```

<br>

# Chipper API

Chipper's store consists of smaller pieces of state called "chips".
Chips are objects...

```javascript
const chip = {
  data: {...},
  status: { type: '...', message: '...'}
}
```

... stored inside a `Map()` instance like so: `Map().set('key', chip)`

<br>

## 1) `Chipper` props

- ### `createQueue(queue: IQueue): void`<br>

  This method loads data into Chipper. It takes the tuple's second item (value/data) and turns it into a `chip` that gets stored inside `Map()` instance

  ```javascript
  Chipper.createQueue([["user", { uid: "12345", name: "piglet" }]]);
  ```

- ### `queryQueue(key: string, data: IData): IQuery`<br>

  This method returns an object:

  - `get(cKey?: string): IChip`
  - `set(data: IData | IChip, cKey?: string): void`
  - `cut(cKey?: string): boolean`

  These are low level methods, that let you read and write Chipper's state:<br>
  a) `queryQueue('user').get()` - you can either pass no argument (Chipper will use the default key from `queryQueue()` method) or you can pass a string to grab a matching chip<br>

  ```javascript
  api.get(); // grabs data and status from 'user' state
  api.get("theme"); // grabs data and status from 'theme' state
  ```

  b) `queryQueue('user').set(data)` - requires either plain data or a `chip` object. If non-chip-shaped-object is passed, Chipper turns it into a `chip` to handle status changes. It also takes a string as a second argument, which lets you direct Chipper onto other pieces of state<br>

  ```javascript
  api.set({ dark: false, color: "purple" }); // updates 'user' data
  api.set({ dark: false, color: "purple" }, "theme"); // updates 'theme' data
  ```

  c) `queryQueue('user').cut()` - similar to `.get()`, but removes the chip

  ```javascript
  api.cut(); // removes 'user' state
  api.cut("theme"); // removes 'theme' state
  ```

- ### `enqueue(key: string, update: QUpdate): void`

  This method adds updated data to Chipper's queue (or subscribes to state, if you will).
  In case of Chipper, `update` is derived from `React.useState()`'s dispatch, but you could throw in here whatever value, if you want to reuse the logic for something else.

  ```javascript
  Chipper.enqueue(key, updater);
  ```

- ### `dequeue(update: QUpdate): void`

  This method removes subscription to state.

  ```javascript
  Chipper.dequeue(updater);
  ```

- ### `convey(key: string, chip: IChip): void`

  This method updates all interested chips.

  ```javascript
  Chipper.convey(key, chip);
  ```

- ### `queue: QUpdater[]`

  Queue is an array of updated values that we use to pinpoint which components should be updated.

- ### `chips: Map<string, IChip>[]`

Chips is a Map object storing the state.

## 2) `useChip` props

- ## `data: T = IData`
- ## `status: IStatus`

  `status` is an object...

  ```javascript
  status: {
    type: "IDLE" | "LOADING" | "ERROR" | "SUCCESS",
    message: Error | string | undefined,
  }
  ```

  ...that will be modified internally by the plugin if you use `useChip`'s `set()` method either with an async function passed as data or with `timeout` option for "regular" data. Chipper doesn't give you methods to update the `status` manually.

- ## `set: (update: IUpdate, options?: IOptions): void`

  `set` is a mighty method that handles adding sync/async data to your state. It integrates easily with the rest of the tools available in Chipper.<br>
  Async actions run with `useChip`'s `set` method are handled by a javascript generator function to make sure there are no memory leaks when/if the component unmounts before the function finishes.

  Here's a list of ways you can write data to your state:

  a) primitive set:

  ```javascript
  set(7);
  set("hello world");
  set({ something: { anything: "We are potato" } });
  ```

  b) immerised selector set:

  ```javascript
  set((draft) => {
    draft.something.anything = "I am potato";
  });

  set(({ something }) => {
    something.anything = "I am potato";
  });

  set(() => "why not?");
  ```

  c) mocked/async'd set:<br>

  ```javascript
  set(7, { timeout: 1234 });

  set(
    ({ something }) => {
      something.anything = "I am potato";
    },
    { timeout: 1234 }
  );

  set(Promise(...));
  ```

  d) `set` lets you pass an `options` object as a second argument. `options` introduces some nifty callbacks:

  - `timeout: number`<br>
    mocks async for simple data before it gets written to state
  - `onInit: () => void`<br>
    this is run at the beginning of every async call and `status.type = 'LOADING'` is set here
  - `onError: (error: IError) => void`<br>
    runs on error and returns the error value. Also `status.type = 'ERROR'` and `status.message = error` are set here
  - `onSuccess: (resp: T) => void`<br>
    if all goes well, this callback will return the data after it's been written to state and `status.type = 'SUCCESS'` is set here
  - `wrapResp?: (...args: any[]) => T`<br>
    this bit wraps around the response and lets you edit it before it gets written to state

  `options` add a lot of flexibility to your code:

  ```javascript
  set(Promise(...), {
    timeout: 1234 // in case of promises/async timeout is ommited
    wrapResp: JSON.stringify,
    onInit: () => console.log('init'),
    onError: (error) => console.log('error', error),
    onSuccess: (resp) => console.log('resp', resp),
  });

  // or you can do
  const { api } = useChip('user');
  set(({ something }) => {
    something.anything = "I am potato";
  }, {
    timeout: 1234 // since plain data is being passed, the timeout applies
    wrapResp: JSON.stringify,
    onInit: () => {
      const persistSomething = api.get("theme");
      LocalStorage.set('key', persistSomething);
      componentRef.current = persistSomething;
    },
    onSuccess: (resp) => api.set(resp, "theme"), // we can update some other chips with the response
  })
  ```

- ## `api: Chipper.queryQueue()`

  The `api` property is taken 1:1 from `queryQueue()` method used in `Chipper` class, however, since it's used inside `useChip`, it informs other components about changes made to their state so they can re-render and update properly.

  **TIP:** Technically, you can use `api`'s `set` property to set `status` of every piece of state, but you HAVE TO pass a `chip` (not just plain data) as a first argument. This might come in handy if you wanna kick some other subscribed component into `LOADING` state

  ```javascript
  const { data, api } = useChip("user");

  const chip = {
    data: data || api.get("theme").data,
    status: { type: "LOADING" },
  };

  api.set(chip, "theme"); // this will do nothing to the component that runs it, but will update into "LOADING" state all other components subscribed to "theme" chip
  ```

  **NOTE:** I recommend this approach only if you know what you're doing, because passing incorrect data using this method will fuck shit up.

<br>
<br>

## [BACK TO README](../../README.md)
