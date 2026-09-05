<template>
  <div class="flex h-full w-full flex-1 overflow-hidden">
    <ChatSidebar
        :groups="apiGroups"
        :messages-by-group="messagesByGroup"
        :unread-counts="unreadCounts"
        :active-group-id="activeGroupId"
        :loading-groups="loadingGroups"
        :is-mobile="isMobile"
        v-model:sidebar-collapsed="sidebarCollapsed"
        v-model:mobile-pane="mobilePane"
        @select-group="selectGroup"
        @go-to-tasks="emit('open-tasks')"
        @create-group="handleCreateGroup"
    />

    <div :class="['relative flex flex-col h-full w-full bg-white/30 backdrop-blur-sm flex-1 min-w-0 overflow-hidden', isMobile && mobilePane !== 'main' ? 'hidden' : 'flex']">
      <ChatHeader
          v-if="activeGroupId"
          :group="activeGroup"
          :online-count="onlineMembers.length"
          :member-count="members.length"
          :is-admin="isGroupAdmin"
          :show-search="showSearch"
          @open-sidebar="mobilePane = 'sidebar'"
          @go-to-tasks="emit('open-tasks')"
          @open-group-tasks="openGroupTasks"
          @toggle-search="showSearch = !showSearch"
          @toggle-filter="emit('toggle-filter')"
          @open-info="showGroupInfoPanel = true"
          @delete-group="confirmDeleteGroup"
      />

      <div v-if="activeGroupId && showSearch" class="shrink-0 px-3 py-2 bg-white relative z-[9999]">
        <div class="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2.5">
          <Icon icon="solar:magnifer-linear" class="text-primary-400 shrink-0" />
          <input v-model="searchQuery" type="text" placeholder="Search messages..." class="flex-1 bg-transparent text-sm text-primary-800 placeholder-primary-300 focus:outline-none" autofocus />
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-primary-300 hover:text-primary-500 shrink-0"><Icon icon="mingcute:close-line" /></button>
        </div>
      </div>

      <ChatPinnedBar v-if="activeGroupId" :messages="pinnedMessages" :offset-for-search="showSearch" @open="showPinnedDialog = true" />
      <ChatPinnedDialog :open="showPinnedDialog" :messages="pinnedMessages" :members="members" @close="showPinnedDialog = false" @unpin="unpinMessage" @go-to-message="scrollToMessage" />

      <Transition name="fade">
        <div v-if="activeGroupId && currentVisibleDate" :key="currentVisibleDate" class="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
          <span class="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs text-primary-500 shadow-sm">{{ currentVisibleDate }}</span>
        </div>
      </Transition>

      <ChatMessageList
          ref="messageListRef"
          :messages="messages"
          :members="members"
          :current-user-id="currentUser.id"
          :active-group-id="activeGroupId"
          :loading-initial="loadingInitial"
          :loading-messages="loadingMessages"
          :ready="!activeGroupId || messagesReady || loadingMessages || loadingInitial"
          :highlighted-message-id="highlightedMessageId"
          :typing-users="chatEcho.typingUsers.value"
          :typing-names="chatEcho.typingNames.value"
          :search-query="searchQuery"
          @scroll="handleScroll"
          @date-divider-ref="dateDivider.setRef"
          @open-profile="openUserProfile"
          @preview-image="previewImageUrl = $event"
          @view-todo="emit('view-todo', $event)"
          @toggle-reaction="toggleReaction"
          @open-menu="openMessageMenu"
      />

      <ChatMessageMenu
          :message="activeMenuMessage"
          :trigger-rect="menuTriggerRect"
          :input-area-rect="messageInputRef?.inputAreaRef?.getBoundingClientRect()"
          :current-user-id="currentUser.id"
          @close="activeMenuId = null"
          @copy="copyMessage"
          @reply="msg => replyTo = msg"
          @edit="startEdit"
          @toggle-pin="togglePin"
          @delete="deleteMessage"
          @react="(id, emoji) => toggleReaction(id, emoji)"
      />

      <Transition enter-active-class="transition-opacity duration-100 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="!isNearBottom" class="absolute bottom-24 inset-e-6 z-20">
          <button @click="scrollToBottom()" class="flex items-center gap-1.5 p-2.5 bg-primary-500 text-white rounded-full text-sm font-medium shadow-lg hover:bg-primary-600 transition-all">
            <Icon icon="ep:arrow-down-bold" class="text-lg" />
            <span v-if="unreadCount > 0">{{ unreadCount }} new</span>
          </button>
        </div>
      </Transition>

      <Teleport to="body">
        <div v-if="previewImageUrl" class="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center" @click="previewImageUrl = null">
          <div class="max-w-[95vw] max-h-[95vh]" @click.stop><img :src="previewImageUrl" class="max-w-[95vw] max-h-[95vh] object-contain rounded-lg" alt="" /></div>
          <button @click="previewImageUrl = null" class="fixed top-4 inset-e-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition"><Icon icon="mingcute:close-line" class="text-white text-2xl" /></button>
        </div>
      </Teleport>

      <ChatMessageInput
          v-if="activeGroupId"
          ref="messageInputRef"
          v-model="inputText"
          :members="members"
          :reply-to="replyTo"
          :editing-message="editingMessage"
          :show-attach-menu="showAttachMenu"
          :show-create-todo="showCreateTodoInline"
          :is-recording="voice.isRecording.value"
          :is-sending-voice="isSendingVoice"
          :recording-duration="voice.recordingDuration.value"
          :recording-progress="voice.recordingProgress.value"
          @typing="handleTypingInput"
          @send="sendMessage"
          @cancel-reply="replyTo = null"
          @cancel-edit="cancelEdit"
          @toggle-attach-menu="showAttachMenu = !showAttachMenu"
          @toggle-create-task="showCreateTodoInline = !showCreateTodoInline; showAttachMenu = false"
          @pick-files="openFilePicker"
          @start-recording="voice.startRecording"
          @stop-recording="voice.stopRecording"
          @cancel-recording="voice.cancelRecording"
          @create-todo="createTodoFromChat"
      />

      <ChatGroupInfoPanel
          :open="showGroupInfoPanel"
          :group="activeGroup"
          :members="members"
          :online-user-ids="chatEcho.onlineUserIds.value"
          :is-admin="isGroupAdmin"
          :is-owner="isGroupOwner"
          :current-user-id="currentUser.id"
          @close="showGroupInfoPanel = false"
          @avatar-select="handleActiveGroupAvatarSelect"
          @save-info="saveGroupInfo"
          @open-add-member="showAddMemberDialog = true"
          @open-profile="openUserProfile"
          @change-role="confirmRoleChange"
          @remove-member="confirmRemoveMember"
          @leave-group="confirmLeaveGroup"
      />

      <ChatAddMemberDialog
          :open="showAddMemberDialog"
          :query="memberSearchQuery"
          :results="memberSearchResults"
          :adding-id="addingMemberId"
          @close="closeAddMemberDialog"
          @search="handleMemberSearch"
          @add="handleAddMember"
      />

      <div v-if="activeMenuId" class="fixed inset-0 z-10" @click="activeMenuId = null"></div>
    </div>

    <ChatUserProfileDialog :profile="viewedProfile" @close="showUserProfileDialog = false; viewedProfile = null" />
    <ChatAttachmentPreviewDialog
        :open="showAttachmentPreviewDialog"
        :files="pendingFiles"
        :caption="attachmentCaption"
        @close="closeAttachmentPreview"
        @remove-file="removePendingFile"
        @update:caption="attachmentCaption = $event"
        @send="confirmSendAttachments"
    />

    <ChatGroupTasksPanel
        :open="showGroupTasksPanel"
        :tasks="groupTasks"
        :current-user-id="currentUser.id"
        :loading="loadingGroupTasks"
        @close="showGroupTasksPanel = false"
        @open-task="openTaskFromPanel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import api, { getErrorMessage } from '~/src/services/api'
