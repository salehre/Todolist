import { ref } from 'vue'

export function useVoiceRecorder(onReady: (blob: Blob, duration: number) => void) {
    const isRecording = ref(false)
    const recordingDuration = ref(0)
    const recordingProgress = ref(0)

    let mediaRecorder: MediaRecorder | null = null
    let audioChunks: Blob[] = []
    let recordingInterval: number | null = null

    async function startRecording(): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorder = new MediaRecorder(stream)
            audioChunks = []

            mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data)

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/webm' })
                onReady(blob, recordingDuration.value)
                stream.getTracks().forEach(track => track.stop())
                if (recordingInterval) clearInterval(recordingInterval)
                recordingDuration.value = 0
                recordingProgress.value = 0
                isRecording.value = false
            }

            mediaRecorder.start()
            isRecording.value = true
            recordingDuration.value = 0

            recordingInterval = window.setInterval(() => {
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
        if (mediaRecorder?.state === 'recording') mediaRecorder.stop()
        if (recordingInterval) clearInterval(recordingInterval)
    }

    function cancelRecording(): void {
        if (mediaRecorder?.state === 'recording') {
            mediaRecorder.onstop = () => {
                if (recordingInterval) clearInterval(recordingInterval)
                recordingDuration.value = 0
                recordingProgress.value = 0
                isRecording.value = false
            }
            mediaRecorder.stop()
        } else {
            isRecording.value = false
        }
    }

    return { isRecording, recordingDuration, recordingProgress, startRecording, stopRecording, cancelRecording }
}