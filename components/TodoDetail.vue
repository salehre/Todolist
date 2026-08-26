<template>
  <div :class="[
    'md:rounded-ss-none rounded-2xl border border-primary-200/50 bg-primary-50/40 shadow-lg shadow-primary-200/40 backdrop-blur-sm flex flex-col h-full overflow-hidden',
    'w-full md:flex-1 md:w-0',
    !modelValue && isMobile ? 'hidden' : 'flex'
  ]">
    <div v-if="modelValue" class="h-full flex flex-col">

      <!-- Fixed Header -->
      <div class="shrink-0 bg-white/95 backdrop-blur-md border-b border-primary-200 shadow-sm z-10">
        <div class="max-w-4xl mx-auto px-4 md:px-4 py-4">
          <!-- ردیف دوم: استاتوس، تاریخ و دکمه‌ها -->
          <div class="flex justify-between items-center flex-wrap gap-3">
            <div class="flex items-center gap-3 flex-wrap">
              <!-- Status Badge -->
              <span :class="[
          'inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium',
          modelValue.completed ? 'bg-primary-50 text-primary-600' : 'bg-orange-50 text-orange-600'
        ]">
          <Icon class="mb-1" :icon="modelValue.completed ? 'tabler:checkbox' : 'eos-icons:hourglass'" />
          {{ modelValue.completed ? 'Completed' : 'Pending ..' }}
        </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                  @click="emit('edit-todo', modelValue.id)"
                  :disabled="modelValue.completed"
                  class="px-2 md:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Icon icon="mi:edit" class="sm:hidden" />
                <span class="hidden sm:inline">Edit</span>
              </button>
              <button
                  @click="emit('delete-todo', modelValue.id)"
                  class="px-2 md:px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-sm font-medium transition-all flex items-center gap-2"
              >
                <Icon icon="mingcute:delete-line" class="sm:hidden" />
                <span class="hidden sm:inline">Delete</span>
              </button>
              <!-- Back Button -->
              <button
                  @click="emit('back')"
                  :class="['flex items-center gap-1 px-2 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-all shrink-0', !showBackButton && !isMobile && 'hidden']"
              >
                <Icon icon="mingcute:left-line" class="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div class="p-4 md:p-6">
          <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden">

              <!-- Title Section -->
              <div class="p-6 md:p-8 border-b border-primary-100 bg-linear-to-r from-primary-50 to-white">
                <div class="flex items-start justify-between">
                  <!-- Complete Task Checkbox -->
                  <div class="pt-1.5 flex items-center px-3 shrink-0">
                    <input
                        type="checkbox"
                        :checked="modelValue.completed"
                        @change="emit('toggle-complete', modelValue.id)"
                        class=" w-4 h-4 md:w-5 md:h-5 accent-primary-600 cursor-pointer"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                      <span :class="[
                        'text-xl md:text-2xl font-bold wrap-break-word flex-1',
                        modelValue.completed ? 'line-through text-primary-400' : 'text-purple-950'
                      ]">
                        {{ modelValue.text }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description Section -->
              <div class="p-6 md:p-8">
                <div class="flex items-center gap-2 mb-4">
                  <Icon class="text-xl mb-2 text-primary-800" icon="ic:outline-description" />
                  <h3 class="text-lg font-semibold text-primary-800">Description</h3>
                </div>
                <div v-if="modelValue.description" class="bg-primary-50 rounded-xl p-4 md:p-6 text-gray-700 whitespace-pre-wrap leading-relaxed wrap-break-word">
                  {{ modelValue.description }}
                </div>
                <div v-else class="bg-primary-50 rounded-xl p-4 md:p-6 text-primary-400 text-center italic">
                  No description provided for this task.
                </div>
              </div>

              <!-- Progress Path Section -->
              <div class="p-6 md:p-8 bg-primary-50/30 border-t border-primary-100">
                <div class="flex flex-wrap items-center justify-between gap-y-2 mb-6">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-xl shrink-0"><Icon icon="ci:path" class="text-primary-800 mb-1" /></span>
                    <h3 class="text-base md:text-lg font-semibold text-primary-700 truncate">Progress Path</h3>
                    <span v-if="modelValue.steps && modelValue.steps.length > 0"
                        class="text-sm text-primary-500 font-medium shrink-0 whitespace-nowrap"
                    >
                      ({{ getCompletedStepsCount(modelValue) }}/{{ modelValue.steps.length }})
                    </span>
                  </div>
                  <div class="flex gap-2 shrink-0">
                    <button
                        v-if="modelValue.steps && modelValue.steps.length > 0"
                        @click="showClearStepsDialog = true"
                        class="px-3 py-2 bg-primary-100 text-primary-600 rounded-sm text-sm font-medium hover:bg-primary-200 transition-all flex items-center gap-1"
                    >
                      <Icon icon="tdesign:close-circle" class="sm:hidden" />
                      <span class="hidden sm:inline">Clear</span>
                    </button>
                    <button
                        @click="openStepsDialog"
                        class="px-3 md:px-4 py-2 bg-primary-600 text-white rounded-sm text-sm font-medium hover:bg-primary-700 transition-all flex items-center gap-1"
                    >
                      <Icon icon="solar:map-point-wave-outline" class="sm:hidden" />
                      <span class="hidden sm:inline">Manage Steps</span>
                    </button>
                  </div>
                </div>

                <!-- Linear Progress Path -->
                <div v-if="modelValue.steps && modelValue.steps.length > 0" class="relative">
                  <!-- Connection Line -->
                  <div class="absolute inset-s-5 md:inset-s-7.5 top-0 bottom-0 w-0.5 bg-primary-200">
                    <div
                        class="w-full bg-linear-to-b from-primary-500 to-primary-600 transition-all duration-500"
                        :style="{ height: getStepsProgress(modelValue) + '%' }"
                    ></div>
                  </div>

                  <div class="md:space-y-4 space-y-2">
                    <div
                        v-for="(step, index) in modelValue.steps"
                        :key="step.id"
                        class="relative flex items-center gap-3 md:gap-4"
                    >
                      <!-- Step Number Circle -->
                      <div class="relative inset-s-1.5 md:inset-s-2.25 z-10 shrink-0">
                        <div :class="[
                          'w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center text-xs md:text-xl font-bold transition-all duration-300 border-2',
                          step.completed
                            ? 'bg-linear-to-br from-primary-500 to-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200'
                            : index === getCurrentIncompleteIndex(modelValue)
                            ? 'bg-white border-primary-500 text-primary-600 shadow-md'
                            : 'bg-white border-primary-200 text-primary-300'
                        ]">
                          <span class="md:pt-1 md:ps-0.5"> {{ index + 1 }} </span>
                        </div>
                      </div>
                      <div :class="[
                        'flex-1 rounded-xl px-3 py-2 md:px-4 md:py-3 border transition-all',
                        step.completed
                          ? 'bg-linear-to-r from-primary-50 to-white border-primary-200'
                          : index === getCurrentIncompleteIndex(modelValue)
                          ? 'bg-white border-primary-500 shadow-md'
                          : 'bg-white border-primary-100 opacity-60'
                      ]">
                        <div class="flex items-center justify-between gap-2 md:gap-3">
                          <div class="flex-1">
                            <p :class="[
                              'text-xs md:text-sm font-medium',
                              step.completed
                                ? 'text-primary-400 line-through'
                                : index === getCurrentIncompleteIndex(modelValue)
                                ? 'text-primary-800'
                                : 'text-gray-400'
                            ]">{{ step.text }}</p>
                            <p class="text-xs mt-1">
                              <span v-if="step.completed" class="text-emerald-700"> Completed</span>
                              <span v-else-if="index === getCurrentIncompleteIndex(modelValue)" class="text-yellow-800 font-medium"> Current Step</span>
                              <span v-else class="text-primary-900"> Waiting for previous steps</span>
                            </p>
                          </div>
                          <div class="flex items-center gap-2 shrink-0">
                            <button
                                v-if="canUndoStep(modelValue, index)"
                                @click="handleUndoStep(step.id)"
                                class="px-2 md:px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs hover:bg-orange-100 transition-all flex items-center gap-1"
                            >
                              <Icon icon="solar:undo-left-linear" class="sm:hidden" />
                              <span class="hidden sm:inline">Undo</span>
                            </button>
                            <input
                                type="checkbox"
                                :checked="step.completed"
                                @change="handleCompleteStep(step.id)"
                                :disabled="!canCompleteStep(modelValue, index)"
                                class="w-4 h-4 md:w-5 md:h-5 accent-primary-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="flex flex-col items-center py-8">
                  <div class="text-4xl text-primary-400 mb-3"><Icon icon="ci:path" /></div>
                  <p class="text-primary-400 text-sm tracking-wide"> create a path for your task</p>
                </div>
              </div>

              <!-- Footer: Date -->
              <div class="px-6 md:px-8 py-3 border-t border-primary-100 bg-primary-50/40 flex items-center justify-end gap-1.5 text-xs text-primary-500">
                <Icon icon="solar:calendar-line-duotone" />
                <span>{{ formatDate(modelValue.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="hidden md:flex items-center justify-center h-full">
      <div class="text-center text-primary-400">
        <div class="text-6xl mb-4 flex justify-center"><Icon icon="line-md:clipboard-list" /></div>
        <h3 class="text-xl font-medium mb-2">No Task Selected</h3>
        <p class="text-sm">Click on any task from the list to see details</p>
      </div>
    </div>

    <!-- Clear Steps Dialog -->
    <div v-if="showClearStepsDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showClearStepsDialog = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
        <div class="p-6 flex flex-col items-center text-center">
          <div class="text-5xl mb-2"><Icon class="text-primary-900" icon="quill:folder-trash" /></div>
          <h3 class="text-xl font-bold text-primary-800 mb-2">Clear All Steps</h3>
          <p class="text-primary-600 text-sm mb-2">Are you sure you want to clear all steps?</p>
        </div>
        <div class="flex gap-3 p-6 border-t border-primary-100 bg-primary-50/50 rounded-b-2xl">
          <button @click="showClearStepsDialog = false" class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all">Cancel</button>
          <button @click="confirmClearSteps" class="flex-1 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-medium transition-all">Clear All</button>
        </div>
      </div>
    </div>

    <!-- Steps Management Dialog -->
    <div v-if="showStepsDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeStepsDialog">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col">

        <!-- Header -->
        <div class="flex items-start justify-between gap-3 px-6 py-4">
            <h1 class="mt-1 block text-primary-500">{{ modelValue?.text }}</h1>
          <button @click="closeStepsDialog" class="shrink-0 text-primary-400 hover:text-primary-600 text-2xl">✕</button>
        </div>

        <!-- Preview -->
        <div class="p-6 bg-primary-50/50 border-b border-primary-100">
          <div class="text-xs text-primary-600 mb-3 font-medium">{{ t('preview').toUpperCase() }}</div>
          <div class="flex items-center gap-2 flex-wrap">
            <template v-for="(step, index) in stepsDraft" :key="step.id">
              <div class="flex items-center gap-1">
                <div :class="[
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
              index === 0 ? 'bg-primary-500 text-white' : 'bg-primary-200 text-primary-600'
            ]">{{ index + 1 }}</div>
                <span class="text-xs text-primary-700 truncate max-w-25">
              {{ step.text || `${t('step')} ${index + 1}` }}
            </span>
              </div>
              <div v-if="index < stepsDraft.length - 1" class="w-4 h-0.5 bg-primary-300"></div>
            </template>
          </div>
        </div>

        <!-- Ordered toggle -->
        <div class="px-6 pt-4">
          <label class="flex items-center gap-2 text-sm text-primary-700 cursor-pointer">
            <input
                type="checkbox"
                v-model="unorderedSteps"
                class="w-4 h-4 accent-primary-600 rounded"
            />
            می‌خوام استپ‌ها رو بدون رعایت ترتیب کامل کنم
          </label>
        </div>

        <!-- Steps List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
          <div v-for="(step, index) in stepsDraft" :key="step.id" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600 shrink-0">
              {{ index + 1 }}
            </div>
            <input
                v-model="step.text"
                type="text"
                :placeholder="`${t('step')} ${index + 1}...`"
                class="flex-1 px-3 py-2 rounded-lg border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none text-sm"
            />
            <button @click="removeStepFromDraft(index)" class="text-primary-400 hover:text-primary-600 transition-all shrink-0">
              <Icon icon="mingcute:delete-line" class="text-lg" />
            </button>
          </div>
          <button
              @click="addStepToDraft"
              class="w-full py-2 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 hover:bg-primary-50 transition-all text-sm flex items-center justify-center gap-1"
          >
            <Icon icon="mingcute:add-line" /> {{ t('addStepPoint') }}
          </button>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 p-6 border-t border-primary-100 bg-primary-50/50 rounded-b-2xl">
          <button @click="closeStepsDialog" class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all">
            {{ t('cancel') }}
          </button>
          <button @click="saveSteps" class="flex-1 px-4 py-2 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all">
            {{ t('saveSteps') }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { Todo, Step, StepDraft } from '~/types/todoType'
import { useLocale } from '~/composables/useLocale'

// ─── Props ───────────────────────────────────────────────────────────────────
const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  showBackButton: {
    type: Boolean,
    default: false
  }
})

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  'update:modelValue': [todo: Todo | null]
  'toggle-complete': [todoId: number]
  'edit-todo': [todoId: number]
  'delete-todo': [todoId: number]
  'back': []
  'update-steps': [todoId: number, steps: Step[]]
  'complete-step': [todoId: number, stepId: number]
  'undo-step': [todoId: number, stepId: number]
}>()

