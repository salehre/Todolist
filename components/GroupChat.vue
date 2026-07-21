<template>
  <div :class="[
    'flex flex-col h-full bg-white/30 backdrop-blur-sm w-full flex-1',
    { 'hidden': isMobile && hideMobile }
  ]">

    <!-- Header -->
    <div class="shrink-0 bg-white/90 backdrop-blur-md md:rounded-ss-none rounded-t-2xl border-b border-primary-200/60 shadow-sm relative z-50">
      <div class="px-5 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Group Avatar -->
          <div class="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-200 z-50">
            <Icon icon="solar:users-group-rounded-bold" class="text-white text-xl" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-primary-900">Project Team</h2>
            <p class="text-xs text-primary-400">{{ onlineMembers.length }} online · {{ members.length }} members</p>
          </div>
        </div>

        <div class="flex items-center gap-2 relative">
          <button
              @click="emit('open-tasks')"
              class="md:hidden flex items-center gap-2 px-2 py-2 text-sm text-primary-700 transition-colors"
              v-tooltip="'Show Tasks'"
          >
            <Icon icon="solar:checklist-minimalistic-linear" class="text-lg" />
          </button>

          <button
              @click="showSearch = !showSearch; showHeaderMenu = false"
              :class="['flex items-center gap-2 px-2 py-2 text-sm transition-colors', showSearch ? 'text-primary-600' : 'text-primary-700']"
          >
            <Icon icon="boxicons:search" class="text-lg" />
          </button>

          <button
              @click.stop="showHeaderMenu = !showHeaderMenu"
              class="p-2 rounded-full text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all"
              v-tooltip="'More options'"
          >
            <Icon icon="mage:dots" class="text-xl" />
          </button>

          <!-- Dropdown Menu -->
          <div
              v-if="showHeaderMenu"
              class="absolute right-2 top-full mt-0 z-60 bg-white rounded-xl shadow-xl py-2 min-w-45 animate-in fade-in zoom-in-95 duration-200"
          >
            <button
                @click="emit('toggle-filter'); showHeaderMenu = false"
                class="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors"
            >
              Filter messages
            </button>

            <button
                @click="emit('toggle-group-info'); showHeaderMenu = false"
                class="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors border-t border-primary-100 mt-1"
            >
              Group info
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div v-if="showSearch" class="shrink-0 px-3 py-2 bg-white relative z-9999 animate-in fade-in slide-in-from-top-2 duration-200">
      <div class="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2.5">
        <Icon icon="solar:magnifer-linear" class="text-primary-400 shrink-0" />
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search messages..."
            class="flex-1 bg-transparent text-sm text-primary-800 placeholder-primary-300 focus:outline-none"
            autofocus
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="text-primary-300 hover:text-primary-500 shrink-0">
          <Icon icon="mingcute:close-line" />
        </button>
      </div>
    </div>

    <!-- Pinned Messages Bar -->
    <div v-if="pinnedMessages.length > 0" :class="[ 'pb-2 shrink-0 px-5 pt-3 absolute top-18 left-0 right-0 z-30',
      showSearch ? 'pt-17' : 'pt-3'
    ]" >
      <button
          @click="showPinnedDialog = true"
          class="w-full mx-auto flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-primary-200/60 shadow-lg shadow-primary-200/20 hover:shadow-primary-200/40 transition-all group"
      >
        <Icon icon="iconoir:pin" class="text-primary-500 -rotate-45 text-sm shrink-0" />
        <span class="text-sm text-primary-700 flex-1 text-left truncate">
      {{ pinnedMessages[0].text }}
    </span>
        <span class="text-xs text-primary-400 bg-primary-200/50 px-2 py-0.5 rounded-full font-medium shrink-0">
      {{ pinnedMessages.length }} pinned
    </span>
      </button>
    </div>

    <!-- Pinned Messages Dialog -->
    <Teleport to="body">
      <div
          v-if="showPinnedDialog"
          class="fixed inset-0 z-50 flex items-center justify-center"
          @click.self="showPinnedDialog = false"
      >
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[70vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <!-- Dialog Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-primary-100">
            <div class="flex items-center gap-2">
              <Icon icon="iconoir:pin" class="text-primary-500 -rotate-45 text-lg" />
              <h3 class="text-base font-bold text-primary-900">Pinned Messages</h3>
              <span class="text-xs text-primary-400 bg-primary-50 px-2 py-0.5 rounded-full">{{ pinnedMessages.length }}</span>
            </div>
            <button @click="showPinnedDialog = false" class="p-1.5 rounded-full hover:bg-primary-50 text-primary-400 hover:text-primary-600 transition">
              <Icon icon="mingcute:close-line" class="text-lg" />
            </button>
          </div>

          <!-- Dialog Content -->
          <div class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            <div
                v-for="msg in pinnedMessages"
                :key="msg.id"
                @click="scrollToMessage(msg.id); showPinnedDialog = false"
                class="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-50 transition-all cursor-pointer group/item"
            >
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Icon icon="iconoir:pin" class="text-primary-500 -rotate-45 text-sm" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-xs font-medium text-primary-800">{{ getMemberName(msg.senderId) }}</span>
                  <span class="text-[10px] text-primary-300">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <p class="text-sm text-primary-600 line-clamp-2">{{ msg.text }}</p>
              </div>
              <button
                  @click.stop="unpinMessage(msg.id)"
                  class="shrink-0 p-1.5 rounded-lg bg-primary-100 text-primary-500 opacity-0 transition-all"
                  v-tooltip="'Unpin'"
              >
                <Icon icon="ri:unpin-fill" class="text-sm -rotate-45" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Messages Area -->
    <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar min-h-0 space-y-1"
    >
      <template v-for="(group, date) in groupedMessages" :key="date">
        <div class="flex items-center gap-3 my-4">
          <div class="flex-1 h-px bg-primary-100"></div>
          <span class="text-xs text-primary-300 px-2 py-1 bg-white/60 rounded-full">{{ date }}</span>
          <div class="flex-1 h-px bg-primary-100"></div>
        </div>

        <template v-for="(msg, index) in group" :key="msg.id">
          <!-- System Message -->
          <div v-if="msg.type === 'system'" class="flex justify-center my-2">
            <div class="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full border border-primary-100">
              <Icon icon="mingcute:check-circle-line" class="text-primary-500 text-sm" />
              <span class="text-xs text-primary-500">{{ msg.text }}</span>
            </div>
          </div>

          <!-- Regular Message -->
          <div
              :id="`message-${msg.id}`"
              :class="[
              'flex gap-2 group relative transition-all duration-500',
              msg.senderId === currentUser.id ? 'flex-row-reverse' : 'flex-row',
              isSameSenderAsPrev(group, index) ? 'mt-0.5' : 'mt-3',
              highlightedMessageId === msg.id ? 'bg-primary-100/50 rounded-xl -mx-2 px-2 py-1' : ''
            ]"
          >
            <div class="shrink-0 w-8">
              <div
                  v-if="!isSameSenderAsPrev(group, index)"
                  :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm', getMemberById(msg.senderId)?.avatarBg ?? 'bg-primary-400']"
              >
                {{ getMemberName(msg.senderId)[0] }}
              </div>
            </div>

            <div class="flex-1 max-w-[72%] relative">
              <span
                  v-if="!isSameSenderAsPrev(group, index) && msg.senderId !== currentUser.id"
                  class="text-xs text-primary-500 font-medium mb-1 ml-1 block"
              >
                {{ getMemberName(msg.senderId) }}
              </span>

              <div class="relative group/message">
                <!-- Message Bubble -->
                <div
                    :class="[
                    'px-3 py-1 my-px rounded-[20px] text-[16px] leading-relaxed',
                    msg.senderId === currentUser.id
                      ? 'bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-200'
                      : 'bg-white text-primary-800 shadow-sm border border-primary-100'
                  ]"
                >

                  <!-- Reply Preview -->
                  <div v-if="msg.replyTo" :class="[
                    'text-xs px-3 py-2 rounded-[11px] mb-1.5 mt-2 border-primary-400 bg-primary-50 max-w-full',
                  ]">
                    <div class="divide-y divide-blue-900 w-full h-px"></div>
                    <span class="font-medium text-primary-500">{{ getMemberName(getMessageById(msg.replyTo)?.senderId ?? 0) }}</span>
                    <p class="text-primary-400 truncate">{{ getMessageById(msg.replyTo)?.text }}</p>
                  </div>

                  <!-- File Attachment Display -->
                  <div v-if="msg.attachment" class="mb-2">
                    <div v-if="msg.attachment.type === 'image'" class="rounded-lg overflow-hidden max-w-50">
                      <img :src="msg.attachment.url" :alt="msg.attachment.name" class="w-full h-auto cursor-pointer hover:opacity-90 transition" @click="previewImage(msg.attachment.url)" />
                    </div>
                    <div v-else class="flex items-center gap-2 p-2 bg-white/20 rounded-lg">
                      <Icon :icon="getFileIcon(msg.attachment.name)" class="text-2xl" />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium truncate">{{ msg.attachment.name }}</p>
                        <p class="text-[10px] opacity-70">{{ formatFileSize(msg.attachment.size) }}</p>
                      </div>
                      <a :href="msg.attachment.url" download class="hover:scale-110 transition">
                        <Icon icon="solar:download-linear" class="text-sm" />
                      </a>
                    </div>
                  </div>

                  <!-- Voice Message Display -->
                  <div v-if="msg.voiceMessage" class="mb-2 min-w-50">
                    <div class="flex items-center gap-2">
                      <button @click="toggleVoicePlayback(msg.id)" class="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition">
                        <Icon :icon="isPlaying(msg.id) ? 'solar:pause-bold' : 'solar:play-bold'" class="text-sm" />
                      </button>
                      <div class="flex-1">
                        <div class="relative h-1 bg-white/30 rounded-full overflow-hidden">
                          <div class="absolute inset-y-0 left-0 bg-white rounded-full" :style="{ width: getPlaybackProgress(msg.id) + '%' }"></div>
                        </div>
                        <div class="flex justify-between mt-1">
                          <span class="text-[10px] opacity-70">{{ formatDuration(msg.voiceMessage.duration) }}</span>
                          <span class="text-[10px] opacity-70">
                            <Icon icon="solar:microphone-bold" class="text-xs inline" /> Voice message
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Todo Reference -->
                  <div v-if="msg.todoRef" :class="[
                    'flex items-center gap-2 px-3 py-2 rounded-xl mb-1.5 bg-primary-50 border border-primary-200 text-xs text-primary-700 cursor-pointer hover:bg-primary-100 transition-all',
                    msg.senderId === currentUser.id ? 'rounded-tr-sm' : 'rounded-tl-sm'
                  ]" @click="emit('view-todo', msg.todoRef!)">
                    <Icon icon="mingcute:task-2-line" class="text-primary-500 shrink-0" />
                    <span class="font-medium">Task: {{ msg.todoRef.text }}</span>
                    <span :class="['ml-auto px-1.5 py-0.5 rounded-full text-xs font-medium', priorityColors[msg.todoRef.priority]]">
                      {{ msg.todoRef.priority }}
                    </span>
                  </div>

                  <!-- Message Text -->
                  <div>
                    <span v-if="searchQuery && msg.text.toLowerCase().includes(searchQuery.toLowerCase())" v-html="highlightText(msg.text, searchQuery)"></span>
                    <span v-else>{{ msg.text }}</span>
                  </div>

                  <!-- Timestamp & Reactions -->
                  <div class="flex flex-wrap items-center justify-between gap-2 mt-2 pt-1">
                    <div :class="['flex items-center gap-1', msg.senderId === currentUser.id ? 'justify-end' : 'justify-start']">

                      <Icon
                          v-if="msg.senderId === currentUser.id"
                          :icon="msg.read ? 'solar:check-read-linear' : 'solar:check-linear'"
                          :class="['text-xs', msg.read ? 'text-emerald-300' : 'text-primary-300']"
                      />
                      <span :class="['text-[12px]', msg.senderId === currentUser.id ? 'text-primary-400' : 'text-primary-300']">
                        {{ formatTime(msg.timestamp) }}
                      </span>

                      <!-- Pinned Indicator -->
                      <div v-if="msg.pinned" class="flex items-center gap-1 mb-1">
                        <Icon icon="iconoir:pin" class="text-primary-600 text-xs" />
                      </div>

                      <div v-if="msg.edited" class="text-[10px] opacity-70 ml-1"><Icon icon="mdi:edit-outline" class="text-blue-600 text-xs" /></div>

                    </div>

                    <div v-if="msg.reactions && Object.keys(msg.reactions).length > 0" class="flex flex-wrap gap-1">
                      <button
                          v-for="(users, emoji) in msg.reactions"
                          :key="emoji"
                          @click="toggleReaction(msg.id, String(emoji))"
                          :class="[
                          'flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all',
                          hasUserReacted(msg.id, String(emoji))
                            ? 'bg-primary-200/80 text-primary-700'
                            : msg.senderId === currentUser.id
                            ? 'bg-white/20 text-white/80 hover:bg-white/30'
                            : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                        ]"
                      >
                        {{ emoji }} <span>{{ (users as number[]).length }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Message Actions Button -->
                <button
                    @click="toggleMenu(msg.id, $event)"
                    :class="[
                      'absolute top-1/3 -translate-y-1/2 opacity-0 group-hover/message:opacity-100 transition-all duration-200 hover:scale-110',
                      'p-1.5 rounded-full',
                      msg.senderId === currentUser.id ? '-left-6' : '-right-6'
                    ]"
                >
                  <Icon icon="mage:dots" class="text-primary-500 text-lg" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </template>

      <!-- Typing Indicator -->
      <div v-if="typingUsers.length > 0" class="flex items-center gap-2 mt-2 ml-10">
        <div class="flex gap-1 bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-primary-100">
          <span class="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
        <span class="text-xs text-primary-400">{{ typingText }}</span>
      </div>

      <div ref="bottomAnchor"></div>
    </div>

    <!-- Message Action Menu -->
    <Teleport to="body">
      <div
          v-if="activeMenuId !== null && activeMenu"
          ref="menuElRef"
          @click.stop
          class="fixed z-100 bg-white rounded-lg shadow-xl py-1 min-w-40 menu-pop"
          :style="{ top: menuStyle.top + 'px', left: menuStyle.left + 'px', transformOrigin: menuOrigin }"
      >
        <!-- Quick Emoji Reactions -->
        <div class="flex gap-1 px-2 py-1.5 border-b max-w-40 overflow-x-auto scrollbar-thin border-primary-100">
          <button
              v-for="emoji in quickEmojis"
              :key="emoji"
              @click="toggleReaction(activeMenu.id, emoji); activeMenuId = null"
              class="text-base hover:scale-125 transition-transform px-1 hover:bg-primary-50 rounded"
          >{{ emoji }}</button>
        </div>

        <button @click="copyMessage(activeMenu.text); activeMenuId = null" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
          <Icon icon="solar:copy-linear" class="text-primary-500 text-sm" />
          Copy
        </button>

        <button @click="replyTo = activeMenu; activeMenuId = null" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
          <Icon icon="solar:reply-linear" class="text-primary-500 text-sm" />
          Reply
        </button>

        <button v-if="activeMenu.senderId === currentUser.id" @click="startEdit(activeMenu); activeMenuId = null" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
          <Icon icon="mi:edit" class="text-primary-500 text-sm" />
          Edit
        </button>

        <button @click="togglePin(activeMenu.id); activeMenuId = null" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
          <Icon :icon="activeMenu.pinned ? 'ri:unpin-line' : 'iconoir:pin'" class="text-primary-500 text-sm" />
          {{ activeMenu.pinned ? 'Unpin' : 'Pin' }}
        </button>

        <button v-if="activeMenu.senderId === currentUser.id" @click="deleteMessage(activeMenu.id); activeMenuId = null" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 transition-colors">
          <Icon icon="mingcute:delete-line" class="text-primary-500 text-sm" />
          Delete
        </button>
      </div>
    </Teleport>

    <!-- Scroll to Bottom Button -->
    <div v-if="unreadCount > 0 && !isNearBottom" class="absolute bottom-24 right-6 z-20">
      <button @click="scrollToBottom" class="flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-full text-xs font-medium shadow-lg hover:bg-primary-600 transition-all">
        <Icon icon="mingcute:arrow-down-line" />
        {{ unreadCount }} new
      </button>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="previewImageUrl" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" @click="previewImageUrl = null">
      <div class="max-w-[90vw] max-h-[90vh]" @click.stop>
        <img :src="previewImageUrl" class="max-w-full max-h-[90vh] object-contain rounded-lg"  alt="" />
        <button @click="previewImageUrl = null" class="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
          <Icon icon="mingcute:close-line" class="text-white text-xl" />
        </button>
      </div>
    </div>

    <!-- Voice Recording UI -->
    <div v-if="isRecording" class="shrink-0 mx-4 mb-2 px-4 py-3 bg-red-50 rounded-xl border border-red-200 flex items-center gap-3">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-red-600 font-medium">Recording... {{ formatDuration(recordingDuration) }}</span>
      </div>
      <div class="flex-1">
        <div class="h-1 bg-red-200 rounded-full overflow-hidden">
          <div class="h-full bg-red-500 rounded-full transition-all duration-1000" :style="{ width: recordingProgress + '%' }"></div>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="cancelRecording" class="p-2 rounded-lg bg-white text-red-600 hover:bg-red-100 transition">
          <Icon icon="mingcute:close-line" />
        </button>
        <button @click="sendVoiceMessage" class="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
          <Icon icon="solar:plain-bold" />
        </button>
      </div>
    </div>

    <!-- Reply Preview -->
    <div v-if="replyTo" class="shrink-0 mx-4 mb-2 px-3 py-2 bg-primary-50 rounded-xl border border-primary-200 flex items-center gap-2">
      <div class="flex-1">
        <p class="text-xs font-medium text-primary-500">Replying to {{ getMemberName(replyTo.senderId) }}</p>
        <p class="text-xs text-primary-400 truncate">{{ replyTo.text }}</p>
      </div>
      <button @click="replyTo = null" class="text-primary-400 hover:text-primary-600">
        <Icon icon="mingcute:close-line" />
      </button>
    </div>

    <!-- Edit Preview -->
    <div v-if="editingMessage" class="shrink-0 mx-4 mb-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
      <Icon icon="mi:edit" class="text-amber-500 shrink-0" />
      <p class="text-xs text-amber-600 flex-1 truncate">Editing: {{ editingMessage.text }}</p>
      <button @click="cancelEdit" class="text-amber-400 hover:text-amber-600">
        <Icon icon="mingcute:close-line" />
      </button>
    </div>

    <!-- Input Area -->
    <div ref="inputAreaRef" class="shrink-0 fixed bottom-0 right-0 left-0 px-4 pb-4 pt-2">
      <div class="bg-white rounded-2xl border border-primary-200 shadow-sm overflow-hidden">

        <!-- Attachment Menu -->
        <div v-if="showAttachMenu" class="px-4 pt-3 pb-2 border-b border-primary-100">
          <p class="text-xs text-primary-400 mb-2 font-medium">Attach & Share</p>

          <label class="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-primary-50 hover:bg-primary-100 transition-all text-sm text-primary-700 cursor-pointer mb-1">
            <Icon icon="solar:gallery-linear" class="text-primary-500" />
            Upload Image
            <input type="file" accept="image/*" class="hidden" @change="handleFileSelect($event, 'image')" />
          </label>

          <label class="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-primary-50 hover:bg-primary-100 transition-all text-sm text-primary-700 cursor-pointer mb-1">
            <Icon icon="solar:document-linear" class="text-primary-500" />
            Upload File
            <input type="file" class="hidden" @change="handleFileSelect($event, 'file')" />
          </label>

          <button @click="showCreateTodoInline = !showCreateTodoInline; showAttachMenu = false" class="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-primary-50 hover:bg-primary-100 transition-all text-sm text-primary-700 mt-1">
            <Icon icon="mingcute:task-2-line" class="text-primary-500" />
            Create Task
          </button>
        </div>

        <!-- Inline Todo Creation -->
        <div v-if="showCreateTodoInline" class="px-4 pt-3 pb-2 border-b border-primary-100 space-y-2">
          <p class="text-xs text-primary-500 font-semibold flex items-center gap-1">
            <Icon icon="mingcute:task-2-line" /> New Task
          </p>
          <input
              v-model="inlineTodo.title"
              type="text"
              placeholder="Task title *"
              class="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
          />
          <textarea
              v-model="inlineTodo.description"
              rows="2"
              placeholder="Description (optional)"
              class="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 resize-none"
          ></textarea>
          <div class="flex gap-2">
            <select v-model="inlineTodo.priority" class="flex-1 px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary-200 text-primary-700 font-medium">
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <button @click="createTodoFromChat" :disabled="!inlineTodo.title.trim()" class="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-all disabled:opacity-50">
              Create
            </button>
            <button @click="showCreateTodoInline = false" class="px-3 py-2 text-primary-400 hover:text-primary-600">
              <Icon icon="mingcute:close-line" />
            </button>
          </div>
        </div>

        <!-- Main Input Row -->
        <div class="flex items-end gap-1.5 p-2">
          <!-- Voice Record Button -->
          <button
              v-if="!isRecording"
              @click="startRecording"
              :class="['p-2 rounded-xl transition-all shrink-0', isRecording ? 'bg-red-100 text-red-500' : 'text-primary-400 hover:bg-primary-50 hover:text-primary-500']"
              v-tooltip="'Record voice message'"
          >
            <Icon icon="solar:microphone-bold" class="text-lg" />
          </button>

          <!-- Attachment Button -->
          <button
              @click="showAttachMenu = !showAttachMenu"
              :class="['p-2 rounded-xl transition-all shrink-0', showAttachMenu ? 'bg-primary-100 text-primary-600' : 'text-primary-400 hover:bg-primary-50 hover:text-primary-500']"
              v-tooltip="'Attach file or image'"
          >
            <Icon icon="solar:paperclip-linear" class="text-lg" />
          </button>

          <!-- Text Input -->
          <textarea
              ref="inputRef"
              v-model="inputText"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact="inputText += '\n'"
              rows="1"
              placeholder="Type a message..."
              class="flex-1 resize-none bg-transparent text-sm text-primary-800 placeholder-primary-300 focus:outline-none max-h-32 leading-relaxed py-1.5"
              style="field-sizing: content"
          ></textarea>

          <!-- Send Button -->
          <button
              @click="sendMessage"
              :disabled="!inputText.trim()"
              :class="[
              'p-2.5 rounded-xl transition-all shrink-0',
              inputText.trim()
                ? 'bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-200 hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-primary-100 text-primary-300 cursor-not-allowed'
            ]"
              v-tooltip="'Send message'"
          >
            <Icon icon="solar:plain-bold" class="text-base" />
          </button>
        </div>
      </div>
    </div>

    <!-- Click away overlay for message menu -->
    <div v-if="activeMenuId" class="fixed inset-0 z-10" @click="activeMenuId = null"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { Todo, Priority } from '~/types/todoType'
