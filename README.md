# xmind-generator

`xmind-generator` is a javascript module that creates mind maps and generates Xmind files in the same manner as Xmind UI applications.

## Contents

- [Install](#Install)
- [Usage](#usage)
- [Interface](#interface)
- [License](#license)

## Usage

**Building document**

```javascript
// Note: `readImageFile` helper only available in the Node.js runtime
const image = await helper.readImageFile(path.resolve(__dirname, 'xmind.jpeg'))
const workbook = generateWorkbook(
  Root('Grill House')
    .image(image.data, image.type)
    .children([
      Topic('Salad')
        .markers([Marker.Arrow.refresh])
        .children([
          Topic('Garden Salad')
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

**Export and save to local xmind file**
```javascript
// Write to local xmind file
// Note: `saveLocal` helper only available in the Node.js runtime
helper.saveLocal(workbook, '...path to an existing directory')

// To use in browser javascript runtime, the ArrayBuffer to xmind file can be
// generate by `archive` method, then download it with `.xmind` file extension
workbook.archive() // ArrayBuffer of document
```

## Interface

Before using this module, it's useful to understand the basic concepts of Xmind documents. These documents are structured as trees with a `Workbook` as the root component, containing multiple sheets representing mind map panels. Each sheet has a Root `Topic` and child topics, which can be treated as the root of their own children.

The `Root` and `Topic` builders create nodes in the Mindmap structure, The `Root` builder specifically builds the root node, which connects to other nodes through the `children` method.

 ```javascript
generateWorkbook(
  Root('Grill House')
  // give the root node a reference
  .ref('topic:inf')
  .children([
    Topic('Salad'),
    Topic('Starters')
  ])
)
// For building a multiple sheets structure,
// passing an array of `Root` builder to `generateWorkbook`
 ```

#### `.markers(MarkerId[])`

Define markers.

```javascript
Topic('Salad').markers([Marker.Arrow.refresh, Marker.Task.quarter])
```

#### `.note(string)`
Define plain note Text.
```javascript
Topic('Salad').note('This is a note')
```

#### `.labels(string[])`
Define array of labels.
```javascript
Topic('Salad').labels(['Lemon Vinaigrette', 'Ginger Dressing'])
```
#### `.image(ImageSource, ImageType)`
Define the topic image. ImageSource accept `ArrayBuffer`, `Buffer`, `Blob`, `Uint8Array` and `base64 encoded string`.
```javascript
Topic('Salad').image('data:image/png;base64,...', 'png')
```
#### `.summaries(Summary[])`
Apply summaries.
```javascript
Topic('Grill House').summaries([Summary('summary', { from: 'topic:foo', to: 'topic:bar' })])
// You can use either reference string or topic title as indicator, and make sure they are unique.
```
#### `.relationships(Relationship[])`
Apply relationships.
```javascript
// Note: `relationships` method only available on `Root` builder
Root('Grill House').relationships([Relationship('title', { from: 'topic:foo', to: 'topic:bar' })])
```


## License

[MIT © Xmind LTD](../LICENSE)