import { useAuth } from '~/composables/useAuth'
import { useGroupChat } from '~/composables/useGroupChat'
import { useChatEcho } from '~/composables/useChatEcho'
import { useVoiceRecorder } from '~/composables/useVoiceRecorder'
import { useChatScroll } from '~/composables/useChatScroll'
import { useDateDivider } from '~/composables/useDateDivider'
import { useConfirmDialog } from '~/composables/useConfirmDialog'
import { useNotifications } from '~/composables/useNotifications'
import type { ApiMessage, ApiGroup, GroupMember, InlineTodoForm, PendingFile, UserProfile } from '~/types/ChatType'
import type { Todo, Priority } from '~/types/todoType'

import ChatSidebar from '~/components/chat/ChatSidebar.vue'
import ChatHeader from '~/components/chat/ChatHeader.vue'
import ChatMessageList from '~/components/chat/ChatMessageList.vue'
import ChatMessageInput from '~/components/chat/ChatMessageInput.vue'
import ChatMessageMenu from '~/components/chat/ChatMessageMenu.vue'
import ChatPinnedBar from '~/components/chat/ChatPinnedBar.vue'
import ChatPinnedDialog from '~/components/chat/ChatPinnedDialog.vue'
import ChatGroupInfoPanel from '~/components/chat/ChatGroupInfoPanel.vue'
import ChatAddMemberDialog from '~/components/chat/ChatAddMemberDialog.vue'
import ChatUserProfileDialog from '~/components/chat/ChatUserProfileDialog.vue'
import ChatAttachmentPreviewDialog from '~/components/chat/ChatAttachmentPreviewDialog.vue'
import ChatGroupTasksPanel from '~/components/chat/ChatGroupTasksPanel.vue'

