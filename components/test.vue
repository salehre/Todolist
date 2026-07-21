<template>
  <button
      :disabled="isLoading"
      :aria-busy="isLoading"
      :aria-label="isLoading ? 'Loading' : 'Button'"
      @click="handleClick"
      :class="[
      baseClass,
      variantClass,
      isLoading ? 'opacity-60 cursor-not-allowed' : '',
      className
    ]"
  >
    <!-- Spinner -->
    <span
        v-if="isLoading"
        class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
    />

    <!-- Text -->
    <span>
      {{ isLoading ? 'Loading...' : children }}
    </span>
  </button>
</template>

<script setup lang="ts">
type Variant = "primary" | "secondary" | "danger";

interface Props {
  children?: string;
  isLoading?: boolean;
  variant?: Variant;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  variant: "primary",
  className: "",
});

const emit = defineEmits<{
  (e: "click"): void;
}>();

const baseClass =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2";

const variantMap: Record<Variant, string> = {
  primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
  secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
  danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
};

const variantClass = variantMap[props.variant];

const handleClick = () => {
  if (!props.isLoading) {
    emit("click");
  }
};
</script>