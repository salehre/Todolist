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
            <div v-else :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm', colorFor(g.id)]">
              {{ g.name[0] }}
            </div>
            <span v-if="g.unread > 0" class="absolute -top-1 -inset-e-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow ring-2 ring-white">
            {{ g.unread }}
          </span>
          </div>
          <div v-if="!sidebarIconOnly" class="flex-1 min-w-0 overflow-hidden">
            <div class="flex items-center justify-between gap-1">
              <span class="text-sm font-semibold truncate">{{ g.name }}</span>
              <span v-if="lastMessage(g.id)" class="text-[10px] text-primary-300 shrink-0">{{ formatTime(lastMessage(g.id)!.timestamp) }}</span>
            </div>
            <p class="text-xs text-primary-400 truncate">{{ lastMessage(g.id)?.text || g.description || 'No messages yet' }}</p>
          </div>
        </button>

        <p v-if="!sidebarIconOnly && groupSearchQuery && filteredGroups.length === 0" class="px-2.5 py-6 text-center text-xs text-primary-300">
          No groups found for "{{ groupSearchQuery }}"
        </p>
      </div>

      <!-- Floating New Group Button -->
      <div class="pointer-events-none absolute inset-x-3 bottom-3 flex justify-start">
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
                      class="absolute -top-1 -inset-e-1 p-1 rounded-full bg-white text-primary-500 shadow-md hover:bg-primary-50 transition-all border border-primary-100"
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
      <div
          v-if="!loadingGroups && apiGroups.length === 0"
          class="flex flex-1 items-center justify-center p-6"
      >
        <div class="flex flex-col text-center items-center gap-2 rounded-2xl border border-primary-200/60 bg-white/80 sm:px-24 py-6 shadow-lg shadow-primary-200/20 backdrop-blur-xl">
            <Icon icon="mdi:users-group" class="text-3xl text-primary-700" />
          <strong class="text-lg font-semibold text-primary-600">هنوز هیچ گروهی نداری</strong>
          <p class="text-sm text-primary-400">یه گروه بساز و با اعضای تیمت شروع به گفتگو و اشتراک‌گذاری تسک کن</p>
        </div>
      </div>

      <!-- Header -->
      <template v-else>
      <div class="shrink-0 bg-white/90 backdrop-blur-md md:rounded-ss-none rounded-t-2xl border-b border-primary-200/60 shadow-sm relative z-50">
        <div class="px-5 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0 cursor-pointer" @click.stop="showGroupInfoPanel = true; openMenu = null">
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
                    <Icon icon="mi:filter" class="text-sm" />
                    Filter messages
                  </button>

                  <button
                      @click.stop="showGroupInfoPanel = true; openMenu = null"
                      class="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors border-t border-primary-100 mt-1"
                  >
                    <Icon icon="mi:circle-information" class="text-sm" />
                    Group info
                  </button>

                  <button
                      v-if="isGroupAdmin"
                      @click.stop="openMenu = null; confirmDeleteGroup()"
                      class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-primary-100 mt-1"
                  >
                    <Icon icon="mi:delete" class="text-sm" />
                    حذف گروه
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
        <div
            v-if="!loadingMessages && messages.length === 0"
            class="flex h-full items-center justify-center"
        >
          <div class="flex flex-col text-center items-center gap-2 rounded-2xl border border-primary-200/60 bg-white/80 sm:px-24 px-14 py-6 shadow-lg shadow-primary-200/20 backdrop-blur-xl">
            <Icon icon="ep:chat-round" class="text-4xl text-primary-700" />
            <strong class="text-lg text-primary-600">هنوز پیامی وجود نداره</strong>
            <p class="text-sm text-primary-400">اولین پیام رو بفرست!</p>
          </div>
        </div>

        <template v-else>
        <template v-for="(group, date) in groupedMessages" :key="date">
          <div class="flex items-center gap-3 my-4">
            <div class="flex-1 h-px bg-primary-100"></div>
            <span class="text-xs text-primary-300 px-2 py-1 bg-white/60 rounded-full">{{ date }}</span>
            <div class="flex-1 h-px bg-primary-100"></div>
          </div>

          <template v-for="(msg, index) in group" :key="msg.id">
            <!-- System Message -->
            <div v-if="msg.type === 'system'" class="flex items-center gap-3 my-4">
              <div class="flex-1 h-px bg-primary-100" />
              <span class="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/60 px-3 py-1 text-xs text-primary-400">
                <Icon icon="mingcute:check-circle-line" class="text-sm text-primary-400" />
                {{ msg.text }}
              </span>
              <div class="flex-1 h-px bg-primary-100" />
            </div>

            <!-- Regular Message -->
            <div
              v-else
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
                    @click="openUserProfile(msg.senderId)"
                    class="cursor-pointer"
                >
                  <img
                      v-if="getMemberById(msg.senderId)?.avatarUrl"
                      :src="getMemberById(msg.senderId)!.avatarUrl!"
                      class="w-8 h-8 rounded-full object-cover shadow-sm hover:opacity-80 transition"
                   alt="member profile"/>
                  <div
                    v-else
                    :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm', getMemberById(msg.senderId)?.avatarBg ?? 'bg-primary-400']"
                >
                  {{ getMemberName(msg.senderId)[0] }}
                  </div>
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

                    <!-- Attachments (album) -->
                    <div v-if="msg.attachments && msg.attachments.length" class="mb-2 -mx-3 first:mt-0">
                      <!-- عکس‌ها: گرید وسط‌چین، بدون توجه به padding نامتقارن حباب -->
                      <div
                          v-if="msg.attachments.some(a => a.type === 'image')"
                          class="flex justify-center px-3"
                          :class="msg.attachments.filter(a => a.type === 'image').length > 1 ? 'grid grid-cols-2 gap-1' : ''"
                      >
                        <img
                            v-for="a in msg.attachments.filter(a => a.type === 'image')"
                            :key="a.id"
                            :src="a.url"
                            :alt="a.name"
                            class="rounded-lg max-h-64 w-full object-cover cursor-pointer hover:opacity-90 transition"
                            @click="previewImage(a.url)"
                        />
                      </div>

                      <!-- ویس -->
                      <div v-for="a in msg.attachments.filter(a => a.type === 'voice')" :key="a.id" class="px-3 mt-1">
                        <VoicePlayer :url="a.url" :duration="a.voiceDuration ?? 0" />
                      </div>

                      <!-- فایل‌های عادی -->
                      <div v-for="a in msg.attachments.filter(a => a.type === 'file')" :key="a.id" class="mx-3 mt-1 flex items-center gap-2 p-2 bg-white/20 rounded-lg">
                        <Icon :icon="getFileIcon(a.name)" class="text-2xl" />
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-medium truncate">{{ a.name }}</p>
                          <p class="text-[10px] opacity-70">{{ formatFileSize(a.size) }}</p>
                        </div>
                        <a :href="a.url" download class="hover:scale-110 transition">
                          <Icon icon="solar:download-linear" class="text-sm" />
                        </a>
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
                            :icon="msg.status === 'pending' ? 'mdi:clock-time-four-outline' : msg.failed ? 'mdi:alert-circle-outline' : (msg.readBy.includes(currentUser.id) ? 'solar:check-read-linear' : 'solar:check-linear')"
                            :class="['text-xs', msg.failed ? 'text-red-400' : (msg.readBy.includes(currentUser.id) ? 'text-emerald-300' : 'text-primary-300')]"
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
        </template>
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
      <div v-if="!isNearBottom" class="absolute bottom-24 inset-e-6 z-20">
        <button @click="scrollToBottom" class="flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-full text-xs font-medium shadow-lg hover:bg-primary-600 transition-all">
          <Icon icon="mingcute:arrow-down-line" />
          <span v-if="unreadCount > 0">{{ unreadCount }} new</span>
        </button>
      </div>

      <Teleport to="body">
        <div v-if="previewImageUrl" class="fixed inset-0 z-80 bg-black/90 flex items-center justify-center" @click="previewImageUrl = null">
          <div class="max-w-[95vw] max-h-[95vh]" @click.stop>
            <img :src="previewImageUrl" class="max-w-[95vw] max-h-[95vh] object-contain rounded-lg" alt="" />
          </div>
          <button @click="previewImageUrl = null" class="fixed top-4 inset-e-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            <Icon icon="mingcute:close-line" class="text-white text-2xl" />
          </button>
        </div>
      </Teleport>

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
            <button @click="stopRecording" class="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
            <Icon :icon="isSendingVoice ? 'mdi:loading' : 'solar:plain-bold'" :class="isSendingVoice ? 'animate-spin' : ''" />
            </button>
          </div>
        </div>

        <!-- Reply Preview -->
        <div v-if="replyTo" class="mb-2 px-3 py-2 bg-primary-50 rounded-full border border-primary-200 flex items-center gap-2">
          <div class="flex-1">
            <p class="text-xs font-medium text-primary-500">Replying to {{ getMemberName(replyTo.senderId) }}</p>
            <p class="text-xs text-primary-400 truncate">{{ replyTo.text }}</p>
          </div>
          <button @click="replyTo = null" class="text-primary-400 hover:text-primary-600">
            <Icon icon="mingcute:close-line" />
          </button>
        </div>

        <!-- Edit Preview -->
        <div v-if="editingMessage" class="mb-2 px-3 py-2 bg-amber-50 rounded-full border border-amber-200 flex items-center gap-2">
          <Icon icon="mi:edit" class="text-amber-500 shrink-0" />
          <p class="text-xs text-amber-600 flex-1 truncate">Editing: {{ editingMessage.text }}</p>
          <button @click="cancelEdit" class="text-amber-400 hover:text-amber-600">
            <Icon icon="mingcute:close-line" />
          </button>
        </div>

        <!-- Input Area -->
        <div ref="inputAreaRef" class="bg-white rounded-3xl border border-primary-200 shadow-sm overflow-hidden">

          <!-- Attachment Menu -->
          <Transition name="slide-up">
            <div v-if="showAttachMenu" class="overflow-hidden px-4 pt-3 pb-2 border-b border-primary-100">
              <p class="text-xs text-primary-400 mb-2 font-medium">Attach & Share</p>

              <button @click="openFilePicker('image')" class="flex items-center gap-2 w-full px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-all text-sm text-primary-700 mb-1">
                <Icon icon="solar:gallery-linear" class="text-primary-500" />
                Upload Images
              </button>

              <button @click="openFilePicker('file')" class="flex items-center gap-2 w-full px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-all text-sm text-primary-700 mb-1">
                <Icon icon="solar:document-linear" class="text-primary-500" />
                Upload Files
              </button>

              <button @click="showCreateTodoInline = !showCreateTodoInline; showAttachMenu = false" class="flex items-center gap-2 w-full px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-all text-sm text-primary-700 mt-1">
                <Icon icon="mingcute:task-2-line" class="text-primary-500" />
                Create Task
              </button>
            </div>
          </Transition>

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
                :class="['p-2 rounded-full transition-all shrink-0', isRecording ? 'bg-red-100 text-red-500' : 'text-primary-400 hover:bg-primary-50 hover:text-primary-500']"
                v-tooltip="'Record voice message'"
            >
              <Icon icon="mdi:microphone" class="text-xl" />
            </button>

            <!-- Attachment Button -->
            <button
                @click="showAttachMenu = !showAttachMenu"
                :class="['p-2 rounded-full transition-all shrink-0', showAttachMenu ? 'bg-primary-100 text-primary-600' : 'text-primary-400 hover:bg-primary-50 hover:text-primary-500']"
                v-tooltip="'Attach file or image'"
            >
              <Icon icon="lucide:paperclip" class="text-lg" />
            </button>

            <!-- Text Input -->
            <textarea
                ref="inputRef"
                v-model="inputText"
                @input="handleTypingInput"
                @keydown.enter.exact.prevent="sendMessage"
                @keydown.enter.shift.exact="inputText += '\n'"
                rows="1"
                placeholder="Type a message..."
                class="flex-1 resize-none bg-transparent text-sm text-primary-800 placeholder-primary-300 focus:outline-none max-h-32 leading-relaxed py-1.5"
                style="field-sizing: content"
            />

            <!-- Send Button -->
            <button
                @click="sendMessage"
                :disabled="!inputText.trim()"
                :class="[
              'p-2.5 rounded-full transition-all shrink-0',
              inputText.trim()
                ? 'bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-200 hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-primary-100 text-primary-300 cursor-not-allowed'
            ]"
                v-tooltip="'Send message'"
            >
              <Icon icon="pepicons-pop:send" class="text-xl" />
            </button>
          </div>
        </div>
      </div>
      </template>

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
            class="absolute inset-y-0 inset-e-0 z-40 w-full max-w-sm bg-white shadow-2xl flex flex-col"
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
                <div v-else :class="['w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-sm', colorFor(activeGroup.id)]">
              {{ activeGroup.name[0] }}
                </div>
                <label v-if="isGroupAdmin" class="absolute -bottom-1 -inset-e-1 p-2 rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600 cursor-pointer transition-all">
              <Icon icon="solar:camera-bold" class="text-sm" />
                  <input type="file" accept="image/*" class="hidden" @change="handleActiveGroupAvatarSelect" />
                </label>
              </div>

              <div class="w-full">
                <label class="block text-[11px] font-semibold uppercase tracking-wide text-primary-300 mb-1">Name</label>
                <input
                    v-model="groupInfoForm.name"
                    @blur="saveGroupInfo"
                    @keyup.enter="($event.target as HTMLInputElement).blur()"
                    type="text"
                    class="w-full px-3 py-2 rounded-xl border border-transparent hover:border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all text-sm font-semibold text-primary-900 text-center"
                    :disabled="!isGroupAdmin"
                />
              </div>

              <div class="w-full">
                <label class="block text-[11px] font-semibold uppercase tracking-wide text-primary-300 mb-1">Description</label>
                <textarea
                    v-model="groupInfoForm.description"
                    @blur="saveGroupInfo"
                    rows="2"
                    placeholder="Add a description..."
                    class="w-full px-3 py-2 rounded-xl border border-transparent hover:border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all text-sm text-primary-600 text-center resize-none"
                    :disabled="!isGroupAdmin"
                />
              </div>
            </div>

            <!-- Section 2: Members -->
            <div class="p-4">
              <div class="flex items-center justify-between px-2 pb-2">
                <p class="text-[11px] font-semibold uppercase tracking-wide text-primary-300">
                  Members — {{ members.length }}
                </p>
                <button
                    v-if="isGroupAdmin"
                    @click="showAddMemberDialog = true"
                    class="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  <Icon icon="mingcute:user-add-line" class="text-sm" />
                  Add
                </button>
              </div>

              <div class="space-y-1">
                <div
                    v-for="m in members"
                    :key="m.userId"
                    class="group/member flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <img v-if="m.avatarUrl" :src="m.avatarUrl" class="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                  <div v-else :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0', colorFor(m.userId)]">
                    {{ m.name[0] }}
                  </div>
                  <span
                      class="absolute bottom-0 inset-e-0 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                      :class="onlineUserIds.includes(m.userId) ? 'bg-emerald-500' : 'bg-primary-200'"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-primary-800 truncate">
                      {{ m.name }}<span v-if="m.userId === currentUser.id" class="text-primary-400 font-normal"> (you)</span>
                    </p>
                    <p class="text-xs text-primary-400">{{ m.role === 'admin' ? 'Admin' : 'Member' }}</p>
                  </div>

                  <!-- مدیر می‌تونه نقش بقیه رو عوض کنه یا حذفشون کنه؛ خودِ فرد هم می‌تونه خودش رو حذف کنه (leave) -->
                  <div v-if="isGroupAdmin && m.userId !== currentUser.id" class="opacity-0 group-hover/member:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                        @click="confirmRoleChange(m)"
                        v-tooltip="m.role === 'admin' ? 'Make member' : 'Make admin'"
                        class="p-1.5 rounded-lg text-primary-400 hover:bg-primary-100 hover:text-primary-600"
                    >
                      <Icon icon="mingcute:vip-2-line" class="text-sm" />
                    </button>
                    <button
                        @click="confirmRemoveMember(m)"
                        v-tooltip="'Remove from group'"
                        class="p-1.5 rounded-lg text-primary-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Icon icon="mingcute:user-remove-line" class="text-sm" />
                    </button>
                  </div>
                  <button
                      v-else-if="m.userId === currentUser.id"
                      @click="confirmLeaveGroup"
                      v-tooltip="'Leave group'"
                      class="opacity-0 group-hover/member:opacity-100 transition-opacity p-1.5 rounded-lg text-primary-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Icon icon="mingcute:exit-line" class="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Teleport to="body">
            <div
                v-if="showAddMemberDialog"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4"
                @click.self="closeAddMemberDialog"
            >
              <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[70vh] flex flex-col">
                <div class="flex items-center justify-between p-5 border-b border-primary-100">
                  <h3 class="text-base font-bold text-primary-900">Add Member</h3>
                  <button @click="closeAddMemberDialog" class="text-primary-400 hover:text-primary-600 text-xl">✕</button>
                </div>
                <div class="p-4">
                  <div class="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2">
                    <Icon icon="solar:magnifer-linear" class="text-primary-400 shrink-0 text-sm" />
                    <input
                        v-model="memberSearchQuery"
                        @input="handleMemberSearch"
                        type="text"
                        placeholder="Search by username or name..."
                        class="flex-1 bg-transparent text-sm text-primary-800 placeholder-primary-300 focus:outline-none"
                        autofocus
                    />
                  </div>
                </div>
                <div class="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
                  <button
                      v-for="u in memberSearchResults"
                      :key="u.id"
                      @click="handleAddMember(u.id)"
                      :disabled="addingMemberId !== null"
                      class="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-primary-50 transition-colors text-start disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <img v-if="u.avatarUrl" :src="u.avatarUrl" class="w-9 h-9 rounded-full object-cover shrink-0" alt="" />
                    <div v-else :class="['w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0', colorFor(u.id)]">
                      {{ u.name[0] }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-primary-800 truncate">{{ u.name }}</p>
                      <p class="text-xs text-primary-400" dir="ltr">@{{ u.username }}</p>
                    </div>
                    <Icon v-if="addingMemberId === u.id" icon="mdi:loading" class="animate-spin text-primary-400 shrink-0" />
                  </button>
                  <p v-if="memberSearchQuery.length >= 2 && memberSearchResults.length === 0" class="text-center text-xs text-primary-300 py-4">
                    No users found
                  </p>
                </div>
              </div>
            </div>
          </Teleport>
        </aside>
      </Transition>

      <!-- Click away overlay for message menu -->
      <div v-if="activeMenuId" class="fixed inset-0 z-10" @click="activeMenuId = null"></div>
    </div>
    <Teleport to="body">
      <div
          v-if="showUserProfileDialog && viewedProfile"
          class="fixed inset-0 z-70 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="showUserProfileDialog = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <!-- بنر -->
          <div class="h-28 bg-linear-to-l from-primary-500 to-primary-400 relative">
            <img v-if="viewedProfile.coverUrl" :src="viewedProfile.coverUrl" class="w-full h-full object-cover" alt="" />
            <button @click="showUserProfileDialog = false" class="absolute top-3 inset-e-3 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50">
              <Icon icon="mingcute:close-line" class="text-lg" />
            </button>
          </div>
          <!-- آواتار روکار -->
          <div class="flex flex-col items-center relative z-50 -mt-12 px-6 pb-6">
            <img
                v-if="viewedProfile.avatarUrl"
                :src="viewedProfile.avatarUrl"
                class="w-24 h-24 rounded-full object-cover border-2 border-white shadow-lg"
             alt="profile"/>
            <div v-else class="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-lg" :class="colorFor(viewedProfile.id)">
              {{ viewedProfile.name[0] }}
            </div>
            <h3 class="mt-3 text-lg font-bold text-primary-900">{{ viewedProfile.name }}</h3>
            <p class="text-sm text-primary-400" dir="ltr">@{{ viewedProfile.username }}</p>
            <p v-if="viewedProfile.bio" class="mt-2 text-sm text-primary-600 text-center">{{ viewedProfile.bio }}</p>
            <div v-if="viewedProfile.social_links?.length" class="mt-4 flex items-center gap-2">
              <a
                  v-for="link in viewedProfile.social_links"
                  :key="link.platform + link.url"
                  :href="link.url"
                  target="_blank"
                  rel="noopener"
                  v-tooltip="link.url"
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
              >
                <Icon :icon="platformInfo(link.platform).icon" class="text-base" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <Teleport to="body">
      <div
          v-if="showAttachmentPreviewDialog"
          class="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="closeAttachmentPreview"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col">
          <div class="flex items-center justify-between p-4 border-b border-primary-100">
            <h3 class="text-sm font-bold text-primary-900">{{ pendingFiles.length }} Files Selected</h3>
            <button @click="closeAttachmentPreview" class="text-primary-400 hover:text-primary-600 text-xl">✕</button>
          </div>

          <div class="flex-1 overflow-y-auto p-4 flex flex-wrap justify-center gap-2">
            <div
                v-for="(f, i) in pendingFiles"
                :key="i"
                class="relative w-24 aspect-square rounded-xl overflow-hidden bg-primary-50 border border-primary-100"
            >
              <img v-if="f.isImage" :src="f.previewUrl" class="w-full h-full object-cover" alt="" />
              <div v-else class="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                <Icon :icon="getFileIcon(f.file.name)" class="text-2xl text-primary-400" />
                <p class="text-[10px] text-primary-500 truncate w-full text-center">{{ f.file.name }}</p>
              </div>
              <button
                  @click="removePendingFile(i)"
                  class="absolute top-1 inset-e-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <Icon icon="mingcute:close-line" class="text-xs" />
              </button>
            </div>
          </div>

          <div class="p-4 border-t border-primary-100 space-y-3">
        <textarea
            v-model="attachmentCaption"
            rows="2"
            placeholder="Add a caption.."
            class="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 resize-none"
        />
            <button
                @click="confirmSendAttachments"
                class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all"
            >
              <Icon icon="solar:plain-bold" class="text-base" />
              Send {{ pendingFiles.length }} Files
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    <Teleport to="body">
      <div
          v-if="confirmDialog"
          class="fixed inset-0 z-75 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="closeConfirm"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
          <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
              :class="confirmDialog.danger ? 'bg-red-50' : 'bg-primary-50'"
          >
            <Icon
                :icon="confirmDialog.danger ? 'mdi:alert-outline' : 'mdi:help-circle-outline'"
                class="text-2xl"
                :class="confirmDialog.danger ? 'text-red-500' : 'text-primary-500'"
            />
          </div>
          <h3 class="mt-3 text-base font-bold text-primary-900">{{ confirmDialog.title }}</h3>
          <p class="mt-1 text-sm text-primary-500">{{ confirmDialog.message }}</p>

          <div class="mt-5 flex gap-3">
            <button
                @click="closeConfirm"
                :disabled="confirmLoading"
                class="flex-1 rounded-xl border border-primary-200 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 disabled:opacity-50"
            >
              انصراف
            </button>
            <button
                @click="runConfirm"
                :disabled="confirmLoading"
                class="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium text-white disabled:opacity-50"
                :class="confirmDialog.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'"
            >
              <Icon v-if="confirmLoading" icon="mdi:loading" class="animate-spin text-base" />
              <span v-else>{{ confirmDialog.confirmLabel }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { Todo, Priority } from '~/types/todoType'
import PrioritySlider from '~/components/PrioritySlider.vue'
import { useGroupChat, type ApiGroup, type ApiMessage } from '~/composables/useGroupChat'
import { useAuth } from '~/composables/useAuth'
import {id} from "postcss-selector-parser";
import api, { getErrorMessage } from '~/src/services/api'
import { toast } from 'vue-sonner'
import { platformInfo } from '~/utils/socialPlatforms'
import { useNotifications } from '~/composables/useNotifications'

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

const isSendingVoice = ref(false)

const { authState } = useAuth()
const currentUser = computed(() => ({
      id: authState.user ? Number((authState.user as any).id ?? 0) : 0,
      name: authState.user?.name || 'You',
    }))

    const avatarBgOptions = ['bg-primary-500', 'bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500']
    function colorFor(id: number): string {
      return avatarBgOptions[id % avatarBgOptions.length]
          }

const {
  groups: apiGroups,
  messagesByGroup,
  fetchGroups,
  fetchMessages,
  createGroup: apiCreateGroup,
  sendMessage: apiSendMessage,
  pushIncomingMessage,
  toggleReaction: apiToggleReaction,
  togglePin: apiTogglePin,
  deleteMessage: apiDeleteMessage,
  editMessage: apiEditMessage,
  updateIncomingMessage,
  removeIncomingMessage,
  sendTyping: apiSendTyping,
  markRead: apiMarkRead,
  membersByGroup,
  fetchMembers,
  searchUsers,
  inviteMember: apiInviteMember,
  removeMember: apiRemoveMember,
  updateMemberRole: apiUpdateMemberRole,
  updateGroup: apiUpdateGroup,
  uploadGroupAvatar: apiUploadGroupAvatar,
  sendMessageWithFiles: apiSendMessageWithFiles,
  deleteGroup: apiDeleteGroup,
  fetchUserProfile,
  addOptimisticMessage,
  replaceMessage,
  markMessageFailed,
} = useGroupChat()
const activeGroupId = ref<number | null>(null)

let currentEchoChannel: string | null = null

const showUserProfileDialog = ref(false)
const viewedProfile = ref<{ id: number; name: string; username: string; avatarUrl: string | null; coverUrl: string | null } | null>(null)

async function openUserProfile(userId: number): Promise<void> {
  const profile = await fetchUserProfile(userId)
  if (profile) {
    viewedProfile.value = profile
    showUserProfileDialog.value = true
  }
}

let typingTimeoutId: number | null = null
function handleTypingInput(): void {
  if (!activeGroupId.value) return
  if (typingTimeoutId) return // تا وقتی تایمر قبلی تموم نشده، دوباره نفرست
  apiSendTyping(activeGroupId.value)
  typingTimeoutId = window.setTimeout(() => { typingTimeoutId = null }, 2000)
}

const onlineUserIds = ref<number[]>([])
let currentPresenceChannel: string | null = null

function subscribeToGroup(groupId: number): void {
  const { $echo } = useNuxtApp()

  if (currentEchoChannel) {
    $echo.leave(currentEchoChannel)
  }

  currentEchoChannel = `group.${groupId}`
  $echo.private(currentEchoChannel)
      .listen('.message.sent', (e: { groupId: number; message: ApiMessage }) => {
        pushIncomingMessage(e.groupId, e.message)
      })

      .listen('.message.reacted', (e: { groupId: number; message: ApiMessage }) => {
        updateIncomingMessage(e.groupId, e.message)
      })
      .listen('.message.updated', (e: { groupId: number; message: ApiMessage }) => {
        updateIncomingMessage(e.groupId, e.message)
      })
      .listen('.message.deleted', (e: { groupId: number; messageId: number }) => {
        removeIncomingMessage(e.groupId, e.messageId)
      })
      .listen('.message.pinned', (e: { groupId: number; messageId: number; pinned: boolean }) => {
        const arr = messagesByGroup[e.groupId]
        const msg = arr?.find(m => m.id === e.messageId)
        if (msg) msg.pinned = e.pinned
      })

      .listen('.user.typing', (e: { groupId: number; userId: number; userName: string }) => {
        if (e.userId === currentUser.value.id) return
        typingNames.value[e.userId] = e.userName
        if (!typingUsers.value.includes(e.userId)) {
          typingUsers.value.push(e.userId)
        }
        setTimeout(() => {
          typingUsers.value = typingUsers.value.filter(id => id !== e.userId)
        }, 3000)
      })

      .listen('.message.read', (e: { groupId: number; userId: number; lastReadMessageId: number }) => {
        const arr = messagesByGroup[e.groupId]
        if (!arr) return
        arr.forEach(m => {
          if (m.id <= e.lastReadMessageId && !m.readBy.includes(e.userId)) {
            m.readBy.push(e.userId)
          }
        })
      })

  if (currentPresenceChannel) {
    $echo.leave(currentPresenceChannel)
  }
  currentPresenceChannel = `online-group.${groupId}`
  onlineUserIds.value = []
  $echo.join(currentPresenceChannel)
      .here((users: { id: number }[]) => {
        onlineUserIds.value = users.map(u => u.id)
      })
      .joining((user: { id: number }) => {
        if (!onlineUserIds.value.includes(user.id)) onlineUserIds.value.push(user.id)
      })
      .leaving((user: { id: number }) => {
        onlineUserIds.value = onlineUserIds.value.filter(id => id !== user.id)
      })
}

const activeGroup = computed<ApiGroup | undefined>(() =>
    apiGroups.value.find(g => g.id === activeGroupId.value) ?? apiGroups.value[0]
)

const members = computed(() => activeGroupId.value ? (membersByGroup[activeGroupId.value] ?? []) : [])
const onlineMembers = computed(() =>
    members.value.filter(m => onlineUserIds.value.includes(m.userId))
)
const myRole = computed<'admin' | 'member' | null>(() => {
  const me = members.value.find(m => m.userId === currentUser.value.id)
      return me?.role ?? null
    })
const isGroupAdmin = computed(() => myRole.value === 'admin')

const messages = computed<ApiMessage[]>(() =>
    activeGroupId.value ? (messagesByGroup[activeGroupId.value] ?? []) : []
)

const { clearMessageNotice } = useNotifications()
async function selectGroup(id: number): Promise<void> {
  activeGroupId.value = id
  subscribeToGroup(id)
  clearMessageNotice(id)
  if (!membersByGroup[id]) {
    await fetchMembers(id)
  }
  if (!messagesByGroup[id]) {
    await fetchMessages(id)
  }
  const last = [...(messagesByGroup[id] ?? [])].reverse().find(m => m.status !== 'pending')
  if (last) apiMarkRead(id, last.id)
}

async function createGroup(input: { name: string; description: string }): Promise<void> {
  const group = await apiCreateGroup({ name: input.name, description: input.description || undefined })
  if (group) {
    activeGroupId.value = group.id
    subscribeToGroup(group.id)
  }
}

interface PendingFile {
  file: File
  previewUrl: string
  isImage: boolean
}

const showAttachmentPreviewDialog = ref(false)
const pendingFiles = ref<PendingFile[]>([])
const attachmentCaption = ref('')

function openFilePicker(type: 'image' | 'file'): void {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  if (type === 'image') input.accept = 'image/*'
  input.onchange = (e) => handleFilesSelected(e, type)
  input.click()
}

function handleFilesSelected(event: Event, type: 'image' | 'file'): void {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (!files.length) return

  pendingFiles.value = files.map(file => ({
    file,
    previewUrl: type === 'image' ? URL.createObjectURL(file) : '',
    isImage: type === 'image',
  }))
  attachmentCaption.value = ''
  showAttachMenu.value = false
  showAttachmentPreviewDialog.value = true
}

function removePendingFile(index: number): void {
  const f = pendingFiles.value[index]
  if (f.previewUrl) URL.revokeObjectURL(f.previewUrl)
  pendingFiles.value.splice(index, 1)
  if (pendingFiles.value.length === 0) closeAttachmentPreview()
}

function closeAttachmentPreview(): void {
  pendingFiles.value.forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl) })
  pendingFiles.value = []
  attachmentCaption.value = ''
  showAttachmentPreviewDialog.value = false
}

