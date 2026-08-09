<template>
  <div class="flex h-full w-full flex-1 overflow-hidden">


    <aside
        :class="[
          'h-full overflow-hidden border-e border-primary-200/60 bg-white/80 backdrop-blur-xl relative',
          isMobile ? 'w-full' : ['shrink-0 transition-[width] duration-300 ease-in-out', sidebarIconOnly ? 'w-19' : 'w-72'],
          isMobile && mobilePane !== 'sidebar' ? 'hidden' : 'flex flex-col'
        ]"
    >
      <!-- Sidebar Header: view switcher (expanded) -->
      <div v-if="!sidebarIconOnly" class="w-full shrink-0 border-b border-primary-100">
        <div class="flex items-center gap-2 h-14 px-3 pt-2">
          <div class="flex items-center gap-1 p-1 rounded-xl bg-primary-50 flex-1 min-w-0">
            <button
                class="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold bg-white text-primary-700 shadow-sm transition-all"
                v-tooltip="'Chats & Groups'"
            >
              <Icon icon="solar:chat-round-dots-bold" class="text-base shrink-0" />
              <span class="truncate">Chats</span>
            </button>
            <button
                @click="goToTasks"
                class="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-primary-400 hover:text-primary-600 hover:bg-white/60 transition-all"
                v-tooltip="'Open Tasks list'"
            >
              <Icon icon="solar:checklist-minimalistic-linear" class="text-base shrink-0" />
              <span class="truncate">Tasks</span>
            </button>
          </div>
          <button
              @click="handleSidebarToggle"
              class="p-2 rounded-lg text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all shrink-0"
              v-tooltip="isMobile ? 'Close' : 'Collapse'"
          >
            <Icon :icon="isMobile ? 'mingcute:close-line' : 'solar:double-alt-arrow-right-linear'" class="text-lg" />
          </button>
        </div>

        <!-- Group Search -->
        <div class="px-3 pb-3">
          <div class="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2">
            <Icon icon="solar:magnifer-linear" class="text-primary-400 shrink-0 text-sm" />
            <input
                v-model="groupSearchQuery"
                type="text"
                placeholder="Search groups..."
                class="flex-1 min-w-0 bg-transparent text-xs text-primary-800 placeholder-primary-300 focus:outline-none"
            />
            <button v-if="groupSearchQuery" @click="groupSearchQuery = ''" class="text-primary-300 hover:text-primary-500 shrink-0">
              <Icon icon="mingcute:close-line" class="text-sm" />
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Header: view switcher (collapsed, desktop only) -->
      <div v-else class="hidden md:flex w-19 shrink-0 flex-col items-center gap-1.5 border-b border-primary-100 py-2.5">
        <button
            @click="handleSidebarToggle"
            class="w-9 h-9 flex items-center justify-center rounded-lg text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all"
            v-tooltip="'Expand'"
        >
          <Icon icon="solar:double-alt-arrow-left-linear" class="text-lg" />
        </button>
        <button
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700 transition-all"
            v-tooltip="'Chats & Groups'"
        >
          <Icon icon="solar:chat-round-dots-bold" class="text-lg" />
        </button>
        <button
            @click="goToTasks"
            class="w-9 h-9 flex items-center justify-center rounded-lg text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all"
            v-tooltip="'Open Tasks list'"
        >
          <Icon icon="solar:checklist-minimalistic-linear" class="text-lg" />
        </button>
      </div>

      <!-- Groups List -->
      <div class="w-full flex-1 overflow-y-auto overflow-x-hidden px-2 pt-2 pb-20 space-y-1 custom-scrollbar">
        <p v-if="!sidebarIconOnly" class="px-2.5 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-primary-300">
          {{ groupSearchQuery ? `Results — ${filteredGroups.length}` : 'Chats' }}
        </p>
        <button
            v-for="g in filteredGroups"
            :key="g.id"
            @click="handleSelectGroup(g.id)"
            :class="[
            'group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-start transition-colors',
            sidebarIconOnly ? 'md:justify-center md:px-0' : '',
            activeGroupId === g.id ? 'bg-primary-100/80 text-primary-800' : 'hover:bg-primary-50 text-primary-700'
          ]"
            v-tooltip="sidebarIconOnly ? g.name : undefined"
        >
          <div class="relative shrink-0">
            <img v-if="g.avatarUrl" :src="g.avatarUrl" class="w-10 h-10 rounded-full object-cover" alt="" />
            <div v-else :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm', g.avatarBg]">
              {{ g.name[0] }}
            </div>
            <span v-if="g.unread > 0" class="absolute -top-1 -end-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow ring-2 ring-white">
            {{ g.unread }}
          </span>
          </div>
          <div v-if="!sidebarIconOnly" class="flex-1 min-w-0 overflow-hidden">
            <div class="flex items-center justify-between gap-1">
              <span class="text-sm font-semibold truncate">{{ g.name }}</span>
              <span v-if="g.messages.length" class="text-[10px] text-primary-300 shrink-0">{{ formatTime(g.messages[g.messages.length - 1].timestamp) }}</span>
            </div>
            <p class="text-xs text-primary-400 truncate">{{ g.messages.length ? g.messages[g.messages.length - 1].text : (g.description || 'No messages yet') }}</p>
          </div>
        </button>

        <p v-if="!sidebarIconOnly && groupSearchQuery && filteredGroups.length === 0" class="px-2.5 py-6 text-center text-xs text-primary-300">
          No groups found for "{{ groupSearchQuery }}"
        </p>
      </div>

      <!-- Floating New Group Button -->
      <div class="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <button
            @click="openCreateGroupDialog"
            v-tooltip="'New Group'"
            class="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-300/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Icon icon="mingcute:add-line" class="text-2xl" />
        </button>
      </div>

      <!-- Create Group Dialog -->
      <Teleport to="body">
        <div
            v-if="showCreateGroupDialog"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            @click.self="closeCreateGroupDialog"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center p-6 border-b border-primary-100 sticky top-0 bg-white z-10">
              <h3 class="text-xl font-bold text-primary-900">➕ Create New Group</h3>
              <button @click="closeCreateGroupDialog" class="text-primary-400 hover:text-primary-600 text-2xl">✕</button>
            </div>
            <div class="p-6 space-y-4">
              <!-- Avatar Upload -->
              <div class="flex flex-col items-center gap-2">
                <div class="relative">
                  <img v-if="newGroupForm.avatarUrl" :src="newGroupForm.avatarUrl" class="w-20 h-20 rounded-full object-cover border border-primary-100 shadow-sm" alt="" />
                  <div v-else class="w-20 h-20 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                    {{ newGroupForm.name ? newGroupForm.name[0].toUpperCase() : '👥' }}
                  </div>
                  <label class="absolute -bottom-1 -end-1 p-1.5 rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600 cursor-pointer transition-all">
                    <Icon icon="solar:camera-bold" class="text-sm" />
                    <input type="file" accept="image/*" class="hidden" @change="handleGroupAvatarSelect" />
                  </label>
                  <button
                      v-if="newGroupForm.avatarUrl"
                      @click="newGroupForm.avatarUrl = null"
                      class="absolute -top-1 -end-1 p-1 rounded-full bg-white text-primary-500 shadow-md hover:bg-primary-50 transition-all border border-primary-100"
                      v-tooltip="'Remove photo'"
                  >
                    <Icon icon="mingcute:close-line" class="text-xs" />
                  </button>
                </div>
                <span class="text-xs text-primary-400">Group photo (optional)</span>
              </div>

              <div>
                <label class="block text-sm font-medium text-primary-700 mb-2">
                  Group Name <span class="text-primary-600">*</span>
                </label>
                <input
                    v-model="newGroupForm.name"
                    type="text"
                    placeholder="e.g. Product Design Team"
                    class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                    @keyup.enter="submitCreateGroup"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-primary-700 mb-2">Description</label>
                <textarea
                    v-model="newGroupForm.description"
                    rows="3"
                    placeholder="What's this group about? (optional)"
                    class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>
            <div class="flex gap-3 p-6 border-t border-primary-100 rounded-b-2xl sticky bottom-0 bg-white">
              <button @click="closeCreateGroupDialog" class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all">Cancel</button>
              <button
                  @click="submitCreateGroup"
                  :disabled="!newGroupForm.name.trim()"
                  class="flex-1 px-4 py-2 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </aside>


    <div
        ref="chatPaneRef"
        :class="[
          'relative flex flex-col h-full w-full bg-white/30 backdrop-blur-sm flex-1 min-w-0 overflow-hidden',
          isMobile && mobilePane !== 'main' ? 'hidden' : 'flex'
        ]"
    >

      <!-- Header -->
      <div class="shrink-0 bg-white/90 backdrop-blur-md md:rounded-ss-none rounded-t-2xl border-b border-primary-200/60 shadow-sm relative z-50">
        <div class="px-5 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Group Avatar -->
            <div class="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-200 z-50 overflow-hidden shrink-0">
              <img v-if="activeGroup?.avatarUrl" :src="activeGroup.avatarUrl" class="w-full h-full object-cover" alt="" />
              <Icon v-else icon="solar:users-group-rounded-bold" class="text-white text-xl" />
            </div>
            <div class="min-w-0">
              <h2 class="text-sm font-bold text-primary-900 truncate">{{ activeGroup?.name }}</h2>
              <p class="text-xs text-primary-400">{{ onlineMembers.length }} online · {{ members.length }} members</p>
            </div>
          </div>

          <div class="flex items-center gap-2 relative">
            <button
                @click="mobilePane = 'sidebar'"
                class="md:hidden flex items-center gap-2 px-2 py-2 text-sm text-primary-700 transition-colors"
                v-tooltip="'Chats'"
            >
              <Icon icon="solar:hamburger-menu-linear" class="text-lg" />
            </button>

            <button
                @click="goToTasks"
                class="flex items-center gap-2 px-2 py-2 text-sm text-primary-700 transition-colors"
                v-tooltip="'Open Tasks'"
            >
              <Icon icon="solar:checklist-minimalistic-linear" class="text-lg" />
            </button>

            <button
                @click="showSearch = !showSearch; openMenu = null"
                :class="['flex items-center gap-2 px-2 py-2 text-sm transition-colors', showSearch ? 'text-primary-600' : 'text-primary-700']"
            >
              <Icon icon="boxicons:search" class="text-lg" />
            </button>

            <!-- More Options Dropdown -->
            <div class="relative inline-block" data-dropdown="header-menu">
              <button
                  @click.stop="toggleDropdown('header', $event)"
                  class="p-2 rounded-full text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all"
                  v-tooltip="'More options'"
              >
                <Icon icon="mage:dots" class="text-xl" />
              </button>

              <Transition name="dropdown">
                <div
                    v-if="openMenu === 'header'"
                    data-dropdown="header-menu"
                    data-dropdown-panel
                    :class="[
                    'absolute top-full mt-1 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg py-2 min-w-45 z-[9999]',
                    menuAlign.header === 'right' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                  ]"
                >
                  <button
                      @click.stop="emit('toggle-filter'); openMenu = null"
                      class="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors"
                  >
                    Filter messages
                  </button>

                  <button
                      @click.stop="showGroupInfoPanel = true; openMenu = null"
                      class="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors border-t border-primary-100 mt-1"
                  >
                    Group info
                  </button>
                </div>
              </Transition>
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
          class="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar min-h-0 space-y-1 pb-32"
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

      <!-- Bottom Area: recording / reply / edit / input -->
      <div class="absolute inset-x-0 bottom-0 shrink-0 px-4 pb-4 pt-2">
        <!-- Voice Recording UI -->
        <div v-if="isRecording" class="mb-2 px-4 py-3 bg-red-50 rounded-xl border border-red-200 flex items-center gap-3">
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
        <div v-if="replyTo" class="mb-2 px-3 py-2 bg-primary-50 rounded-xl border border-primary-200 flex items-center gap-2">
          <div class="flex-1">
            <p class="text-xs font-medium text-primary-500">Replying to {{ getMemberName(replyTo.senderId) }}</p>
            <p class="text-xs text-primary-400 truncate">{{ replyTo.text }}</p>
          </div>
          <button @click="replyTo = null" class="text-primary-400 hover:text-primary-600">
            <Icon icon="mingcute:close-line" />
          </button>
        </div>

        <!-- Edit Preview -->
        <div v-if="editingMessage" class="mb-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
          <Icon icon="mi:edit" class="text-amber-500 shrink-0" />
          <p class="text-xs text-amber-600 flex-1 truncate">Editing: {{ editingMessage.text }}</p>
          <button @click="cancelEdit" class="text-amber-400 hover:text-amber-600">
            <Icon icon="mingcute:close-line" />
          </button>
        </div>

        <!-- Input Area -->
        <div ref="inputAreaRef" class="bg-white rounded-2xl border border-primary-200 shadow-sm overflow-hidden">

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
                placeholder="Task title "
                class="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
            />
            <textarea
                v-model="inlineTodo.description"
                rows="2"
                placeholder="Description (optional)"
                class="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 resize-none"
            />
            <PrioritySlider v-model="inlineTodo.priority" />
            <div class="flex gap-2">
              <button @click="createTodoFromChat" :disabled="!inlineTodo.title.trim()" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-all disabled:opacity-50">
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

      <!-- Group Info Panel — stays contained within the chat page itself -->
      <Transition
          enter-active-class="transition-opacity duration-300 ease-in-out"
          leave-active-class="transition-opacity duration-300 ease-in-out"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
      >
        <div
            v-if="showGroupInfoPanel"
            @click="showGroupInfoPanel = false"
            class="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px]"
        />
      </Transition>

      <Transition
          enter-active-class="transition-transform duration-300 ease-in-out"
          leave-active-class="transition-transform duration-300 ease-in-out"
          enter-from-class="translate-x-full rtl:-translate-x-full"
          leave-to-class="translate-x-full rtl:-translate-x-full"
      >
        <aside
            v-if="showGroupInfoPanel"
            class="absolute inset-y-0 end-0 z-40 w-full max-w-sm bg-white shadow-2xl flex flex-col"
        >
          <!-- Panel Header -->
          <div class="flex items-center justify-between h-16 shrink-0 px-5 border-b border-primary-100">
            <h3 class="text-base font-bold text-primary-900">Group Info</h3>
            <button @click="showGroupInfoPanel = false" class="p-1.5 rounded-full hover:bg-primary-50 text-primary-400 hover:text-primary-600 transition">
              <Icon icon="mingcute:close-line" class="text-lg" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto custom-scrollbar" v-if="activeGroup">
            <!-- Section 1: Group Info -->
            <div class="p-6 flex flex-col items-center gap-3 border-b border-primary-100">
              <div class="relative">
                <img v-if="activeGroup.avatarUrl" :src="activeGroup.avatarUrl" class="w-24 h-24 rounded-full object-cover shadow-sm" alt="" />
                <div v-else :class="['w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-sm', activeGroup.avatarBg]">
                  {{ activeGroup.name[0] }}
                </div>
                <label class="absolute -bottom-1 -end-1 p-2 rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600 cursor-pointer transition-all">
                  <Icon icon="solar:camera-bold" class="text-sm" />
                  <input type="file" accept="image/*" class="hidden" @change="handleActiveGroupAvatarSelect" />
                </label>
              </div>

              <div class="w-full">
                <label class="block text-[11px] font-semibold uppercase tracking-wide text-primary-300 mb-1">Name</label>
                <input
                    v-model="activeGroup.name"
                    type="text"
                    class="w-full px-3 py-2 rounded-xl border border-transparent hover:border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all text-sm font-semibold text-primary-900 text-center"
                />
              </div>

              <div class="w-full">
                <label class="block text-[11px] font-semibold uppercase tracking-wide text-primary-300 mb-1">Description</label>
                <textarea
                    v-model="activeGroup.description"
                    rows="2"
                    placeholder="Add a description..."
                    class="w-full px-3 py-2 rounded-xl border border-transparent hover:border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all text-sm text-primary-600 text-center resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Section 2: Members -->
            <div class="p-4">
              <p class="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-primary-300">
                Members — {{ activeGroup.members.length }}
              </p>
              <div class="space-y-1">
                <div
                    v-for="m in activeGroup.members"
                    :key="m.id"
                    class="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <div class="relative shrink-0">
                    <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm', m.avatarBg]">
                      {{ m.name[0] }}
                    </div>
                    <span
                        class="absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                        :class="m.online ? 'bg-emerald-500' : 'bg-primary-200'"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-primary-800 truncate">
                      {{ m.name }}<span v-if="m.id === currentUser.id" class="text-primary-400 font-normal"> (you)</span>
                    </p>
                    <p class="text-xs text-primary-400">{{ m.online ? 'Online' : 'Offline' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </Transition>

      <!-- Click away overlay for message menu -->
      <div v-if="activeMenuId" class="fixed inset-0 z-10" @click="activeMenuId = null"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { Todo, Priority } from '~/types/todoType'
import PrioritySlider from '~/components/PrioritySlider.vue'
import { useGroupChat, type ApiGroup, type ApiMessage } from '~/composables/useGroupChat'
import { useAuth } from '~/composables/useAuth'

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

interface Group {
  id: number
  name: string
  description: string
  avatarUrl: string | null
  avatarBg: string
  unread: number
  members: Member[]
  messages: Message[]
}

interface InlineTodoForm {
  title: string
  description: string
  priority: Priority
}

const props = defineProps<{
  todos?: Todo[]
}>()

const emit = defineEmits<{
  'create-todo': [title: string, description: string, priority: Priority]
  'view-todo': [todo: Pick<Todo, 'id' | 'text' | 'priority'>]
  'toggle-filter': []
  'open-tasks': []
}>()

const currentUser: Member = { id: 1, name: 'You', avatarBg: 'bg-primary-500', online: true }

const avatarBgOptions = ['bg-primary-500', 'bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500']

const groups = ref<Group[]>([
  {
    id: 1,
    name: 'Project Team',
    description: 'Main product team channel',
    avatarUrl: null,
    avatarBg: 'bg-primary-500',
    unread: 0,
    members: [
      { id: 1, name: 'You',  avatarBg: 'bg-primary-500',  online: true  },
      { id: 2, name: 'Sara', avatarBg: 'bg-violet-500',   online: true  },
      { id: 3, name: 'Ali',  avatarBg: 'bg-sky-500',      online: false },
      { id: 4, name: 'Mina', avatarBg: 'bg-emerald-500',  online: true  },
      { id: 5, name: 'Reza', avatarBg: 'bg-amber-500',    online: false },
    ],
    messages: [
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
    ],
  },
  {
    id: 2,
    name: 'Design Crew',
    description: 'UI/UX discussions and reviews',
    avatarUrl: null,
    avatarBg: 'bg-violet-500',
    unread: 2,
    members: [
      { id: 1, name: 'You',   avatarBg: 'bg-primary-500', online: true  },
      { id: 6, name: 'Niloo', avatarBg: 'bg-rose-500',    online: true  },
      { id: 7, name: 'Kian',  avatarBg: 'bg-sky-500',     online: false },
    ],
    messages: [
      {
        id: 101, senderId: 6, text: "طرح جدید داشبورد رو آپلود کردم، یه نگاه بندازید 🎨",
        timestamp: new Date(Date.now() - 7200000), type: 'text',
        read: true, pinned: false, edited: false, replyTo: null, reactions: {}, todoRef: null
      },
      {
        id: 102, senderId: 7, text: "خیلی خوب شده، فقط رنگ دکمه اصلی رو یه بار دیگه ببینیم",
        timestamp: new Date(Date.now() - 5400000), type: 'text',
        read: false, pinned: false, edited: false, replyTo: null, reactions: {}, todoRef: null
      },
    ],
  },
  {
    id: 3,
    name: 'Marketing',
    description: 'Campaigns, content and launches',
    avatarUrl: null,
    avatarBg: 'bg-emerald-500',
    unread: 0,
    members: [
      { id: 1, name: 'You',  avatarBg: 'bg-primary-500', online: true },
      { id: 8, name: 'Dorsa', avatarBg: 'bg-amber-500',  online: false },
    ],
    messages: [
      {
        id: 201, senderId: 8, text: "کمپین هفته آینده آماده انتشاره ✅",
        timestamp: new Date(Date.now() - 86400000), type: 'text',
        read: true, pinned: false, edited: false, replyTo: null, reactions: {}, todoRef: null
      },
    ],
  },
])

const activeGroupId = ref<number>(1)

const activeGroup = computed<Group | undefined>(() =>
    groups.value.find(g => g.id === activeGroupId.value) ?? groups.value[0]
)

const members = computed<Member[]>(() => activeGroup.value?.members ?? [])
const onlineMembers = computed<Member[]>(() => members.value.filter(m => m.online))

const messages = computed<Message[]>({
  get: () => activeGroup.value?.messages ?? [],
  set: (val) => { if (activeGroup.value) activeGroup.value.messages = val },
})

function selectGroup(id: number): void {
  activeGroupId.value = id
  const g = groups.value.find(x => x.id === id)
  if (g) g.unread = 0
}

function createGroup(input: { name: string; description: string; avatarUrl: string | null }): Group {
  const newGroup: Group = {
    id: Date.now(),
    name: input.name,
    description: input.description,
    avatarUrl: input.avatarUrl,
    avatarBg: avatarBgOptions[Math.floor(Math.random() * avatarBgOptions.length)],
    unread: 0,
    members: [currentUser],
    messages: [
      {
        id: Date.now(),
        senderId: currentUser.id,
        text: 'Group created 🎉',
        timestamp: new Date(),
        type: 'system',
        read: true, pinned: false, edited: false, replyTo: null, reactions: {}, todoRef: null,
      },
    ],
  }
  groups.value.unshift(newGroup)
  activeGroupId.value = newGroup.id
  return newGroup
}

function getMemberById(id: number): Member | undefined {
  return members.value.find(m => m.id === id)
}

function getMemberName(id: number): string {
  return getMemberById(id)?.name ?? 'Unknown'
}

const { isMobile } = useResponsiveMode()

// ─── Mobile pane focus: on narrow screens only the groups list OR the
// messages pane is shown at a time (both always show side-by-side on desktop) ──
const mobilePane = ref<'sidebar' | 'main'>('main')

function goToTasks(): void {
  emit('open-tasks')
}

// ─── Groups sidebar: search ─────────────────────────────────────────────────
const groupSearchQuery = ref<string>('')
const filteredGroups = computed(() => {
  const q = groupSearchQuery.value.trim().toLowerCase()
  if (!q) return groups.value
  return groups.value.filter(g => g.name.toLowerCase().includes(q))
})

// ─── Groups sidebar: collapse (desktop) ─────────────────────────────────────
const sidebarCollapsed = ref<boolean>(false)
const sidebarIconOnly = computed<boolean>(() => !isMobile.value && sidebarCollapsed.value)

function handleSidebarToggle(): void {
  if (isMobile.value) {
    mobilePane.value = 'main'
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

function handleSelectGroup(id: number): void {
  selectGroup(id)
  mobilePane.value = 'main'
}

// ─── Groups sidebar: create group dialog ────────────────────────────────────
const showCreateGroupDialog = ref<boolean>(false)
const newGroupForm = ref<{ name: string; description: string; avatarUrl: string | null }>({
  name: '', description: '', avatarUrl: null,
})

function openCreateGroupDialog(): void {
  showCreateGroupDialog.value = true
}

function closeCreateGroupDialog(): void {
  showCreateGroupDialog.value = false
  newGroupForm.value = { name: '', description: '', avatarUrl: null }
}

function handleGroupAvatarSelect(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    newGroupForm.value.avatarUrl = e.target?.result as string
  }
  reader.readAsDataURL(file)
  input.value = ''
}

function submitCreateGroup(): void {
  const name = newGroupForm.value.name.trim()
  if (!name) return
  createGroup({
    name,
    description: newGroupForm.value.description.trim(),
    avatarUrl: newGroupForm.value.avatarUrl,
  })
  closeCreateGroupDialog()
  mobilePane.value = 'main'
}

function handleActiveGroupAvatarSelect(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !activeGroup.value) return
  const reader = new FileReader()
  reader.onload = (e) => {
    if (activeGroup.value) activeGroup.value.avatarUrl = e.target?.result as string
  }
  reader.readAsDataURL(file)
  input.value = ''
}

const showGroupInfoPanel = ref<boolean>(false)
const chatPaneRef = ref<HTMLElement | null>(null)

// ─── Header "more options" dropdown (same pattern as TodoList) ───────────────
type MenuType = 'header' | null
const openMenu = ref<MenuType>(null)
const menuAlign = ref<Record<Exclude<MenuType, null>, 'left' | 'right'>>({
  header: 'right',
})

function computeMenuAlign(triggerEl: HTMLElement): 'left' | 'right' {
  const wrapper = triggerEl.closest('[data-dropdown]') as HTMLElement | null
  if (!wrapper) return 'right'

  const rect = wrapper.getBoundingClientRect()
  const menuEl = wrapper.querySelector('[data-dropdown-panel]') as HTMLElement | null
  const menuWidth = menuEl?.offsetWidth || 180

  const margin = 8
  const panelRect = chatPaneRef.value?.getBoundingClientRect()
  const rightBound = panelRect ? panelRect.right : window.innerWidth
  const leftBound = panelRect ? panelRect.left : 0

  const spaceRight = rightBound - rect.left - margin
  const spaceLeft = rect.right - leftBound - margin

  const isRtl = getComputedStyle(wrapper).direction === 'rtl'
  const preferred: 'left' | 'right' = isRtl ? 'left' : 'right'
  const fallback: 'left' | 'right' = isRtl ? 'right' : 'left'
  const spaceOf = (side: 'left' | 'right') => (side === 'right' ? spaceRight : spaceLeft)

  if (spaceOf(preferred) >= menuWidth) return preferred
  if (spaceOf(fallback) >= menuWidth) return fallback
  return spaceRight >= spaceLeft ? 'right' : 'left'
}

function toggleDropdown(type: Exclude<MenuType, null>, event: MouseEvent): void {
  const isOpening = openMenu.value !== type
  openMenu.value = isOpening ? type : null

  if (isOpening) {
    const target = event.currentTarget as HTMLElement
    menuAlign.value[type] = computeMenuAlign(target)
    nextTick(() => {
      menuAlign.value[type] = computeMenuAlign(target)
    })
  }
}

function handleDropdownClickOutside(e: MouseEvent): void {
  const target = e.target as HTMLElement
  if (openMenu.value && !target.closest('[data-dropdown="header-menu"]')) {
    openMenu.value = null
  }
}

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

  const attachment = {
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

const pendingVoiceMessage = ref<{ blob: Blob; url: string; duration: number } | null>(null)

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

function handleWindowResize(): void {
  if (activeMenuId.value) closeActiveMenu()
}

onMounted((): void => {
  scrollToBottom()
  messagesContainer.value?.addEventListener('scroll', onScroll)
  window.addEventListener('resize', handleWindowResize)
  document.addEventListener('click', handleDropdownClickOutside)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeMenuId.value) {
      closeActiveMenu()
    }
  })
})

onUnmounted((): void => {
  messagesContainer.value?.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', handleWindowResize)
  document.removeEventListener('click', handleDropdownClickOutside)
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

/* دراپ‌داون هدر - همون انیمیشن دراپ‌داون‌های TodoList */
.dropdown-enter-active {
  transition: opacity 0.16s ease-out, transform 0.16s ease-out;
}
.dropdown-leave-active {
  transition: opacity 0.12s ease-in, transform 0.12s ease-in;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

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
</style>