import { useToast } from "vue-toastification";

const toast = useToast();

interface Member {
  id: number
  name: string
  avatarBg: string
  online: boolean
}

interface Attachment {
  name: string
  size: number
  type: 'image' | 'file'
  url: string
}

interface VoiceMessage {
  blob: Blob
  url: string
  duration: number
}

interface Reaction {
  [emoji: string]: number[]
}

interface Message {
  id: number
  senderId: number
  text: string
  timestamp: Date
  type: 'text' | 'system'
  read: boolean
  pinned: boolean
  edited: boolean
  replyTo: number | null
  reactions: Reaction
  todoRef: Pick<Todo, 'id' | 'text' | 'priority'> | null
  attachment?: Attachment
  voiceMessage?: VoiceMessage
}

interface InlineTodoForm {
  title: string
  description: string
  priority: Priority
}

const props = defineProps<{
  todos?: Todo[]
  hideMobile?: boolean
}>()

const emit = defineEmits<{
  'create-todo': [title: string, description: string, priority: Priority]
  'view-todo': [todo: Pick<Todo, 'id' | 'text' | 'priority'>]
  'toggle-filter': []
  'toggle-group-info': []
  'open-tasks': []
}>()

const currentUser: Member = { id: 1, name: 'You', avatarBg: 'bg-primary-500', online: true }