defineProps<{ todos?: Todo[] }>()
const emit = defineEmits<{
  'create-todo': [title: string, description: string, priority: Priority]
  'view-todo': [todo: NonNullable<ApiMessage['todoRef']>]
  'toggle-filter': []
  'open-tasks': []
}>()

const { authState } = useAuth()
const currentUser = computed(() => ({ id: Number(authState.user?.id ?? 0), name: authState.user?.name || 'You' }))

const {
  groups: apiGroups, messagesByGroup, loadingGroups, loadingMessages,
  fetchGroups, fetchMessages, createGroup: apiCreateGroup, sendMessage: apiSendMessage,
  toggleReaction: apiToggleReaction, togglePin: apiTogglePin, deleteMessage: apiDeleteMessage,
  editMessage: apiEditMessage, sendTyping: apiSendTyping, markRead: apiMarkRead,
  membersByGroup, fetchMembers, searchUsers, inviteMember: apiInviteMember,
  removeMember: apiRemoveMember, updateMemberRole: apiUpdateMemberRole,
  updateGroup: apiUpdateGroup, uploadGroupAvatar: apiUploadGroupAvatar,
  sendMessageWithFiles: apiSendMessageWithFiles, deleteGroup: apiDeleteGroup,
  fetchUserProfile, addOptimisticMessage, replaceMessage, markMessageFailed, unreadCounts, setChatContext,
} = useGroupChat()

const { clearMessageNotice } = useNotifications()
const { openConfirm } = useConfirmDialog()
const { isMobile } = useResponsiveMode()

const activeGroupId = ref<number | null>(null)
const activeGroup = computed<ApiGroup | undefined>(() => apiGroups.value.find(g => g.id === activeGroupId.value))
const members = computed<GroupMember[]>(() => activeGroupId.value ? (membersByGroup[activeGroupId.value] ?? []) : [])
const myRole = computed(() => members.value.find(m => m.userId === currentUser.value.id)?.role ?? null)
const isGroupAdmin = computed(() => myRole.value === 'admin' || myRole.value === 'owner')
const isGroupOwner = computed(() => myRole.value === 'owner')
const messages = computed<ApiMessage[]>(() => activeGroupId.value ? (messagesByGroup[activeGroupId.value] ?? []) : [])
const loadingInitial = computed(() => loadingGroups.value && apiGroups.value.length === 0)
const pinnedMessages = computed(() => messages.value.filter(m => m.pinned))

const chatEcho = useChatEcho()
const onlineMembers = computed(() => members.value.filter(m => chatEcho.onlineUserIds.value.includes(m.userId)))

const messageListRef = ref<InstanceType<typeof ChatMessageList> | null>(null)
const containerRef = computed(() => messageListRef.value?.containerRef ?? null)
const chatScroll = useChatScroll(containerRef)
const { isNearBottom, unreadCount, scrollToBottom, jumpToBottomInstant } = chatScroll
const dateDivider = useDateDivider(containerRef)
const currentVisibleDate = dateDivider.currentVisibleDate

const messagesReady = ref(false)
const messageInputRef = ref<InstanceType<typeof ChatMessageInput> | null>(null)

let previousMessageCount = 0

const showGroupTasksPanel = ref(false)
const groupTasks = ref<any[]>([])
const loadingGroupTasks = ref(false)

