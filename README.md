# xmind-generator

`xmind-generator` is a javascript module that creates mind maps and generates Xmind files.

## Contents

- [Install](#Install)
- [Usage](#usage)
- [Interface](#interface)
- [Example](#example)
- [License](#license)

## Install
**Install `xmind-generator` with your favorite package manager:**

```sh
npm i xmind-generator
```

## Usage

**Build document**

```javascript
import { Topic, RootTopic, Relationship, Summary, Marker, Workbook, writeLocalFile, readLocalImage } from 'xmind-generator'
// Note: `readImageFile` helper is only available in the Node.js runtime
const image = await readImageFile(path.resolve(__dirname, 'xmind.jpeg'))
const workbook = Workbook(
  RootTopic('Grill House')
    .image(image)
    .children([
      Topic('Salad')
        .markers([Marker.Arrow.refresh])
        .children([
          Topic('Garden Salad')
            // Note: ref (aka "reference") is only used in building procedure, is not saved in exported Xmind file.
            .ref('topic:baz')
            .labels(['Lemon Vinaigrette', 'Ginger Dressing']),
          Topic('Tomato Salad').ref('topic:qux')
        ])
        .summaries([Summary('Get 10% off', { from: 'topic:baz', to: 'topic:qux' })]),
      Topic('Starters')
        .ref('topic:bar')
        .note('With free soft drink')
        .children([
          Topic('Smoked Bacon').ref('topic:fred'),
          Topic('Fried Chicken').ref('topic:thud').labels(['Hot Chilli'])
        ])
    ])
    .relationships([
      Relationship('', { from: 'Salad', to: 'topic:bar' }),
      Relationship('Special', { from: 'topic:fred', to: 'topic:thud' })
    ])
    .summaries([Summary('Fresh and Delicious', { from: 'Salad', to: 'topic:bar' })])
)
```

**Export and save to a local Xmind file**
```javascript
// Write to a local Xmind file
// Note: `writeLocalFile` helper is only available in the Node.js runtime
writeLocalFile(workbook, '...path to a file with the `.xmind` file extension')

// To use in a browser's JavaScript runtime, the ArrayBuffer to Xmind file can be
// generated by the `archive` method, then downloaded with the `.xmind` file extension
workbook.archive() // ArrayBuffer of document
```

## Interface

The main component of an Xmind document is a `Workbook` object, which contains multiple mind maps. Each mind map is formed as a hierarchical tree structure consisting of a set of `Topic` objects as its nodes, where a `RootTopic` object represents the root node as well as the containing mind map.

The `RootTopic` and `Topic` builders create nodes in the mind map structure. The `RootTopic` builder specifically builds the root node, which connects to other nodes through the `children` method.

 ```javascript
Workbook(
  RootTopic('Grill House')
  // Give the node a reference
  .ref('topic:inf')
  .children([
    Topic('Salad'),
    Topic('Starters')
  ])
)
// For building a multiple sheets structure,
// pass an array of `RootTopic` builders to `Workbook`
 ```

### `.markers(MarkerId[])`

Define markers.

```javascript
Topic('Salad').markers([Marker.Arrow.refresh, Marker.Task.quarter])
```

### `.note(string)`
Defines plain note Text.
```javascript
Topic('Salad').note('This is a note')
```

### `.labels(string[])`
Define array of labels.
```javascript
Topic('Salad').labels(['Lemon Vinaigrette', 'Ginger Dressing'])
```
### `.image(ImageSource)`
Defines an image for the topic. `ImageSource` can accept `ArrayBuffer`, `Buffer`, `Uint8Array` and `base64 encoded string`.
```javascript
Topic('Salad').image('data:image/png;base64,...')
```
### `.summaries(Summary[])`
Applies summaries.
```javascript
// You can use either a reference string or topic title as an indicator, and make sure they are unique.
Topic('Grill House').summaries([Summary('summary title..', { from: 'topic:foo', to: 'topic:bar' })])
```
### `.relationships(Relationship[])`
Applies relationships.
```javascript
// Note: `relationships` method is only available on the `RootTopic` builder
RootTopic('Grill House').relationships([Relationship('title...', { from: 'topic:foo', to: 'topic:bar' })])
```

## Example

- [The integration of xmind-generator with xmind-embed-viewer](examples/integration-embed-viewer/README.md)



## License

[MIT © Xmind LTD](./LICENSE)



