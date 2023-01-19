# Usage

**Building document**
```javascript
const workbook = new Workbook();
// If you create a single sheet workbook, you can use `createRoot` method of `workbook`,
// which directly creates a sheet attach to the workbook, as well as a root topic
const rootTopic = workbook.createRoot('Grill House');

const topic1 = rootTopic.addTopic('Salad');
const subTopic1 = topic1.addTopic('Garden Salad', {labels: ['Lemon Vinaigrette', 'Ginger Dressing']});
const subTopic2 = topic1.addTopic('Tomato Salad');

const topic2 = rootTopic.addTopic('Starters');
topic2.addNotes(['With free soft drink']);
const subTopic3 = topic2.addTopic('Smoked Bacon');
const subTopic4 = topic2.addTopic('Fried Chicken', {labels: ['Hot Chilli']});
 
topic1.addMarker([Marker.Arrow.refresh, Marker.Flag.darkBlue]);

workbook.sheets[0].addRelationship('', topic1.id, topic2.id);
workbook.sheets[0].addRelationship('Special', subTopic3.id, subTopic4.id);
workbook.sheets[0].addSummary('Fresh and Delicious', subTopic1.id, subTopic2.id);

workbook.save(filepath);
```

**There is also a faster way to build the same document**

```javascript
const workbook = builder().root(
    topic('Grill House').children([
        topic('Salad', { ref: 'topic:foo', marker: [Marker.Arrow.refresh, Marker.Flag.darkBlue]}).children([
            topic('Garden Salad', { ref: 'topic:baz', labels: ['Lemon Vinaigrette', 'Ginger Dressing']})
            topic('Tomato Salad', { ref: 'topic:qux' })
        ]),
        topic('Starters' { ref: 'topic:bar', note: ['With free soft drink']}).children([
            topic('Smoked Bacon', { ref: 'topic:fred' })
            topic('Fried Chicken', { ref: 'topic:thud', labels: ['Hot Chilli']})
        ]),
    ]).relationships([
        relationship('', { from: { ref: 'topic:foo' }, to: { ref: 'topic:bar' }}),
        relationship('Special', { from: { ref: 'topic:fred' }, to: { ref: 'topic:thud' }}),
    ]).summaries([
        summary('Fresh and Delicious', { start: { ref: 'topic:baz' }, end: { ref: 'topic:qux' }})
    ])
).build()
```


# Interface

## Create a Xmind Workbook

The workbook is a temporary storage where all the data are written.

```javascript
const workbook = new Workbook();
```

## Add a Sheet

A Workbook contains serval sheets which represent mind map panels.

```javascript
const sheet = workbook.addSheet('My Sheet');
```

## Remove a Sheet
Use the sheet `id` to remove the sheet from workbook.
```javascript
// Create a worksheet
const sheet = workbook.addSheet('My Sheet');
// Remove the worksheet using worksheet id
workbook.removeSheet(sheet.id)
```

## Access Sheets
```javascript
// access sheets array in creation order
const sheets = workbook.sheets;
sheets[0]; // the first sheet
// Or just iterator all sheets by workbook.sheets.forEach

// fetch sheet by name/id
const worksheet = workbook.getSheet('My Sheet');
```

## Add Root Topic
A sheet contains only one `root topic`, which is the root of whole structure.

Note: It is essential to know that `addTopic` method of a sheet can only use once since there is only one root topic allowed

```javascript
const workbook = new Workbook();
const sheet = workbook.addSheet('My Sheet');
const rootTopic = sheet.addTopic('Topic 1')

// Specify properties
topic.addNotes(['My Note', 'Another Note']);
topic.labels  = ['My Label'];
topic.addMarker([Marker.Arrow.refresh, Marker.Flag.darkBlue])

// Also Use the second parameter of the addTopic method to specify properties for the topic easily.
// For Example: Create a central topic with a text label and a note
const rootTopic = sheet.addTopic('Topic 1', {labels: ['My label','Another Label'], note: 'This is a note'});
```

**Fetch Root topic**
```javascript
const rootTopic = sheet.topic
```

## Remove Root Topic
```javascript
sheet.removeRootTopic();
```

## Add a child topic to an existing topic
```javascript
// Add subtopic is just like addTopic function of sheet object
const childTopic = topic.addTopic('Subtopic 1');
```
**Access child topic**

```javascript
// Fetch a topic by id
const childTopic = topic.getTopic(id);

// Access all child topics of parent topic
const childTopics = topic.subtopics
childTopics[0] // The first subtopic
```

## Remove child Topic
Use the topic `id` to remove the subtopic from parent topic.
```javascript
const topic = sheet.addTopic('Topic 1');
const childTopic = topic.addTopic('Subtopic 1');
topic.removeTopic(childTopic.id);
```

## Apply relationship between two Topics

The `relationship` is an object or called a description that describes the relation between two topic entities

```javascript
const topicFoo = topic.addTopic('Subtopic 1');
const topicBar = topic.addTopic('Subtopic 2');
const relationship = sheet.addRelationship('Relationship', topicFoo.id, topicBar.id);
// Note: relationship will be automatically discarded if any topics of it have been removed
```
**Access relationship**

```javascript
// Fetch a relationship by topic Id
const relationship = sheet.getRelationship(topicFoo.id); // topicBar.id is either supported

// Access all relationships of sheet
const relationships = sheet.relationships;
relationships[0] // The first relationship object
```
## Remove a relationship 
```javascript
// remove a relationship by its id
const relationship = sheet.getRelationship(topic.id);
sheet.removeRelationship(relationship.id);

// remove all relationships related to a topic
sheet.removeRelationship(topic.id);
```


## Apply summary to Topics
The `summary` similar to `relationship`, is an object that describe which topics should be summarized
```javascript
const startTopic = topic.addTopic('Subtopic 1');
const siblingTopic = topic.addTopic('Subtopic 2');
const endTopic = topic.addTopic('Subtopic 3');

// create summary of above three three topics
const summary = sheet.addSummary('My Summary', startTopic.id, endTopic.id);
// Note: startTopic and endTopic must be sibling topics with a same parent Topic 
```
**Access summary**

```javascript
// Fetch a summary by topic's Id that is summarized
const getSummary = sheet.getSummary(startTopic.id);

// Access all summaries of sheet
const summaries = sheet.summaries;
summaries[0] // The first summary object
```

## Remove a Summary 
```javascript
// remove a summary by its id
const summary = sheet.getSummary(topic.id);
sheet.removeSummary(summary.id);
```