const members = ref<Member[]>([
  { id: 1, name: 'You',    avatarBg: 'bg-primary-500',   online: true  },
  { id: 2, name: 'Sara',   avatarBg: 'bg-violet-500', online: true  },
  { id: 3, name: 'Ali',    avatarBg: 'bg-sky-500',    online: false },
  { id: 4, name: 'Mina',   avatarBg: 'bg-emerald-500',online: true  },
  { id: 5, name: 'Reza',   avatarBg: 'bg-amber-500',  online: false },
])

const onlineMembers = computed<Member[]>(() => members.value.filter(m => m.online))

const messages = ref<Message[]>([
  {
    id: 1, senderId: 2, text: "سلام! جلسه فردا ساعت ۱۰ هست 📅",
    timestamp: new Date(Date.now() - 3600000 * 3), type: 'text',
    read: true, pinned: true, edited: false, replyTo: null, reactions: { '👍': [1, 3] }, todoRef: null
  },
  {
    id: 2, senderId: 1, text: "اوکی، آماده‌ام. باید قبلش تسک‌های باقیمونده رو ببندیم",
    timestamp: new Date(Date.now() - 3600000 * 2.5), type: 'text',
    read: true, pinned: true, edited: false, replyTo: 1, reactions: {}, todoRef: null
  },
  {
    id: 3, senderId: 4, text: "من یه تسک جدید برای ریفکتور API اضافه کردم 👇",
    timestamp: new Date(Date.now() - 3600000 * 2), type: 'text',
    read: true, pinned: false, edited: false, replyTo: null, reactions: { '🔥': [1, 2] }, todoRef: null
  },
  {
    id: 4, senderId: 3, text: "باشه، من روی مستندات کار می‌کنم",
    timestamp: new Date(Date.now() - 3600000), type: 'text',
    read: true, pinned: true, edited: false, replyTo: null, reactions: {}, todoRef: null
  },
  {
    id: 5, senderId: 2, text: "عالیه! بریم؟ 🚀",
    timestamp: new Date(Date.now() - 1800000), type: 'text',
    read: false, pinned: false, edited: false, replyTo: null, reactions: {}, todoRef: null
  },
])

