# xmind-generator

`xmind-generator` is a javascript module that creates mind maps and generates Xmind files in the same manner as Xmind UI applications.

It may be helpful to know a few basic concepts before using this module:<br>
An Xmind document is structured like a tree. The root component is called `Workbook`, which contains several sheets representing mind map panels. `Sheet` contain a `Root Topic` with possibly many child topics, and also that each child topic can be treated like the root of its own children.



## Contents

- [Install](#Install)
- [Usage](#usage)
- [Builder API](#builder-api)
- [Imperative API](#imperative-api)
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

**Creating document through `Workbook` instance**<br/>
After initializing a Workbook instance, you can operate directly on sheets and topics to create a new xmind document
> Read the [details](#interface).

```javascript
const workbook = new Workbook();
// If you create a single sheet workbook, you can use `createRoot` method of `workbook`,
// Such method directly creates a sheet attach to the workbook, as well as a root topic of the sheet.
const rootTopic = workbook.createRoot('Grill House');

const topic1 = rootTopic.addTopic('Salad');
topic1.addMarker(Marker.Arrow.refresh);

const subTopic1 = topic1.addTopic('Garden Salad', {labels: ['Lemon Vinaigrette', 'Ginger Dressing']});
const subTopic2 = topic1.addTopic('Tomato Salad');
topic1.addSummary('Get 10% off', subTopic1.id, subTopic2.id);

const topic2 = rootTopic.addTopic('Starters');
topic2.note = 'With free soft drink';

rootTopic.addSummary('Fresh and Delicious', topic1.id, topic2.id);

const subTopic3 = topic2.addTopic('Smoked Bacon');
const subTopic4 = topic2.addTopic('Fried Chicken', {labels: ['Hot Chilli']});

workbook.sheets[0].addRelationship('', topic1.id, topic2.id);
workbook.sheets[0].addRelationship('Special', subTopic3.id, subTopic4.id);
```

## Builder API

Both `Root` and `Topic` builders build a node of the Mindmap structure, while `Root` represents the root node, and connects other nodes via the `children` method.

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

Define markers `.markers(MarkerId[])`<br/>
```javascript
Topic('Salad').markers([Marker.Arrow.refresh, Marker.Task.quarter])
```
Define plain note Text. `.note(string)`<br/>
```javascript
Topic('Salad').note('This is a note')
```

Define array of labels. `.labels(string[])`<br/>
```javascript
Topic('Salad').labels(['Lemon Vinaigrette', 'Ginger Dressing'])
```

Define the topic image `.image(ImageSource, ImageType)`<br/>
&ensp;ImageSource accept `ArrayBuffer`, `Buffer`, `Blob`, `Uint8Array` and `encoded base64 string`
```javascript
Topic('Salad').image('data:image/png;base64,...', 'png')
```

Apply summaries `.summaries(Summary[])`
```javascript
Topic('Grill House').summaries([Summary('summary', { from: 'topic:foo', to: 'topic:bar' })])
// You can use either reference string or topic title as indicator,
// and make sure they are unique
```

Apply relationships `.relationships(Relationship[])`
```javascript
// Note: `relationships` method only available on `Root` builder
Root('Grill House').relationships([Relationship('title', { from: 'topic:foo', to: 'topic:bar' })])
```

## Imperative API

### Create a Xmind Workbook

The workbook is a temporary storage where all the data are written.

```javascript
const workbook = new Workbook();
```

### Add a sheet

A Workbook contains serval sheets which represent mind map panels.

```javascript
const sheet = workbook.addSheet('My Sheet');
```

**Access sheets**
```javascript
// Access sheets array in creation order
const sheets = workbook.sheets;
sheets[0]; // the first sheet
// Or just iterate all sheets by workbook.sheets.forEach
```

### Add root topic
A sheet contains only one `root topic`, which is the root of whole structure.

Note: It is essential to know that `addTopic` method of a sheet can only use once since there is only one root topic allowed

```javascript
const workbook = new Workbook();
const sheet = workbook.addSheet('My Sheet');
const rootTopic = sheet.addRootTopic('Topic 1')
```
**Access root topic**

```javascript
// Access root topic
const rootTopic = sheet.rootTopic
// Remove root topic
sheet.removeRootTopic()
```

**Specify topic attributes**

```javascript
topic.note = 'this is a note';
topic.addLabel('My Label');
topic.addMarker(Marker.Arrow.refresh)

// Also Use the second parameter of the addTopic method to specify attributes easily.
// For Example: Create a root topic with a text label and a note as well as a marker.
const rootTopic =
    sheet.addRootTopic('Topic 1', {
        labels: ['My label','Another Label'],
        note: 'This is a note'},
        markers: [Marker.Arrow.refresh]
    );
```
> [Full topic attributes list](#topic-attributes)


### Add a child topic to an existing topic
```javascript
const childTopic = topic.addTopic('Subtopic 1');

// Access child topics of parent topic
const childTopics = topic.children
childTopics[0] // The first child topic
```

### Add image to topic
```javascript
topic.addImage('data:image/png;base64,...', 'png') // accept ArrayBuffer, Buffer, Blob, Uint8Array and encoded base64 string

// For Node.js runtime, `readImageFile` helper is ready to use
const image = await readImageFile(path.resolve(__dirname, 'xmind.jpeg'))
topic.addImage(image.data, image.type)
```

### Apply a relationship between two Topics

The `relationship` is an object or called a description that describes the relation between two topic entities

```javascript
const topicFoo = topic.addTopic('Subtopic 1');
const topicBar = topic.addTopic('Subtopic 2');
const relationship = sheet.addRelationship('Relationship', topicFoo.id, topicBar.id);
// Note: relationship will be automatically discarded if any topics of it have been removed

// Access all relationships of sheet
const relationships = sheet.relationships;
relationships[0] // The first relationship object
```

### Apply a summary to Topic
The `summary` similar to `relationship`, is an object that describe which topics should be summarized
```javascript
const startTopic = topic.addTopic('Subtopic 1');
const siblingTopic = topic.addTopic('Subtopic 2');
const endTopic = topic.addTopic('Subtopic 3');

// create summary of above three three topics
const summary = topic.addSummary('My Summary', startTopic.id, endTopic.id);
// Note: startTopic and endTopic must be children of current Topic, otherwise the summary object is discarded.

// Access all summaries of topic
const summaries = topic.summaries;
summaries[0] // The first summary object
```

### Topic attributes

| Attribute | Description                                                                 | Default Value |
| --------- | ----------------------------------------------------------------------------| ------------- |
| labels    | Array of labels.                                                            | `[]`          |
| note      | Plain note text.                                                            | `null`        |
| markers   | Array of `MarkerId` object.                                                 | `[]`          |
## License

[MIT © Xmind LTD](../LICENSE)



