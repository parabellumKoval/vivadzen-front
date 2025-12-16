<template>
  <div class="circle-slices">
    <svg
      class="circle-slices__svg"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g class="circle-slices__group">
        <path
          v-for="seg in segmentsData"
          :key="`fill-${seg.index}`"
          class="circle-slices__fill"
          :d="seg.fillPath"
          :fill="seg.fill"
        />
        <path
          v-for="seg in segmentsData"
          :key="`inner-${seg.index}`"
          class="circle-slices__inner-line"
          :d="seg.innerPath"
          fill="none"
          :stroke="seg.stroke"
          :stroke-width="seg.innerStrokeWidth"
          :stroke-dasharray="seg.dashed ? '3 3' : '0'"
        />
        <path
          v-for="seg in segmentsData"
          :key="`outer-${seg.index}`"
          class="circle-slices__outer-line"
          :d="seg.outerPath"
          fill="none"
          :stroke="seg.outerStroke"
          :stroke-width="seg.outerStrokeWidth"
          :stroke-dasharray="seg.dashed ? '2 1' : '0'"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SegmentStyle {
  fill?: string
  stroke?: string
  outerStroke?: string
  strokeWidth?: number
  outerStrokeWidth?: number
  innerStrokeWidth?: number
  dashed?: boolean
}

interface Props {
  /** Сколько долек */
  segments?: number
  /**
   * Общий угол, который занимает набор долек, в градусах.
   * Например:
   *  - 90  = четверть круга
   *  - 180 = полкруга
   *  - 360 = полный круг
   */
  totalAngle?: number
  /**
   * Угол, с которого начинается первая долька (в градусах).
   * 0° — вправо, 90° — вниз, -90° — вверх.
   */
  startAngle?: number
  /** Стили по умолчанию для всех долек */
  defaultFill?: string
  defaultStroke?: string
  defaultStrokeWidth?: number
  defaultOuterStroke?: string
  defaultOuterStrokeWidth?: number
  defaultInnerStrokeWidth?: number
  /** Индивидуальные стили долек (по индексу) */
  segmentStyles?: SegmentStyle[]
}

const props = withDefaults(defineProps<Props>(), {
  segments: 3,
  totalAngle: 90,         // по умолчанию четверть круга
  startAngle: -90,        // по умолчанию "сверху" вниз вправо
  defaultFill: '#FFE9CB',
  defaultStroke: '#FFB466',
  defaultInnerStrokeWidth: 0.8,
  defaultOuterStrokeWidth: 2,
  segmentStyles: () => [],
})

const toRad = (deg: number) => (deg * Math.PI) / 180

const segmentsData = computed(() => {
  const segCount = Math.max(1, props.segments)
  const totalAngle = props.totalAngle
  const step = totalAngle / segCount

  const cx = 100
  const cy = 100
  const r = 99 // чуть меньше 50, чтобы влезало с обводкой

  const defaultInnerStrokeWidth =
    props.defaultInnerStrokeWidth ?? props.defaultStrokeWidth
  const defaultOuterStrokeWidth =
    props.defaultOuterStrokeWidth ?? props.defaultStrokeWidth
  const defaultStrokeColor = props.defaultStroke
  const defaultOuterStrokeColor =
    props.defaultOuterStroke ?? defaultStrokeColor

  const result: {
    index: number
    fillPath: string
    outerPath: string
    innerPath: string
    fill: string
    stroke: string
    outerStroke: string
    innerStrokeWidth: number
    outerStrokeWidth: number
    dashed: boolean
  }[] = []

  for (let i = 0; i < segCount; i++) {
    const startDeg = props.startAngle + i * step
    const endDeg = props.startAngle + (i + 1) * step

    const largeArcFlag = step > 180 ? 1 : 0
    const sweepFlag = 1

    const x1 = cx + r * Math.cos(toRad(startDeg))
    const y1 = cy + r * Math.sin(toRad(startDeg))
    const x2 = cx + r * Math.cos(toRad(endDeg))
    const y2 = cy + r * Math.sin(toRad(endDeg))

    // Долька: из центра к первому краю, по дуге, обратно к центру
    const fillPath = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`,
      'Z',
    ].join(' ')

    const outerPath = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`,
    ].join(' ')

    const innerPath = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `M ${cx} ${cy}`,
      `L ${x2} ${y2}`,
    ].join(' ')

    const style = props.segmentStyles?.[i] ?? {}
    const innerStrokeWidth =
      style.innerStrokeWidth ??
      style.strokeWidth ??
      defaultInnerStrokeWidth
    const outerStrokeWidth =
      style.outerStrokeWidth ??
      style.strokeWidth ??
      defaultOuterStrokeWidth
    const stroke = style.stroke ?? defaultStrokeColor
    const outerStroke =
      style.outerStroke ?? style.stroke ?? defaultOuterStrokeColor

    result.push({
      index: i,
      fillPath,
      outerPath,
      innerPath,
      fill: style.fill ?? props.defaultFill,
      stroke,
      outerStroke,
      innerStrokeWidth,
      outerStrokeWidth,
      dashed: style.dashed ?? false,
    })
  }

  return result
})
</script>

<style scoped lang="scss">
.circle-slices {
  position: relative;
  width: 100%;
  height: 100%;

  &__svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  &__group {}

  &__inner-line,
  &__outer-line {
    stroke-linecap: round;
  }
}
</style>