// ─── Local State ──────────────────────────────────────────────────────────────
const showClearStepsDialog = ref<boolean>(false)
const unorderedSteps       = ref(false)
const showStepsDialog      = ref<boolean>(false)
const stepsDraft           = ref<StepDraft[]>([])
const { isMobile }         = useResponsiveMode()
const { t } = useLocale()

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('fa-IR')
}

function getCurrentIncompleteIndex(todo: Todo): number {
  return todo.steps.findIndex((step: Step) => !step.completed)
}

function getCompletedStepsCount(todo: Todo): number {
  return todo.steps.filter((s: Step) => s.completed).length
}

function getStepsProgress(todo: Todo): number {
  if (!todo.steps.length) return 0
  return Math.round((getCompletedStepsCount(todo) / todo.steps.length) * 100)
}

function canCompleteStep(todo: Todo, index: number): boolean {
  if (!todo.steps.length) return false
  if (index === 0) return !todo.steps[index].completed
  return todo.steps[index - 1].completed && !todo.steps[index].completed
}

function canUndoStep(todo: { steps: string | any[]; }, index: number) {
  if (!todo.steps?.length) return false
  return todo.steps[index].completed &&
      (index === todo.steps.length - 1 || !todo.steps[index + 1]?.completed)
}

function handleCompleteStep(stepId: number) {
  emit('complete-step', props.modelValue.id, stepId)
}