async function openGroupTasks(): Promise<void> {
  if (!activeGroupId.value) return
  showGroupTasksPanel.value = true
  loadingGroupTasks.value = true
  try {
    const res = await api.get(`/groups/${activeGroupId.value}/tasks`)
    groupTasks.value = res.data
  } catch (e: any) {
    toast.error(getErrorMessage(e, 'گرفتن تسک‌های گروه ناموفق بود'))
  } finally {
    loadingGroupTasks.value = false
  }
}

function openTaskFromPanel(task: any): void {
  // فعلاً فقط منتشرش می‌کنیم بیرون؛ اگه می‌خوای همینجا (با TodoDetail) باز بشه بگو تا وصلش کنیم
  emit('view-todo', { id: task.id, text: task.title, priority: task.priority })
  showGroupTasksPanel.value = false
}

async function selectGroup(id: number): Promise<void> {
  messagesReady.value = false
  activeGroupId.value = id
  setChatContext(id, currentUser.value.id)
  previousMessageCount = 0
  chatEcho.subscribe(id, currentUser.value.id)
  clearMessageNotice(id)
  if (!membersByGroup[id]) await fetchMembers(id)
  if (!messagesByGroup[id]) await fetchMessages(id)
  await nextTick()
  jumpToBottomInstant()
  requestAnimationFrame(() => { jumpToBottomInstant(); messagesReady.value = true })
  nextTick(dateDivider.update)
  const last = [...(messagesByGroup[id] ?? [])].reverse().find(m => m.status !== 'pending')
  if (last) apiMarkRead(id, last.id)
}

async function handleCreateGroup(input: { name: string; description: string }): Promise<void> {
  const group = await apiCreateGroup({ name: input.name, description: input.description || undefined })
  if (group) { activeGroupId.value = group.id; chatEcho.subscribe(group.id, currentUser.value.id) }
}

// ── Typing / input text ──────────────────────────────────────────────
const inputText = ref('')
let typingTimeoutId: number | null = null
function handleTypingInput(): void {
  if (!activeGroupId.value) return
  if (typingTimeoutId) return
  apiSendTyping(activeGroupId.value)
  typingTimeoutId = window.setTimeout(() => { typingTimeoutId = null }, 2000)
}

// ── Sending messages ──────────────────────────────────────────────────
const replyTo = ref<ApiMessage | null>(null)
const editingMessage = ref<ApiMessage | null>(null)

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
    id: tempId, senderId: currentUser.value.id, text, timestamp: new Date().toISOString(),
    type: 'text', pinned: false, edited: false, replyTo: replyToId, reactions: {},
    readBy: [], mentions: [], todoRef: null, attachments: [], status: 'pending',
  })

  inputText.value = ''
  replyTo.value = null
  showAttachMenu.value = false
  scrollToBottom()

  const real = await apiSendMessage(groupId, { text, reply_to: replyToId ?? undefined })
  if (real) replaceMessage(groupId, tempId, real)
  else markMessageFailed(groupId, tempId)
}

function startEdit(msg: ApiMessage): void {
  editingMessage.value = msg
  inputText.value = msg.text ?? ''
  nextTick(() => messageInputRef.value?.focusInput())
}
function cancelEdit(): void { editingMessage.value = null; inputText.value = '' }

function deleteMessage(id: number): void {
  openConfirm({
    title: 'حذف پیام', message: 'مطمئنی می‌خوای این پیام رو حذف کنی؟', confirmLabel: 'حذف', danger: true,
    onConfirm: () => { if (activeGroupId.value) apiDeleteMessage(activeGroupId.value, id) },
  })
}
function togglePin(id: number): void { if (activeGroupId.value) apiTogglePin(activeGroupId.value, id) }
function unpinMessage(id: number): void { togglePin(id) }
function toggleReaction(id: number, emoji: string): void { if (activeGroupId.value) apiToggleReaction(activeGroupId.value, id, emoji) }
function copyMessage(text: string): void { navigator.clipboard.writeText(text); toast.success('Message copied 📋') }