const inputText = ref<string>('')
const replyTo = ref<Message | null>(null)
const editingMessage = ref<Message | null>(null)
const showSearch = ref<boolean>(false)
const searchQuery = ref<string>('')
const showAttachMenu = ref<boolean>(false)
const showCreateTodoInline = ref<boolean>(false)
const showPinnedDialog = ref<boolean>(false)
const highlightedMessageId = ref<number | null>(null)
const typingUsers = ref<number[]>([])
const isNearBottom = ref<boolean>(true)
const unreadCount = ref<number>(0)
const activeMenuId = ref<number | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)
const bottomAnchor = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const showHeaderMenu = ref<boolean>(false)
const isMobile = ref<boolean>(false)
const menuOrigin = ref<string>('top left')
const inputAreaRef = ref<HTMLElement | null>(null)

// File & Voice states
const previewImageUrl = ref<string | null>(null)
const isRecording = ref<boolean>(false)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const recordingDuration = ref<number>(0)
const recordingInterval = ref<number | null>(null)
const recordingProgress = ref<number>(0)
const playingVoiceId = ref<number | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)
const playbackProgress = ref<number>(0)

const inlineTodo = ref<InlineTodoForm>({ title: '', description: '', priority: 'medium' })

const quickEmojis = ['👍', '❤️', '😂', '🔥', '👏', '😮', '😭', '😟']
const priorityColors: Record<Priority, string> = {
  high:   'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low:    'bg-emerald-100 text-emerald-600',
}