function handleUndoStep(stepId: number) {
  emit('undo-step', props.modelValue.id, stepId)
}

// ─── Steps Dialog ─────────────────────────────────────────────────────────────
function openStepsDialog(): void {
  if (!props.modelValue) return
  stepsDraft.value = props.modelValue.steps?.length
      ? props.modelValue.steps.map((s: { id: any; text: any; }) => ({ id: s.id, text: s.text }))
      : [{ id: Date.now(), text: '' }]
  unorderedSteps.value = !(props.modelValue?.orderedSteps ?? true)
  showStepsDialog.value = true
}

function closeStepsDialog(): void {
  showStepsDialog.value = false
  stepsDraft.value = []
}

function addStepToDraft(): void {
  stepsDraft.value.push({ id: Date.now() + Math.random(), text: '' })
}

function removeStepFromDraft(index: number): void {
  if (stepsDraft.value.length === 1) {
    stepsDraft.value[0].text = ''
  } else {
    stepsDraft.value.splice(index, 1)
  }
}

function saveSteps(): void {
  if (!props.modelValue) return
  const existingIds = new Set((props.modelValue.steps ?? []).map(s => s.id))

  const validSteps = stepsDraft.value
      .filter(s => s.text.trim())
      .map(s => {
        const isExisting = existingIds.has(s.id)
        const existing = props.modelValue.steps?.find(e => e.id === s.id)
        return {
          id: isExisting ? s.id : null, // فقط step هایی که از قبل بودن id واقعی میگیرن
          text: s.text.trim(),
          completed: existing ? existing.completed : false
        }
      })
  emit('update-steps', props.modelValue.id, validSteps)
  closeStepsDialog()
}

function confirmClearSteps(): void {
  if (!props.modelValue) return
  emit('update-steps', props.modelValue.id, [])
  showClearStepsDialog.value = false
}

</script>

<style scoped>
.a{
  owerflow: hidden
}
</style>