import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(Toast, {
        position: "bottom-right",
        pauseOnHover: true,
        closeOnClick: false,
        showCloseButtonOnHover: true,
        pauseOnFocusLoss: false,
        rtl: true
    })
})