const pinnedMessages = computed<Message[]>(() => messages.value.filter(m => m.pinned))

const filteredMessages = computed<Message[]>(() => {
  if (!searchQuery.value) return messages.value
  return messages.value.filter(m => m.text.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const groupedMessages = computed<Record<string, Message[]>>(() => {
  const groups: Record<string, Message[]> = {}
  filteredMessages.value.forEach(msg => {
    const key = getDateLabel(msg.timestamp)
    if (!groups[key]) groups[key] = []
    groups[key].push(msg)
  })
  return groups
})

const typingText = computed<string>(() => {
  if (typingUsers.value.length === 0) return ''
  const names = typingUsers.value.map(id => getMemberName(id))
  return names.join(', ') + (typingUsers.value.length === 1 ? ' is typing...' : ' are typing...')
})

const activeMenu = computed<Message | null>(() => {
  if (activeMenuId.value === null) return null
  return messages.value.find(m => m.id === activeMenuId.value) ?? null
})

function getMemberById(id: number): Member | undefined {
  return members.value.find(m => m.id === id)
}

function getMemberName(id: number): string {
  return getMemberById(id)?.name ?? 'Unknown'
}

function getMessageById(id: number): Message | undefined {
  return messages.value.find(m => m.id === id)
}
function isSameSenderAsPrev(group: Message[], index: number): boolean {
  if (index === 0) return false
  return group[index].senderId === group[index - 1].senderId &&
      group[index].type !== 'system' && group[index - 1].type !== 'system'
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

function getDateLabel(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function highlightText(text: string, query: string): string {
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>')
}

function hasUserReacted(msgId: number, emoji: string): boolean {
  const msg = messages.value.find(m => m.id === msgId)
  return msg?.reactions[emoji]?.includes(currentUser.id) ?? false
}

// --- Floating action menu positioning ---
const menuElRef = ref<HTMLElement | null>(null)
const triggerRect = ref<DOMRect | null>(null)
const menuStyle = ref<{ top: number; left: number }>({ top: -9999, left: -9999 })
const MENU_MARGIN = 6
const VIEWPORT_PADDING = 8

function toggleMenu(msgId: number, event: MouseEvent): void {
  if (activeMenuId.value === msgId) {
    activeMenuId.value = null
    triggerRect.value = null
    return
  }
  triggerRect.value = (event.currentTarget as HTMLElement).getBoundingClientRect()
  menuStyle.value = { top: -9999, left: -9999 }
  activeMenuId.value = msgId
}

function positionMenu(): void {
  if (!triggerRect.value || !menuElRef.value) return
  const rect = triggerRect.value
  const menuRect = menuElRef.value.getBoundingClientRect()

  // اگه اینپوت پیدا شد، سقف پایین رو همونجا بذار، وگرنه لبه‌ی صفحه
  const inputRect = inputAreaRef.value?.getBoundingClientRect()
  const maxBottom = inputRect
      ? inputRect.top - VIEWPORT_PADDING
      : window.innerHeight - VIEWPORT_PADDING

  // Default: open downward, right under the trigger button
  let top = rect.bottom + MENU_MARGIN
  menuOrigin.value = 'top left'

  if (top + menuRect.height > maxBottom) {
    // فضای پایین (تا اینپوت) کافی نبود -> برو بالای دکمه
    const topAbove = rect.top - menuRect.height - MENU_MARGIN
    top = topAbove < VIEWPORT_PADDING ? VIEWPORT_PADDING : topAbove
    menuOrigin.value = 'bottom left'
  }

  if (top + menuRect.height > maxBottom) {
    // حتی بالا هم جا نشد (منو خیلی بلنده) -> بچسبونش درست بالای اینپوت
    top = maxBottom - menuRect.height
  }

  let left = rect.left
  if (left + menuRect.width > window.innerWidth - VIEWPORT_PADDING) {
    left = window.innerWidth - menuRect.width - VIEWPORT_PADDING
  }
  if (left < VIEWPORT_PADDING) left = VIEWPORT_PADDING

  menuStyle.value = { top, left }
}

watch(activeMenuId, (id) => {
  if (id === null) {
    triggerRect.value = null
    return
  }
  nextTick(() => positionMenu())
})

function closeActiveMenu(): void {
  activeMenuId.value = null
  triggerRect.value = null
}

function copyMessage(text: string): void {
  navigator.clipboard.writeText(text)
  toast.success("Message copied 📋")
}

function unpinMessage(msgId: number): void {
  const msg = messages.value.find(m => m.id === msgId)
  if (msg) msg.pinned = false
}

function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'solar:gallery-bold'
  if (['pdf'].includes(ext || '')) return 'solar:document-bold'
  if (['doc', 'docx'].includes(ext || '')) return 'solar:document-text-bold'
  if (['xls', 'xlsx'].includes(ext || '')) return 'solar:document-add-bold'
  if (['zip', 'rar', '7z'].includes(ext || '')) return 'solar:archive-bold'
  return 'solar:file-bold'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function previewImage(url: string): void {
  previewImageUrl.value = url
}

function isPlaying(msgId: number): boolean {
  return playingVoiceId.value === msgId
}

function getPlaybackProgress(msgId: number): number {
  if (playingVoiceId.value === msgId) {
    return playbackProgress.value
  }
  return 0
}

function toggleVoicePlayback(msgId: number): void {
  const msg = messages.value.find(m => m.id === msgId)
  if (!msg?.voiceMessage) return

  if (playingVoiceId.value === msgId) {
    audioElement.value?.pause()
    playingVoiceId.value = null
    playbackProgress.value = 0
  } else {
    if (audioElement.value) {
      audioElement.value.pause()
    }
    playingVoiceId.value = msgId
    const audio = new Audio(msg.voiceMessage.url)
    audioElement.value = audio

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        playbackProgress.value = (audio.currentTime / audio.duration) * 100
      }
    })

    audio.addEventListener('ended', () => {
      playingVoiceId.value = null
      playbackProgress.value = 0
    })

    audio.play()
  }
}

const pendingAttachment = ref<{
  file: File
  type: 'image' | 'file'
  url: string
  name: string
  size: number
} | null>(null)

async function handleFileSelect(event: Event, type: 'image' | 'file'): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const url = e.target?.result as string

    pendingAttachment.value = {
      file,
      type,
      url,
      name: file.name,
      size: file.size
    }

    sendMessageWithAttachment()
  }
  reader.readAsDataURL(file)

  input.value = ''
}

