<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'

// Вложите вашу карту в assets и импортните как сырой текст
// (Vite/NUXT поддерживает ?raw для инлайнинга)
import worldSvg from '~/assets/eu.svg?raw'

type Payload = { id: string | null; name: string | null; el?: SVGPathElement | null }

// Внешние входы для «обратной» подсветки
const props = defineProps<{
  activeIds?: string[]        // какие страны подсветить «как выбранные» (по id)
  activeNames?: string[]      // какие страны подсветить «как выбранные» (по name)
  hoverIds?: string[]         // какие страны подсветить при ховере списка (по id)
  hoverNames?: string[]       // какие страны подсветить при ховере списка (по name)
}>()

const emit = defineEmits<{
  (e: 'country-hover', payload: Payload): void
  (e: 'country-leave', payload: Payload): void
  (e: 'country-click', payload: Payload): void
}>()

const holder = ref<HTMLDivElement | null>(null)
let svgRoot: SVGSVGElement | null = null

// Безопасный CSS.escape для querySelector
const cssEscape = (value: string) =>
  (window as any).CSS?.escape ? (window as any).CSS.escape(value) : value.replace(/["\\]/g, '\\$&')

const getAllPaths = () =>
  svgRoot ? Array.from(svgRoot.querySelectorAll<SVGPathElement>('path[id], path[name]')) : []

const byId = (id: string) => (svgRoot ? svgRoot.querySelector<SVGPathElement>(`path[id="${cssEscape(id)}"]`) : null)
const byNameAll = (name: string) =>
  svgRoot ? Array.from(svgRoot.querySelectorAll<SVGPathElement>(`path[name="${cssEscape(name)}"]`)) : []

// Массовое обновление классов подсветки
const applyHighlightClasses = () => {
  if (!svgRoot) return
  const activeIdSet = new Set(props.activeIds ?? [])
  const activeNameSet = new Set(props.activeNames ?? [])
  const hoverIdSet = new Set(props.hoverIds ?? [])
  const hoverNameSet = new Set(props.hoverNames ?? [])

  for (const p of getAllPaths()) {
    p.classList.remove('is-active', 'is-list-hover')
  }

  // По id
  for (const id of activeIdSet) {
    const el = byId(id && id.toUpperCase())
    if (el) el.classList.add('is-active')
  }
  for (const id of hoverIdSet) {
    const el = byId(id && id.toUpperCase())
    if (el) el.classList.add('is-list-hover')
  }
  // По name (могут быть несколько path)
  for (const name of activeNameSet) {
    for (const el of byNameAll(name)) el.classList.add('is-active')
  }
  for (const name of hoverNameSet) {
    for (const el of byNameAll(name)) el.classList.add('is-list-hover')
  }
}

onMounted(async () => {
  // Вставляем сырой SVG внутрь контейнера
  holder.value!.innerHTML = worldSvg
  await nextTick()
  svgRoot = holder.value?.querySelector('svg') ?? null
  if (!svgRoot) return

  // Делаем фокусируемыми по Tab (доступность)
  for (const p of getAllPaths()) {
    p.setAttribute('tabindex', '0')
    p.setAttribute('role', 'button')
    p.setAttribute('data-country-id', p.getAttribute('id') ?? '')
    p.setAttribute('data-country-name', p.getAttribute('name') ?? '')
  }

  // Делегирование: один набор слушателей на весь <svg>
  svgRoot.addEventListener('mouseover', (e) => {
    const p = (e.target as Element)?.closest?.('path') as SVGPathElement | null
    if (!p) return
    p.classList.add('is-hover')
    emit('country-hover', { id: p.getAttribute('id'), name: p.getAttribute('name'), el: p })
  })
  svgRoot.addEventListener('mouseout', (e) => {
    const p = (e.target as Element)?.closest?.('path') as SVGPathElement | null
    if (!p) return
    p.classList.remove('is-hover')
    emit('country-leave', { id: p.getAttribute('id'), name: p.getAttribute('name'), el: p })
  })
  svgRoot.addEventListener('click', (e) => {
    const p = (e.target as Element)?.closest?.('path') as SVGPathElement | null
    if (!p) return
    emit('country-click', { id: p.getAttribute('id'), name: p.getAttribute('name'), el: p })
  })
  // Поддержка клавиатуры (Enter/Space)
  // svgRoot.addEventListener('keydown', (e: KeyboardEvent) => {
  //   const p = (e.target as Element)?.closest?.('path') as SVGPathElement | null
  //   if (!p) return
  //   if (e.key === 'Enter' || e.key === ' ') {
  //     e.preventDefault()
  //     emit('country-click', { id: p.getAttribute('id'), name: p.getAttribute('name'), el: p })
  //   }
  // })

  applyHighlightClasses()
})

// Любые изменения входных подсветок мгновенно применяем
watch(
  () => [props.activeIds, props.activeNames, props.hoverIds, props.hoverNames],
  () => applyHighlightClasses(),
  { deep: true }
)
</script>

<style src="./world-map.scss" lang="sass" scoped />

<template>
  <div class="world-map">
    <!-- Инлайним SVG сюда -->
    <div ref="holder" class="world-map-holder" />
  </div>
</template>

