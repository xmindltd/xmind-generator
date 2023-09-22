<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { Topic, Root, Relationship, Summary, generateWorkbook, Marker } from 'xmind-generator'
import { XMindEmbedViewer } from 'xmind-embed-viewer'

const embedViewerEl = ref<HTMLElement>()
const viewer = shallowRef<XMindEmbedViewer | null>(null)

const initViewer = () => {
  if (!embedViewerEl.value) return

  viewer.value = new XMindEmbedViewer({
    el: embedViewerEl.value
  })
}

const loadXmindFileToViewer = (xmindFile: ArrayBuffer) =>
  viewer.value && viewer.value.load(xmindFile)

const generateXmindFileOne = async () => {
  const imageBuffer = await fetch('xmind.jpeg').then(response => response.arrayBuffer())
  return generateWorkbook(
    Root('Grill House')
      .image(imageBuffer, 'jpeg')
      .children([
        Topic('Salad')
          .markers([Marker.Arrow.refresh])
          .children([
            Topic('Garden Salad').ref('topic:baz').labels(['Lemon Vinaigrette', 'Ginger Dressing']),
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
  ).archive()
}

const generateXmindFileTwo = async () => {
  const imageCoffeeBuffer = await fetch('coffee.svg').then(response => response.arrayBuffer())
  const imageClockBuffer = await fetch('clock.svg').then(response => response.arrayBuffer())
  return generateWorkbook(
    Root('Weekly Report').children([
      Topic("What  I've Done This Week")
        .image(imageCoffeeBuffer, 'svg')
        .markers([Marker.Star.red])
        .children([Topic('Item 1'), Topic('Item 2'), Topic('Item 3')]),
      Topic('My Plans for Next Week')
        .markers([Marker.Star.orange])
        .children([Topic('Item 1'), Topic('Item 2'), Topic('Item 3')]),
      Topic('Self-Reflection')
        .image(imageClockBuffer, 'svg')
        .markers([Marker.Star.purple])
        .children([
          Topic('Problems Encountered'),
          Topic('New Things Learnt'),
          Topic('Some Thoughts')
        ])
    ])
  ).archive()
}

const generateAndApplyToEmbedViewer = async (index: number) => {
  const xmindFile = index === 1 ? await generateXmindFileOne() : await generateXmindFileTwo()
  loadXmindFileToViewer(xmindFile)
}

onMounted(async () => {
  initViewer()
})
</script>

<template>
  <section>
    <h1 class="margin-small">Generate Xmind file and apply to Xmind embed viewer</h1>
    <div class="button-group margin-large-top">
      <button @click="() => generateAndApplyToEmbedViewer(1)">generate mindmap 1</button>
      <button @click="() => generateAndApplyToEmbedViewer(2)">generate mindmap 2</button>
    </div>
    <div ref="embedViewerEl" class="margin-small"></div>
  </section>
</template>

<style scoped>
h1 {
  font-size: 22px;
}

.margin-large-top {
  margin-top: 24px;
}

.margin-small {
  margin-top: 12px;
  margin-bottom: 12px;
}
.button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