function sendMessageWithAttachment(): void {
  if (!pendingAttachment.value) return

  const attachment: Attachment = {
    name: pendingAttachment.value.name,
    size: pendingAttachment.value.size,
    type: pendingAttachment.value.type,
    url: pendingAttachment.value.url
  }

  const text = inputText.value.trim() || `📎 ${attachment.name}`

  const newMsg: Message = {
    id: Date.now(),
    senderId: currentUser.id,
    text: text,
    timestamp: new Date(),
    type: 'text',
    read: false,
    pinned: false,
    edited: false,
    replyTo: replyTo.value?.id ?? null,
    reactions: {},
    todoRef: null,
    attachment: attachment
  }

  messages.value.push(newMsg)
  inputText.value = ''
  replyTo.value = null
  showAttachMenu.value = false
  pendingAttachment.value = null
  scrollToBottom()

  setTimeout(() => {
    newMsg.read = true
  }, 1500)

  simulateReply()
}

async function startRecording(): Promise<void> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(stream)
    audioChunks.value = []

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    }

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' })
      const audioUrl = URL.createObjectURL(audioBlob)

      pendingVoiceMessage.value = {
        blob: audioBlob,
        url: audioUrl,
        duration: recordingDuration.value
      }

      sendVoiceMessage()

      stream.getTracks().forEach(track => track.stop())
      if (recordingInterval.value) clearInterval(recordingInterval.value)
      recordingDuration.value = 0
      recordingProgress.value = 0
      isRecording.value = false
    }

    mediaRecorder.value.start()
    isRecording.value = true
    recordingDuration.value = 0

    recordingInterval.value = window.setInterval(() => {
      if (recordingDuration.value < 60) {
        recordingDuration.value++
        recordingProgress.value = (recordingDuration.value / 60) * 100
      } else {
        stopRecording()
      }
    }, 1000)
  } catch (error) {
    console.error('Error accessing microphone:', error)
    alert('Unable to access microphone. Please check permissions.')
  }
}

