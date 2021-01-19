# Chipper

Chipper is a micro state-management tool aimed at perfect (for me 🤡 ) developer experience and idiot-proof 🙈 🙉 🙊 (because I need it) API.<br>
Chipper is my personal experiment. I needed to learn about classes and observables. Context API has been great for me in all my personal projects, but using observables solves more problems.

## Wat? 🗿

- written with TS
- react and react-native friendly
- [immer](https://immerjs.github.io/immer/docs/introduction) is used somewhere inside 🎉
- built-in capabilities for handling status of async functions
- almost framework-agnostic (because there's a hook you can use if you want)

## Why?

I got bored with conventional solutions (looking at you, Redux). Don't get me wrong, [Redux](https://redux.js.org/) is a great tool (especially now, when [redux-toolkit](https://redux-toolkit.js.org/) is a thing), but setting up global store and making it work with [TypeScript](https://www.typescriptlang.org/) is always a treat...<br>
Since I don't get to set up a fresh redux store very often, I always have to re-learn the docs in order to have the whole thing working the way I like. Well, not anymore.<br>
Chipper's API reflects my idea of a perfect state-management tool. Experience may vary 🤷

## How?

```
yarn add @chipper

npm install @chipper
```

The tool consists of two elements: `Chipper` class instance and `useChipper` hook, however, you don't have to use the hook, because state can be accessed from outside of react components. It won't be reactive though, so no rendering logic to keep everything in check.

### 1) `Chipper`

First, let's set up the initial store (you can omit this step):

```
import Chipper from '@chipper';

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }],
  ["friends", { joey: "how you doin'?" }]
]);

// or you can lazy-load them in other components
Chipper.createQueue([["user", { uid: "12345", name: "piglet" }]]);
//
Chipper.createQueue([["theme", { dark: true, color: "pink" }]]);
```

As you can see, we pass an array of tuples to a `.createQueue()` method. We do that, because the store is built on top of a `Map()` instance (why rewrite something that works great out of the box, right?)<br>

You can go commando and use `Chipper`'s methods to read and set up the store yourself from somewhere random and/or outside of React with `.queryQueue()`. You don't have to use `.createQueue()` to populate the state, however it takes precedence over other methods.

```
import Chipper from '@chipper';

// add to Chipper somewhere in your code
Chipper.queryQueue('user', { uid: "12345", name: "piglet" });

// or
Chipper.queryQueue('user').set({ uid: "12345", name: "piglet" });

// or if for some reason you want to change other chips from other chips
Chipper.queryQueue('theme').get() // -> { dark: true, color: "pink" }
Chipper.queryQueue('user').set({ dark: false, color: "purple" }, "theme"); // notice the second string argument "theme" passed to the .set() function
Chipper.queryQueue('theme').get() // -> { dark: false, color: "purple" }


// grab default from Chipper somewhere else in your code
Chipper.queryQueue('user').get() // -> { uid: "12345", name: "piglet" }

// or if you want to grab other chips' state from other chips
Chipper.queryQueue('user').get('theme') // -> { dark: false, color: "purple" }

```

These are some of the building blocks of `useChipper` hook.
I had a case of having to update state outside of React once, so I wanted to make sure I'll have an easy way of adding data from wherever, whenever.

Check [here]() to learn more.

### 2) `useChipper`

If you work with React/React-Native do yourself a favor and `useChipper`. It's easier that way.<br>
`useChipper` handles rerendering and subscription to state of the components that use it.

#### a) read

To read the chip use `data` and/or `status` props from the returned object.
`data` can be changed by you, `status` is handled by the hook:

```
import { useChipper } from '@lumberyard/chipper';

const MyComponent = () => {
  const { data, status } = useChipper('user');

  console.log(data); // -> { uid: "12345", name: "piglet" }
  console.log(status); // -> { type: "IDLE" | "LOADING" | "ERROR" | "SUCCESS", message: Error | string | undefined }

  return (...)
}
```

#### b) write

`useChipper` gives you a bunch of options to add data to state:

```
import { useChipper } from '@lumberyard/chipper';

const MyComponent = () => {
  const { set } = useChipper('user');

  // using primitives
  set('hello world');

  // using selectors
  set((draft) => {
    draft.uid = 'new_uid';
  });

  // using mocked primitives
  set('hello world', { timeout: 2000 });

  // using mocked selectors
  set((draft) => {
    draft.uid = 'new_uid';
  }, { timeout: 2000 });

  // using async
  set(new Promise(...));

  return (...)
}
```

#### c) meddle

`useChipper` also introduces `api` property with access to some lower level `Chipper` methods. You can go naughty and put your hands on state in other chips from here. It is the exact same Chipper API, so these changes do not rerender subscribed components, just update the state:

```
import { useChipper } from '@lumberyard/chipper';

const MyComponent = () => {
  const { api } = useChipper('user');

  api.set({ dark: false, color: "purple" }) // -> updates 'user' data
  api.set({ dark: false, color: "purple" }, "theme") // -> updates 'theme' data
  api.get() // -> grabs 'user' state
  api.get('theme') // -> grabs 'theme' state
  api.cut() // -> removes 'user' chip
  api.cut('theme') // -> removes 'theme' chip

  return (...)
}
```

## Chipper API

Chipper's store consists of smaller pieces of state calles "chips".
Chips are objects...

```
const chip = {
  data: {...},
  status: { type: '...', message: '...'}
}
```

... stored inside a `Map()` instance like so: `new Map().set('key', chip)`

### 1) `Chipper` props

- `createQueue(queue: IQueue): void`<br>
  TS: `type IQueue<T = IData> = [string, T][];`<br>
  This method loads chips into Chipper. It takes the tuple's second item and turns it into a chip

- `queryQueue(key: string, data: IData): IQuery`<br>
  This method returns an object with properties:
  - `get(cKey?: string): IChip`
  - `set(data: IData | IChip, cKey?: string): void` ->
  - `cut(cKey?: string): boolean` ->

## Examples

#### 1) Basic

```
import Chipper, { useChipper } from '@lumberyard/chipper';

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }],
  ["friends", { joey: "how you doin'?" }]
]);

const MyComponent = () => {
  const { data, status, set } = useChipper('user');

  return (...)
}

```

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**
