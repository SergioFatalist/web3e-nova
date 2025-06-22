<template>
  <div class="row">
    <div class="col-auto">
      <q-btn
        :href="url"
        target="_top"
        color="secondary"
        icon="file_download"
        :size="props.size"
        :class="`q-mr-${props.size}`"
        outline
        dense
        download
      />
      <q-btn
        :icon="isPlaying ? 'pause' : 'play_arrow'"
        :color="isPlaying ? 'positive' : 'primary'"
        :size="props.size"
        :class="`q-mr-${props.size}`"
        outline
        dense
        @click.prevent="onPlayPause"
      />
      <q-btn
        :color="isPlaying ? 'warning' : 'dark'"
        :disable="!isPlaying"
        icon="stop"
        :size="props.size"
        :class="`q-mr-${props.size}`"
        outline
        dense
        @click.prevent="onStop"
      />
      <q-btn
        :color="isPlaying ? 'warning' : 'dark'"
        :disable="!isPlaying"
        :size="props.size"
        :class="`q-mr-${props.size}`"
        outline
        dense
        @click.prevent="onDouble"
        >{{ isDouble ? "1x" : "2x" }}</q-btn
      >
    </div>
    <div class="col text-left q-pl-md">
      <q-slider
        v-if="isPlaying"
        ref="p"
        v-model="current"
        :min="0"
        :max="max"
        class="vertical-middle"
        :dense="props.size == 'xs'"
        dark
        @update:model-value="updateCurrent"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EventBus } from "quasar";
import { inject, ref } from "vue";

const $eventbus = <EventBus>inject("$eventbus");

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "xs",
  },
});

const isPlaying = ref(false);
const isDouble = ref(false);
const audio = new Audio(props.url);

const current = ref();
const max = ref();

const p = ref();

audio.setAttribute("type", "audio/wav");
audio.preload = "none";
audio.onload = () => (current.value = audio.duration);
audio.onended = () => (isPlaying.value = false);
audio.onpause = () => (isPlaying.value = false);
audio.onplay = () => (isPlaying.value = true);
audio.ontimeupdate = () => {
  max.value = Math.round(audio.duration);
  current.value = Math.round(audio.currentTime);
};

$eventbus.on("playrecording", (url: string) => {
  if (url != props.url) {
    audio.pause();
    audio.currentTime = 0;
  }
});

function updateCurrent() {
  audio.currentTime = current.value;
}
function onPlayPause() {
  console.log(props.url);
  if (isPlaying.value) {
    audio.pause();
  } else {
    audio.play();
    $eventbus.emit("playrecording", props.url);
  }
}

function onStop() {
  audio.pause();
  audio.currentTime = 0;
}

function onDouble() {
  audio.playbackRate = isDouble.value ? 1 : 2;
  isDouble.value = !isDouble.value;
}
</script>