async function confirmSendAttachments(): Promise<void> {
  if (!activeGroupId.value || pendingFiles.value.length === 0) return

  await apiSendMessageWithFiles(
      activeGroupId.value,
      pendingFiles.value.map(f => f.file),
      {
        text: attachmentCaption.value.trim() || undefined,
        reply_to: replyTo.value?.id,
      }
  )

  replyTo.value = null
  closeAttachmentPreview()
  scrollToBottom()
}

const groupInfoForm = reactive({ name: '', description: '' })

watch(activeGroup, (g) => {
  if (g) {
    groupInfoForm.name = g.name
    groupInfoForm.description = g.description || ''
  }
}, { immediate: true })

async function saveGroupInfo(): Promise<void> {
  if (!activeGroupId.value || !isGroupAdmin.value) return
  const g = activeGroup.value
  if (!g) return
  if (groupInfoForm.name === g.name && groupInfoForm.description === (g.description || '')) return // چیزی عوض نشده، درخواست الکی نزن

  await apiUpdateGroup(activeGroupId.value, {
    name: groupInfoForm.name.trim() || g.name,
    description: groupInfoForm.description.trim(),
  })
}

const confirmDialog = ref<{
  title: string
  message: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void | Promise<void>
} | null>(null)
const confirmLoading = ref(false)