function stopRecording(): void {
  if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
    mediaRecorder.value.stop()
  }
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value)
  }
}

function cancelRecording(): void {
  if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
    mediaRecorder.value.onstop = () => {
      if (recordingInterval.value) clearInterval(recordingInterval.value)
      recordingDuration.value = 0
      recordingProgress.value = 0
      isRecording.value = false
    }
    mediaRecorder.value.stop()
  } else {
    isRecording.value = false
  }
}

const pendingVoiceMessage = ref<VoiceMessage | null>(null)

function sendVoiceMessage(): void {
  if (!pendingVoiceMessage.value) return

  const text = `🎤 Voice message (${formatDuration(pendingVoiceMessage.value.duration)})`

  const newMsg: Message = {
    id: Date.now(),
    senderId: currentUser.id,
    text: text,
    timestamp: new Date(),
    type: 'text',
    read: false,
    pinned: false,
    edited: false,
    replyTo: replyTo.value?.id ?? null,
    reactions: {},
    todoRef: null,
    voiceMessage: pendingVoiceMessage.value
  }

  messages.value.push(newMsg)
  inputText.value = ''
  replyTo.value = null
  showAttachMenu.value = false
  pendingVoiceMessage.value = null
  scrollToBottom()

  setTimeout(() => {
    newMsg.read = true
  }, 1500)

  simulateReply()
}

function sendMessage(): void {
  const text = inputText.value.trim()
  if (!text && !pendingAttachment.value) return

  if (editingMessage.value) {
    const msg = messages.value.find(m => m.id === editingMessage.value!.id)
    if (msg) {
      msg.text = text
      msg.edited = true
    }
    cancelEdit()
    inputText.value = ''
    return
  }

  const newMsg: Message = {
    id:        Date.now(),
    senderId:  currentUser.id,
    text,
    timestamp: new Date(),
    type:      'text',
    read:      false,
    pinned:    false,
    edited:    false,
    replyTo:   replyTo.value?.id ?? null,
    reactions: {},
    todoRef:   null,
  }

  messages.value.push(newMsg)
  inputText.value = ''
  replyTo.value = null
  showAttachMenu.value = false
  scrollToBottom()

  setTimeout(() => {
    newMsg.read = true
  }, 1500)

  simulateReply()
}

