import { defineNuxtPlugin } from '#app'

// این پلاگین فقط سمت کلاینت اجرا می‌شه (تم/حالت تاریک چیزی نیست که سرور
// بدونه چون تو localStorage خودِ مرورگره) و همون اول بارگذاری، قبل از هر
// چیز دیگه‌ای، data-theme و کلاس dark رو رو <html> ست می‌کنه تا فلش رنگ
// اشتباه کمتر دیده بشه.
export default defineNuxtPlugin(() => {
    const savedTheme = localStorage.getItem('app-theme')
    const theme = ['sky', 'emerald', 'orange', 'rose'].includes(savedTheme || '') ? savedTheme : 'sky'
    if (theme != null) {
        document.documentElement.setAttribute('data-theme', theme)
    }

    const savedDark = localStorage.getItem('app-dark-mode')
    const isDark = savedDark === 'true'
    document.documentElement.classList.toggle('dark', isDark)
})