async function scrollToMessage(msgId: number): Promise<void> {
  highlightedMessageId.value = msgId
  await nextTick()
  document.getElementById(`message-${msgId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => { highlightedMessageId.value = null }, 3000)
}
const highlightedMessageId = ref<number | null>(null)

// ── Message action menu ──────────────────────────────────────────────
const activeMenuId = ref<number | null>(null)
const menuTriggerRect = ref<DOMRect | null>(null)
const activeMenuMessage = computed(() => messages.value.find(m => m.id === activeMenuId.value) ?? null)
function openMessageMenu(msg: ApiMessage, event: MouseEvent): void {
  if (activeMenuId.value === msg.id) { activeMenuId.value = null; return }
  menuTriggerRect.value = (event.currentTarget as HTMLElement).getBoundingClientRect()
  activeMenuId.value = msg.id
}

// ── Attachments / voice ──────────────────────────────────────────────
const showAttachMenu = ref(false)
const showAttachmentPreviewDialog = ref(false)
const pendingFiles = ref<PendingFile[]>([])
const attachmentCaption = ref('')
const previewImageUrl = ref<string | null>(null)
const isSendingVoice = ref(false)

function openFilePicker(type: 'image' | 'file'): void {
  const input = document.createElement('input')
  input.type = 'file'; input.multiple = true
  if (type === 'image') input.accept = 'image/*'
  input.onchange = (e) => {
    const files = Array.from((e.target as HTMLInputElement).files ?? [])
    if (!files.length) return
    pendingFiles.value = files.map(file => ({ file, previewUrl: type === 'image' ? URL.createObjectURL(file) : '', isImage: type === 'image' }))
    attachmentCaption.value = ''
    showAttachMenu.value = false
    showAttachmentPreviewDialog.value = true
  }
  input.click()
}
function removePendingFile(index: number): void {
  const f = pendingFiles.value[index]
  if (f.previewUrl) URL.revokeObjectURL(f.previewUrl)
  pendingFiles.value.splice(index, 1)
  if (pendingFiles.value.length === 0) closeAttachmentPreview()
}
function closeAttachmentPreview(): void {
  pendingFiles.value.forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl) })
  pendingFiles.value = []; attachmentCaption.value = ''; showAttachmentPreviewDialog.value = false
}
async function confirmSendAttachments(): Promise<void> {
  if (!activeGroupId.value || pendingFiles.value.length === 0) return
  await apiSendMessageWithFiles(activeGroupId.value, pendingFiles.value.map(f => f.file), { text: attachmentCaption.value.trim() || undefined, reply_to: replyTo.value?.id })
  replyTo.value = null
  closeAttachmentPreview()
  scrollToBottom()
}

const voice = useVoiceRecorder((blob, duration) => {
  if (!activeGroupId.value || isSendingVoice.value) return
  const audioFile = new File([blob], 'voice-message.webm', { type: 'audio/webm' })
  isSendingVoice.value = true
  apiSendMessageWithFiles(activeGroupId.value, [audioFile], { voice_duration: duration }).finally(() => {
    isSendingVoice.value = false
    scrollToBottom()
  })
})

// ── Inline task creation ─────────────────────────────────────────────
const showCreateTodoInline = ref(false)
async function createTodoFromChat(form: InlineTodoForm): Promise<void> {
  if (!form.title.trim() || !activeGroupId.value || form.assignedTo.length === 0) return
  try {
    await api.post(`/groups/${activeGroupId.value}/tasks`, { title: form.title, description: form.description.trim() || null, priority: form.priority, assigned_to: form.assignedTo })
    toast.success('تسک ساخته شد')
    showCreateTodoInline.value = false
  } catch (e: any) {
    toast.error(getErrorMessage(e, 'ساخت تسک ناموفق بود'))
  }
}

// ── User profile ──────────────────────────────────────────────────────
const showUserProfileDialog = ref(false)
const viewedProfile = ref<UserProfile | null>(null)
async function openUserProfile(userId: number): Promise<void> {
  const profile = await fetchUserProfile(userId)
  if (profile) { viewedProfile.value = profile; showUserProfileDialog.value = true }
}

// ── Search / pinned ───────────────────────────────────────────────────
const showSearch = ref(false)
const searchQuery = ref('')
const showPinnedDialog = ref(false)

// ── Group info panel / members ────────────────────────────────────────
const showGroupInfoPanel = ref(false)
async function saveGroupInfo(form: { name: string; description: string }): Promise<void> {
  if (!activeGroupId.value || !isGroupAdmin.value || !activeGroup.value) return
  if (form.name === activeGroup.value.name && form.description === (activeGroup.value.description || '')) return
  await apiUpdateGroup(activeGroupId.value, { name: form.name.trim() || activeGroup.value.name, description: form.description.trim() })
}
async function handleActiveGroupAvatarSelect(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !activeGroupId.value) return
  await apiUploadGroupAvatar(activeGroupId.value, file)
}

const showAddMemberDialog = ref(false)
const memberSearchResults = ref<{ id: number; name: string; username: string; avatarUrl: string | null }[]>([])

const memberSearchQuery = ref('')
async function handleMemberSearch(query: string): Promise<void> {
  memberSearchQuery.value = query
  if (query.trim().length < 2) {
    memberSearchResults.value = []
    return
  }
  memberSearchResults.value = await searchUsers(query)
}

const addingMemberId = ref<number | null>(null)
async function handleAddMember(userId: number): Promise<void> {
  if (!activeGroupId.value || addingMemberId.value) return
  addingMemberId.value = userId
  try {
    const ok = await apiInviteMember(activeGroupId.value, userId)
    if (ok) closeAddMemberDialog()
  } finally { addingMemberId.value = null }
}
function closeAddMemberDialog(): void { showAddMemberDialog.value = false; memberSearchQuery.value = ''; memberSearchResults.value = [] }

function confirmDeleteGroup(): void {
  if (!activeGroup.value) return
  openConfirm({
    title: 'حذف گروه', message: `مطمئنی می‌خوای گروه «${activeGroup.value.name}» رو کامل حذف کنی؟ این کار غیرقابل بازگشته.`, confirmLabel: 'حذف گروه', danger: true,
    onConfirm: async () => {
      const id = activeGroupId.value!
      if (await apiDeleteGroup(id)) {
        const next = apiGroups.value.find(g => g.id !== id)
        activeGroupId.value = next ? next.id : null
        if (activeGroupId.value) await selectGroup(activeGroupId.value)
      }
    },
  })
}
function confirmRoleChange(m: GroupMember): void {
  const makeAdmin = m.role !== 'admin'
  openConfirm({ title: makeAdmin ? 'ارتقا به مدیر' : 'تنزل به عضو عادی', message: `${m.name} ${makeAdmin ? 'مدیر گروه بشه' : 'از مدیریت خارج بشه'}؟`, confirmLabel: 'تأیید', onConfirm: () => apiUpdateMemberRole(activeGroupId.value!, m.userId, makeAdmin ? 'admin' : 'member') })
}
function confirmRemoveMember(m: GroupMember): void {
  openConfirm({ title: 'حذف عضو', message: `${m.name} از گروه حذف بشه؟`, confirmLabel: 'حذف', danger: true, onConfirm: () => apiRemoveMember(activeGroupId.value!, m.userId) })
}
function confirmLeaveGroup(): void {
  if (!activeGroup.value) return
  openConfirm({
    title: 'ترک گروه', message: `مطمئنی می‌خوای گروه «${activeGroup.value.name}» رو ترک کنی؟`, confirmLabel: 'ترک گروه', danger: true,
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

// ── Sidebar layout state ─────────────────────────────────────────────
const sidebarCollapsed = ref(false)
const mobilePane = ref<'sidebar' | 'main'>('sidebar')

// ── Scroll handling ────────────────────────────────────────────────────
function handleScroll(): void {
  chatScroll.onScroll(dateDivider.update)
  if (activeMenuId.value) activeMenuId.value = null
}

// ── Lifecycle ───────────────────────────────────────────────────────────
onMounted(() => {
  fetchGroups()
  setChatContext(null, currentUser.value.id)
})
onUnmounted(() => { chatEcho.unsubscribe() })

watch(messages, (newMessages) => {
  const isNewMessage = newMessages.length > previousMessageCount
  previousMessageCount = newMessages.length

  if (isNearBottom.value) {
    scrollToBottom()
    const last = [...newMessages].reverse().find(m => m.status !== 'pending')
    if (last && activeGroupId.value) apiMarkRead(activeGroupId.value, last.id)
  } else if (isNewMessage) {
    const lastMsg = newMessages[newMessages.length - 1]
    if (lastMsg && lastMsg.senderId !== currentUser.value.id) unreadCount.value++
  }
  nextTick(dateDivider.update)
}, { deep: true })

</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>