function simulateReply(): void {
  const bots = members.value.filter(m => m.id !== currentUser.id && m.online)
  if (!bots.length || Math.random() > 0.4) return

  const bot = bots[Math.floor(Math.random() * bots.length)]
  const replies = [
    'باشه، ممنون! 👍', 'فهمیدم، روش کار می‌کنم', 'عالیه! 🔥',
    'اوکی', 'باشه، چشم', 'مطمئنی؟ 🤔', 'ممنون از اطلاع‌رسانی ✅',
    'چقدر خوب!', 'بریم جلو 🚀',
  ]

  const delay = 1500 + Math.random() * 2000

  typingUsers.value.push(bot.id)
  setTimeout(() => {
    typingUsers.value = typingUsers.value.filter(id => id !== bot.id)
    messages.value.push({
      id:        Date.now() + 1,
      senderId:  bot.id,
      text:      replies[Math.floor(Math.random() * replies.length)],
      timestamp: new Date(),
      type:      'text',
      read:      false,
      pinned:    false,
      edited:    false,
      replyTo:   null,
      reactions: {},
      todoRef:   null,
    })
    if (!isNearBottom.value) unreadCount.value++
    scrollToBottom()
  }, delay)
}

function deleteMessage(id: number): void {
  messages.value = messages.value.filter(m => m.id !== id)
  toast.success("Message deleted")
}

function startEdit(msg: Message): void {
  editingMessage.value = msg
  inputText.value = msg.text
  nextTick(() => inputRef.value?.focus())
}

function cancelEdit(): void {
  editingMessage.value = null
  inputText.value = ''
}

function togglePin(id: number): void {
  const msg = messages.value.find(m => m.id === id)
  if (msg) msg.pinned = !msg.pinned
}

function toggleReaction(msgId: number, emoji: string): void {
  const msg = messages.value.find(m => m.id === msgId)
  if (!msg) return

  // اول ریاکشن قبلی کاربر رو از سایر ایموجی‌ها حذف کن (فقط یک ریاکشن مجاز)
  for (const key in msg.reactions) {
    if (key !== emoji) {
      const idx = msg.reactions[key].indexOf(currentUser.id)
      if (idx > -1) {
        msg.reactions[key].splice(idx, 1)
        if (msg.reactions[key].length === 0) delete msg.reactions[key]
      }
    }
  }

  if (!msg.reactions[emoji]) msg.reactions[emoji] = []
  const idx = msg.reactions[emoji].indexOf(currentUser.id)
  if (idx > -1) {
    msg.reactions[emoji].splice(idx, 1)
    if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji]
  } else {
    msg.reactions[emoji].push(currentUser.id)
  }
}

function createTodoFromChat(): void {
  const title = inlineTodo.value.title.trim()
  if (!title) return

  emit('create-todo', title, inlineTodo.value.description.trim(), inlineTodo.value.priority)

  messages.value.push({
    id:        Date.now(),
    senderId:  currentUser.id,
    text:      `✅ Task created: "${title}"`,
    timestamp: new Date(),
    type:      'system',
    read:      true,
    pinned:    false,
    edited:    false,
    replyTo:   null,
    reactions: {},
    todoRef:   { id: Date.now(), text: title, priority: inlineTodo.value.priority },
  })

  inlineTodo.value = { title: '', description: '', priority: 'medium' }
  showCreateTodoInline.value = false
  scrollToBottom()
}

async function scrollToMessage(msgId: number): Promise<void> {
  highlightedMessageId.value = msgId

  await nextTick()

  const messageElement = document.getElementById(`message-${msgId}`)
  if (messageElement) {
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Highlight animation
    setTimeout(() => {
      highlightedMessageId.value = null
    }, 3000)
  }
}

function scrollToBottom(): void {
  nextTick(() => {
    bottomAnchor.value?.scrollIntoView({ behavior: 'smooth' })
    isNearBottom.value = true
    unreadCount.value = 0
  })
}

function onScroll(): void {
  const el = messagesContainer.value
  if (!el) return
  const threshold = 100
  isNearBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  if (isNearBottom.value) unreadCount.value = 0
  if (activeMenuId.value) closeActiveMenu()
}

function checkMobile(): void {
  isMobile.value = window.innerWidth < 768
}

function handleWindowResize(): void {
  checkMobile()
  if (activeMenuId.value) closeActiveMenu()
}

onMounted((): void => {
  scrollToBottom()
  messagesContainer.value?.addEventListener('scroll', onScroll)
  checkMobile()
  window.addEventListener('resize', handleWindowResize)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeMenuId.value) {
      closeActiveMenu()
    }
  })
})

onUnmounted((): void => {
  messagesContainer.value?.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', handleWindowResize)
  if (recordingInterval.value) clearInterval(recordingInterval.value)
  if (audioElement.value) audioElement.value.pause()
})

watch(messages, (): void => {
  if (isNearBottom.value) scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar       { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(219, 39, 119, 0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(219, 39, 119, 0.4); }

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation: fade-in 0.2s ease-out;
}

@keyframes menu-pop {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-pop {
  animation: menu-pop 0.25s ease-out;
  transform-origin: top left;
}

.ios-blur-mask {
  -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.8) 40%,
      rgba(0, 0, 0, 0.6) 70%,
      rgba(0, 0, 0, 0.2) 90%,
      rgba(0, 0, 0, 0) 100%
  );
  mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.8) 40%,
      rgba(0, 0, 0, 0.6) 70%,
      rgba(0, 0, 0, 0.2) 90%,
      rgba(0, 0, 0, 0) 100%
  );
}
</style>