function openConfirm(opts: NonNullable<typeof confirmDialog.value>): void {
  confirmDialog.value = opts
}
function closeConfirm(): void {
  confirmDialog.value = null
}
async function runConfirm(): Promise<void> {
  if (!confirmDialog.value) return
  confirmLoading.value = true
  try {
    await confirmDialog.value.onConfirm()
  } finally {
    confirmLoading.value = false
    confirmDialog.value = null
  }
}

function confirmDeleteGroup(): void {
  if (!activeGroup.value) return
  openConfirm({
    title: 'حذف گروه',
    message: `مطمئنی می‌خوای گروه «${activeGroup.value.name}» رو کامل حذف کنی؟ این کار غیرقابل بازگشته و همه‌ی پیام‌ها هم پاک می‌شن.`,
    confirmLabel: 'حذف گروه',
    danger: true,
    onConfirm: async () => {
      const id = activeGroupId.value!
      const ok = await apiDeleteGroup(id)
      if (ok) {
        const next = apiGroups.value.find(g => g.id !== id)
        activeGroupId.value = next ? next.id : null
        if (activeGroupId.value) await selectGroup(activeGroupId.value)
      }
    },
  })
}

function confirmRoleChange(m: { userId: number; name: string; role: 'admin' | 'member' }): void {
  const makeAdmin = m.role !== 'admin'
  openConfirm({
    title: makeAdmin ? 'ارتقا به مدیر' : 'تنزل به عضو عادی',
    message: `${m.name} ${makeAdmin ? 'مدیر گروه بشه' : 'از مدیریت گروه خارج بشه'}؟`,
    confirmLabel: 'تأیید',
    onConfirm: () => apiUpdateMemberRole(activeGroupId.value!, m.userId, makeAdmin ? 'admin' : 'member'),
  })
}

