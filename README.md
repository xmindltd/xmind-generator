# xmind-generator

`xmind-generator` is a javascript module that creates mind maps and generate Xmind files in the same manner as Xmind UI applications.

Some essential concepts you need to know in order to use this module conveniently:
An Xmind document is structured like a tree. The root component is called `Workbook`, which contains several sheets representing mind map panels. `Sheet` contain a `Root Topic` with possibly many child topics, and also that each child topic can be treated like the root of its own children.



## Contents

- [Install](#Install)
- [Usage](#usage)
- [Interface](#interface)
- [License](#license)

## Install
This is install information
## Usage

**Building document**

After you initialize a Workbook instance, you can operate directly on sheets and topics in order to create a new xmind document

```javascript
const workbook = new Workbook();
// If you create a single sheet workbook, you can use `createRoot` method of `workbook`,
// Such method directly creates a sheet attach to the workbook, as well as a root topic of the sheet.
const rootTopic = workbook.createRoot('Grill House');

const topic1 = rootTopic.addTopic('Salad');
const subTopic1 = topic1.addTopic('Garden Salad', {labels: ['Lemon Vinaigrette', 'Ginger Dressing']});
const subTopic2 = topic1.addTopic('Tomato Salad');
topic1.addMarker(Marker.Arrow.refresh);
topic1.addSummary('Get 10% off', subTopic1.id, subTopic2.id);

const topic2 = rootTopic.addTopic('Starters');
topic2.note = 'With free soft drink';
const subTopic3 = topic2.addTopic('Smoked Bacon');
const subTopic4 = topic2.addTopic('Fried Chicken', {labels: ['Hot Chilli']});


workbook.sheets[0].addRelationship('', topic1.id, topic2.id);
workbook.sheets[0].addRelationship('Special', subTopic3.id, subTopic4.id);
rootTopic.addSummary('Fresh and Delicious', topic1.id, topic2.id);
```

**There is also a faster way to build the same document**

```javascript
const workbook = builder().create([
    root('Grill House').children([
        topic('Salad', { ref: 'topic:foo', marker: [Marker.Arrow.refresh]}).children([
            topic('Garden Salad', { ref: 'topic:baz', labels: ['Lemon Vinaigrette', 'Ginger Dressing']}),
            topic('Tomato Salad', { ref: 'topic:qux' })
        ]).summaries([
          summary('Get 10% off', { start: { ref: 'topic:baz' }, end: { ref: 'topic:qux' }})
        ]),
        topic('Starters', { ref: 'topic:bar', note: 'With free soft drink'}).children([
            topic('Smoked Bacon', { ref: 'topic:fred' }),
            topic('Fried Chicken', { ref: 'topic:thud', labels: ['Hot Chilli']})
        ]),
    ]).relationships([
        relationship('', { from: { ref: 'topic:foo' }, to: { ref: 'topic:bar' }}),
        relationship('Special', { from: { ref: 'topic:fred' }, to: { ref: 'topic:thud' }})
    ]).summaries([
        summary('Fresh and Delicious', { start: { ref: 'topic:foo' }, end: { ref: 'topic:bar' }})
    ])
]).build()
```

**Export and save to local xmind file**
```javascript
// Archive a workbook
const document = workbook.archive()
// Write to local xmind file
// Note: `saveLocal` helper only available in the Node.js runtime
helper.saveLocal(document, '...path to an exist directory')
```


## Interface

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

### Remove a sheet
Use the sheet `id` to remove the sheet from workbook.
```javascript
// Create a worksheet
const sheet = workbook.addSheet('My Sheet');
// Remove the worksheet using worksheet id
workbook.removeSheet(sheet.id)
```

**Access sheets**
```javascript
// access sheets array in creation order
const sheets = workbook.sheets;
sheets[0]; // the first sheet
// Or just iterator all sheets by workbook.sheets.forEach
```

### Add root topic
A sheet contains only one `root topic`, which is the root of whole structure.

Note: It is essential to know that `addTopic` method of a sheet can only use once since there is only one root topic allowed

```javascript
const workbook = new Workbook();
const sheet = workbook.addSheet('My Sheet');
const rootTopic = sheet.addRootTopic('Topic 1')

// Specify properties
topic.note = 'this is a note';
topic.addLabel('My Label');
topic.addMarker(Marker.Arrow.refresh)

// Also Use the second parameter of the addTopic method to specify properties for the topic easily.
// For Example: Create a central topic with a text label and a note
const rootTopic = sheet.addRootTopic('Topic 1', {labels: ['My label','Another Label'], note: 'This is a note'}, markers: [Marker.Arrow.refresh]);

// Access root topic
const rootTopic = sheet.rootTopic
// Remove root topic
sheet.removeRootTopic()
```

### Add a child topic to an existing topic
```javascript
// Add child topic is just like addTopic function of sheet object
const childTopic = topic.addTopic('Subtopic 1');

// Access child topics of parent topic
const childTopics = topic.children
childTopics[0] // The first child topic
```

### Remove a child Topic
Use the topic `id` to remove the subtopic from parent topic.
```javascript
const topic = sheet.addTopic('Topic 1');
const childTopic = topic.addTopic('Subtopic 1');
topic.removeTopic(childTopic.id);
```

### Query a topic
Use the `query` method to fetch a topic through id
```javascript
workbook.query(topic.id)
sheet.query(topic.id)
parentTopic.query(topic.id)
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
### Remove a relationship
```javascript
// remove a relationship by its id
sheet.removeRelationship(relationship.id);

// remove relationships related to a topic
sheet.removeRelationship(topic.id);
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

### Remove a summary
```javascript
// remove a summary by its id
topic.removeSummary(summary.id);
// remove summaries of topic related to one of its children
topic.removeSummary(childTopic.id)
```

## License

[MIT © Xmind LTD](../LICENSE)