function confirmRemoveMember(m: { userId: number; name: string }): void {
  openConfirm({
    title: 'حذف عضو',
    message: `${m.name} از گروه حذف بشه؟`,
    confirmLabel: 'حذف',
    danger: true,
    onConfirm: () => apiRemoveMember(activeGroupId.value!, m.userId),
  })
}

function confirmLeaveGroup(): void {
  if (!activeGroup.value) return
  openConfirm({
    title: 'ترک گروه',
    message: `مطمئنی می‌خوای گروه «${activeGroup.value.name}» رو ترک کنی؟`,
    confirmLabel: 'ترک گروه',
    danger: true,
    onConfirm: async () => {
      const id = activeGroupId.value!
      await apiRemoveMember(id, currentUser.value.id)
      showGroupInfoPanel.value = false
      const next = apiGroups.value.find(g => g.id !== id)
      activeGroupId.value = next ? next.id : null
      if (activeGroupId.value) await selectGroup(activeGroupId.value)
    },
  })
}

function lastMessage(groupId: number): ApiMessage | undefined {
  const arr = messagesByGroup[groupId]
  return arr && arr.length ? arr[arr.length - 1] : undefined
}

function getMemberById(id: number) {
  return members.value.find(m => m.userId === id)
}

function getMemberName(id: number): string {
  return getMemberById(id)?.name ?? 'Unknown'
}


const showAddMemberDialog = ref(false)
const memberSearchQuery = ref('')
const memberSearchResults = ref<{ id: number; name: string; username: string; avatarUrl: string | null }[]>([])
let memberSearchDebounce: number | null = null

function handleMemberSearch(): void {
  if (memberSearchDebounce) clearTimeout(memberSearchDebounce)
  memberSearchDebounce = window.setTimeout(async () => {
    memberSearchResults.value = await searchUsers(memberSearchQuery.value)
  }, 300)
}

const addingMemberId = ref<number | null>(null)
async function handleAddMember(userId: number): Promise<void> {
  if (!activeGroupId.value) return
  if (addingMemberId.value) return // یه درخواست هم‌زمان کافیه
  addingMemberId.value = userId
  try {
  const ok = await apiInviteMember(activeGroupId.value, userId)
  if (ok) {
    memberSearchQuery.value = ''
    memberSearchResults.value = []
    showAddMemberDialog.value = false
  }
  } finally {
    addingMemberId.value = null
  }
}

function closeAddMemberDialog(): void {
  showAddMemberDialog.value = false
  memberSearchQuery.value = ''
  memberSearchResults.value = []
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
  const sorted = [...apiGroups.value].sort((a, b) => {
    const at = new Date(a.lastMessageAt ?? a.createdAt).getTime()
    const bt = new Date(b.lastMessageAt ?? b.createdAt).getTime()
        return bt - at
      })
  if (!q) return sorted
  return sorted.filter(g => g.name.toLowerCase().includes(q))
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

async function submitCreateGroup(): Promise<void> {
  const name = newGroupForm.value.name.trim()
  if (!name) return
  await createGroup({
    name,
    description: newGroupForm.value.description.trim(),
  })
  closeCreateGroupDialog()
  mobilePane.value = 'main'
}

async function handleActiveGroupAvatarSelect(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !activeGroupId.value) return
  await apiUploadGroupAvatar(activeGroupId.value, file)
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
const typingNames = ref<Record<number, string>>({})
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
  const names = typingUsers.value.map(id => typingNames.value[id] ?? 'someone')
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

function formatTime(date: Date | string): string {
  date = new Date(date)
  return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

function getDateLabel(date: Date | string): string {
  date = new Date(date)
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
  return msg?.reactions[emoji]?.includes(currentUser.value.id) ?? false
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
  if (!activeGroupId.value) return
  if (isSendingVoice.value) return
  const audioFile = new File(
      [pendingVoiceMessage.value.blob],
     'voice-message.webm',
      { type: 'audio/webm' }
      )
  isSendingVoice.value = true
  const groupId = activeGroupId.value
  const duration = pendingVoiceMessage.value.duration
  pendingVoiceMessage.value = null // فوری UI ضبط رو ببند

  apiSendMessageWithFiles(groupId, [audioFile], { voice_duration: duration })
      .finally(() => {
        isSendingVoice.value = false
        scrollToBottom()
      })
}

async function sendMessage(): Promise<void> {
  const text = inputText.value.trim()
  if (!text || !activeGroupId.value) return
  if (editingMessage.value) {
    await apiEditMessage(activeGroupId.value, editingMessage.value.id, text)
    cancelEdit()
    inputText.value = ''
    return
  }

  const groupId = activeGroupId.value
  const replyToId = replyTo.value?.id ?? null
  const tempId = -Date.now()
  addOptimisticMessage(groupId, {
        id: tempId,
        senderId: currentUser.value.id,
        text,
        timestamp: new Date().toISOString(),
        type: 'text',
        pinned: false,
        edited: false,
        replyTo: replyToId,
        reactions: {},
        readBy: [],
        mentions: [],
        todoRef: null,
        attachments: [],
        status: 'pending',
  })

  inputText.value = ''
  replyTo.value = null
  showAttachMenu.value = false
  scrollToBottom()
  const real = await apiSendMessage(groupId, { text, reply_to: replyToId ?? undefined })
  if (real) {
    replaceMessage(groupId, tempId, real)
  } else {
    markMessageFailed(groupId, tempId)
  }
}

function deleteMessage(id: number): void {
  if (!activeGroupId.value) return
  apiDeleteMessage(activeGroupId.value, id)
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
  if (!activeGroupId.value) return
  apiTogglePin(activeGroupId.value, id)
}

function toggleReaction(msgId: number, emoji: string): void {
  if (!activeGroupId.value) return
  apiToggleReaction(activeGroupId.value, msgId, emoji)
}

function createTodoFromChat(): void {
  const title = inlineTodo.value.title.trim()
  if (!title) return

  emit('create-todo', title, inlineTodo.value.description.trim(), inlineTodo.value.priority)

  messages.value.push({
    id:        Date.now(),
    senderId:  currentUser.value.id,
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
    bottomAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
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
  fetchGroups().then(() => {
    if (apiGroups.value.length > 0) {
      selectGroup(apiGroups.value[0].id)
    }
  })
  messagesContainer.value?.addEventListener('scroll', onScroll)
  window.addEventListener('resize', handleWindowResize)
  document.addEventListener('click', handleDropdownClickOutside)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeMenuId.value) {
      closeActiveMenu()
    }
  })
})

onUnmounted(() => {
  if (currentEchoChannel) {
    useNuxtApp().$echo.leave(currentEchoChannel)
  }
  if (currentPresenceChannel) {
    useNuxtApp().$echo.leave(currentPresenceChannel)
  }
})

onUnmounted((): void => {
  messagesContainer.value?.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', handleWindowResize)
  document.removeEventListener('click', handleDropdownClickOutside)
  if (recordingInterval.value) clearInterval(recordingInterval.value)
  if (audioElement.value) audioElement.value.pause()
})

watch(messages, (): void => {
  if (isNearBottom.value) {
    scrollToBottom()
    const last = [...messages.value].reverse().find(m => m.status !== 'pending')
    if (last && activeGroupId.value) apiMarkRead(activeGroupId.value, last.id)
  }
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.42s ease, transform 0.42s ease, max-height 0.42s ease;
  max-height: 300px;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
  max-height: 0;
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