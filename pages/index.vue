<template>
  <div class="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div class="h-20 max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <a href="#" class="flex items-center gap-2 group">
            <div class="w-9 h-9 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <Icon icon="material-symbols:check-box" class="text-[20px]" />
            </div>
            <span class="text-lg font-semibold tracking-tight">تودولیست من</span>
          </a>
          <nav class="hidden lg:flex items-center gap-4">
            <a href="#features" class="text-[15px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-1 py-1">ویژگی‌ها</a>
            <a href="#collaboration" class="text-[15px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-1 py-1">همکاری تیمی</a>
            <a href="#philosophy" class="text-[15px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-1 py-1">درباره ما</a>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <!-- Dark / Light Mode Switcher -->
          <button
              @click="toggleTheme"
              class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :title="isDark ? 'حالت روشن' : 'حالت تاریک'"
          >
            <Icon :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="text-[20px]" />
          </button>

          <!-- فقط دکمه ورود -->
          <a
              href="/auth/login"
              class="text-[13px] font-medium bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl transition-colors shadow-sm"
          >
            ورود
          </a>
        </div>
      </div>
    </header>

    <main class="w-full pt-20">
      <!-- Hero -->
      <section class="w-full max-w-7xl mx-auto px-5 lg:px-8 pt-12 pb-24 text-center">
        <div class="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 px-4 py-1.5 rounded-full mb-6 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-primary-600"></span>
          <span class="text-[13px] font-semibold tracking-wider text-primary-600">یک فضای کاری هوشمند برای افراد و تیم‌ها</span>
        </div>

        <h1 class="text-[42px] lg:text-[68px] leading-[1.15] lg:leading-[1.08] font-semibold tracking-tight max-w-4xl mx-auto mb-4">
          با هم فکر کنید.<br class="hidden sm:inline" />
          <span class="text-primary-600">هوشمندانه‌تر</span> کار کنید.
        </h1>

        <p class="text-lg leading-relaxed text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          فضایی هوشمند برای گفتگو، همکاری و مدیریت کارها؛ همه در یک محیط یکپارچه، بدون سروصدا و پر از آرامش ذهنی.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 mb-20">
          <a href="/auth/login" class="text-[13px] font-medium bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl transition-all shadow-sm flex items-center gap-2">
            <span>شروع کنید</span>
            <Icon icon="material-symbols:arrow-back" class="text-[18px]" />
          </a>
          <a href="#principles" class="text-[13px] font-medium bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 px-8 py-3.5 rounded-xl transition-colors shadow-sm border border-gray-200 dark:border-gray-700">
            مشاهده فلسفه و امکانات
          </a>
        </div>

        <!-- App Mockup -->
        <div class="w-full text-right bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <!-- Top bar -->
          <div class="bg-gray-50 dark:bg-gray-800 px-6 py-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              <span class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              <span class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            </div>
            <div class="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-1 rounded-lg shadow-sm">
              <Icon icon="material-symbols:folder-open" class="text-gray-500 text-[16px]" />
              <span class="text-xs text-gray-500 dark:text-gray-400">فضای کاری تیم محصول / بازطراحی زمستان</span>
            </div>
            <div>
              <span class="text-xs text-primary-600 bg-primary-100 dark:bg-primary-900/40 px-2 py-0.5 rounded-md">آنلاین • ۳ همکار</span>
            </div>
          </div>

          <!-- Interior -->
          <div class="grid grid-cols-12 min-h-[580px]">
            <!-- Icon rail -->
            <div class="col-span-1 hidden lg:flex flex-col items-center justify-between py-6 bg-white dark:bg-gray-900">
              <div class="flex flex-col items-center gap-6">
                <div class="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-sm">
                  <Icon icon="material-symbols:check-box" class="text-[20px]" />
                </div>
                <div class="flex flex-col gap-4 text-gray-500 dark:text-gray-400">
                  <button class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600 bg-gray-100 dark:bg-gray-800">
                    <Icon icon="material-symbols:grid-view" class="text-[20px]" />
                  </button>
                  <button class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Icon icon="material-symbols:forum" class="text-[20px]" />
                  </button>
                  <button class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Icon icon="material-symbols:group" class="text-[20px]" />
                  </button>
                  <button class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Icon icon="material-symbols:auto-awesome" class="text-[20px]" />
                  </button>
                </div>
              </div>
              <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs">س‌م</div>
            </div>

            <!-- Task board -->
            <div class="col-span-12 md:col-span-6 lg:col-span-4 p-6 bg-white dark:bg-gray-900 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between pb-4 mb-4">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-semibold">کارهای امروز</span>
                    <span class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400">۳ تسک باز</span>
                  </div>
                  <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <button class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><Icon icon="material-symbols:filter-list" class="text-[18px]" /></button>
                    <button class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><Icon icon="material-symbols:sort" class="text-[18px]" /></button>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <!-- Done -->
                  <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div class="flex items-start justify-between gap-2 mb-1.5">
                      <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded-md bg-primary-600 text-white flex items-center justify-center">
                          <Icon icon="material-symbols:check" class="text-[12px]" />
                        </span>
                        <span class="text-[15px] text-gray-900 dark:text-gray-100 line-through opacity-50">بررسی ساختار پایگاه‌داده</span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">انجام شد</span>
                    </div>
                  </div>

                  <!-- Active -->
                  <div class="p-2 rounded-xl bg-white dark:bg-gray-900 shadow-sm ring-1 ring-primary-200 dark:ring-primary-800">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded-md bg-gray-200 dark:bg-gray-700"></span>
                        <span class="text-[15px] font-medium">طراحی تعاملی صفحه لندینگ</span>
                      </div>
                      <span class="text-xs px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">فوری</span>
                    </div>
                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 pt-2">
                      <span class="text-xs flex items-center gap-1">
                        <Icon icon="material-symbols:event" class="text-[14px]" /> پنجشنبه، ۱۴:۰۰
                      </span>
                      <div class="flex -space-x-1 space-x-reverse">
                        <span class="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center font-bold">س</span>
                        <span class="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] flex items-center justify-center">ع</span>
                      </div>
                    </div>
                  </div>

                  <!-- Normal -->
                  <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded-md bg-gray-200 dark:bg-gray-700"></span>
                        <span class="text-[15px]">هماهنگی نهایی با تیم زیرساخت</span>
                      </div>
                      <span class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">عادی</span>
                    </div>
                    <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 pt-2">
                      <span class="text-xs flex items-center gap-1">
                        <Icon icon="material-symbols:chat-bubble-outline" class="text-[14px]" /> ۲ یادداشت
                      </span>
                      <span class="text-xs">فردا صبح</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4">
                <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl">
                  <Icon icon="material-symbols:add" class="text-gray-500 dark:text-gray-400 text-[20px]" />
                  <input
                      class="bg-transparent text-[15px] w-full outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="افزودن تسک جدید با هوشمندی..."
                      type="text"
                  />
                  <span class="text-xs bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 px-2 py-1 rounded shadow-sm">Enter ↵</span>
                </div>
              </div>
            </div>

            <!-- Chat panel -->
            <div class="col-span-12 md:col-span-6 lg:col-span-7 p-6 flex flex-col justify-between bg-gray-50 dark:bg-gray-800/50">
              <div>
                <div class="flex items-center justify-between pb-4 mb-6">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-primary-600 animate-pulse"></span>
                    <span class="text-lg font-semibold">گفتگوی متصل • بازطراحی لندینگ</span>
                  </div>
                  <button class="text-xs bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Icon icon="material-symbols:link" class="text-[14px]" /> تسک مرتبط #۱۰۴
                  </button>
                </div>

                <div class="flex flex-col gap-4">
                  <!-- Message 1 -->
                  <div class="flex items-start gap-2">
                    <div class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">سارا</div>
                    <div class="flex flex-col gap-1 max-w-lg">
                      <div class="flex items-center gap-2">
                        <span class="text-[13px] font-semibold">سارا میرزایی</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">۱۰:۱۴</span>
                      </div>
                      <div class="bg-white dark:bg-gray-900 p-2 rounded-xl text-[15px]">
                        آیا زمان‌بندی انتشار نسخه بتا را به پنجشنبه منتقل کنیم تا تیم تست بتواند بخش چندکاربری را کامل بسنجد؟
                      </div>
                    </div>
                  </div>

                  <!-- Message 2 -->
                  <div class="flex items-start gap-2">
                    <div class="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold text-[11px] shrink-0">علی</div>
                    <div class="flex flex-col gap-1 max-w-lg">
                      <div class="flex items-center gap-2">
                        <span class="text-[13px] font-semibold">علی رحیمی</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">۱۰:۱۶</span>
                      </div>
                      <div class="bg-white dark:bg-gray-900 p-2 rounded-xl text-[15px]">
                        کاملاً موافقم. هماهنگی با تیم مستندات هم نهایی شده.
                      </div>
                    </div>
                  </div>

                  <!-- AI Summary -->
                  <div class="my-1 p-4 rounded-xl bg-white dark:bg-gray-900">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2 text-primary-600">
                        <Icon icon="material-symbols:auto-awesome" class="text-[18px]" />
                        <span class="text-[13px] font-semibold">خلاصه هوشمند گفتگو و استخراج تصمیم</span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">پاسخ بر اساس گفتگوی تیم</span>
                    </div>
                    <p class="text-[15px] mb-3 leading-relaxed">
                      تیم به توافق رسید: تاریخ انتشار بتا به <strong>پنجشنبه ساعت ۱۷:۰۰</strong> منتقل شد. ۲ اقدام عملیاتی ایجاد گردید.
                    </p>
                    <div class="flex items-center gap-2">
                      <button class="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <Icon icon="material-symbols:done-all" class="text-[14px]" /> اعمال در تقویم تسک‌ها
                      </button>
                      <button class="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-lg">صرف‌نظر</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4">
                <div class="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-xl">
                  <input
                      class="bg-transparent text-[15px] w-full outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="پاسخ دهید یا @تسک اضافه کنید..."
                      type="text"
                  />
                  <button class="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                    <Icon icon="material-symbols:send" class="text-[16px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Principles -->
      <section id="principles" class="w-full bg-gray-50 dark:bg-gray-900 py-20">
        <div class="max-w-7xl mx-auto px-5 lg:px-8">
          <div class="text-center max-w-xl mx-auto mb-16">
            <span class="text-[13px] font-semibold tracking-wider text-primary-600">اصول بنیادین</span>
            <h2 class="text-[32px] lg:text-[44px] font-semibold mt-2">ساخته‌شده برای تمرکز و کار عمیق</h2>
            <p class="text-[15px] text-gray-500 dark:text-gray-400 mt-2">
              ما هیچ عدد ساختگی، اعلان بیهوده یا جلوه بصری اضافی نداریم؛ تنها ارزش واقعی برای تفکر متمرکز.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(p, i) in principles" :key="i" class="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-transparent dark:border-gray-800">
              <div>
                <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary-600 mb-4">
                  <Icon :icon="p.icon" class="text-[22px]" />
                </div>
                <h3 class="text-lg font-semibold mb-2">{{ p.title }}</h3>
                <p class="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">{{ p.desc }}</p>
              </div>
              <div class="mt-6 pt-2 text-xs text-primary-600 flex items-center gap-1">
                <span>{{ p.footer }}</span>
                <Icon :icon="p.footerIcon" class="text-[14px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Core Values / Features -->
      <section id="features" class="w-full max-w-7xl mx-auto px-5 lg:px-8 py-28">
        <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span class="text-[13px] font-semibold tracking-wider text-primary-600">معماری ارزشی</span>
            <h2 class="text-[32px] lg:text-[44px] font-semibold mt-2">نظمی جدید برای جریان کاری روزمره</h2>
          </div>
          <p class="text-[15px] text-gray-500 dark:text-gray-400 max-w-md">
            هر بخش با وسواس معماری شده است تا تماس چشمی شما با محتوا بدون اصطکاک و وقفه باشد.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(v, i) in values" :key="i" class="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm relative overflow-hidden group border border-transparent dark:border-gray-800">
            <div class="flex items-baseline justify-between mb-4">
              <span class="text-4xl font-bold text-gray-200 dark:text-gray-700 group-hover:text-primary-600 transition-colors">{{ v.num }}</span>
              <span class="text-[13px] font-medium text-primary-600">{{ v.label }}</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ v.title }}</h3>
            <p class="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">{{ v.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Collaboration -->
      <section id="collaboration" class="w-full bg-gray-50 dark:bg-gray-900 py-28">
        <div class="max-w-7xl mx-auto px-5 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 text-right">
              <span class="text-[13px] font-semibold tracking-wider text-primary-600">ارتباط پیوسته</span>
              <h2 class="text-[32px] lg:text-[44px] font-semibold mt-2 mb-4 leading-tight">
                با هم کار کنید، بدون اینکه زمینه کار را از دست بدهید.
              </h2>
              <p class="text-lg text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                تغییر مداوم ابزارها (Context Switching) بزرگترین دزد تمرکز در تیم‌های کاری است. در تودولیست من، گفت‌وگو دقیقاً در همان صفحه‌ای رخ می‌دهد که تسک و پیشرفت آن نفس می‌کشد.
              </p>
              <div class="flex flex-col gap-2 mb-6">
                <div v-for="(item, i) in collabPoints" :key="i" class="flex items-start gap-2">
                  <Icon icon="material-symbols:check-circle" class="text-primary-600 text-[20px] mt-0.5" />
                  <span class="text-[15px]">{{ item }}</span>
                </div>
              </div>
            </div>

            <div class="lg:col-span-7">
              <div class="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-md border border-transparent dark:border-gray-800">
                <div class="flex items-center justify-between pb-4 mb-4">
                  <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold">ت</span>
                    <div>
                      <h4 class="text-lg font-semibold">تیم توسعه محصول</h4>
                      <span class="text-xs text-gray-500 dark:text-gray-400">۸ عضو فعال • ۳ گفتگوی در جریان</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-primary-600"></span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">سینک آنی</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex flex-col justify-between">
                    <div class="flex flex-col gap-2 mb-4">
                      <div class="text-[12px] text-gray-500 dark:text-gray-400 text-center mb-1">امروز - ۱۱:۳۰</div>
                      <div class="bg-white dark:bg-gray-950 p-1.5 px-2 rounded-lg text-[15px]">
                        <span class="font-semibold text-primary-600 block text-xs">سارا:</span>
                        تسک نهایی‌سازی دیزاین سیستم با موفقیت ثبت شد.
                      </div>
                      <div class="bg-primary-600 text-white p-1.5 px-2 rounded-lg text-[15px] self-start max-w-[85%]">
                        عالیه، الان تسک رو به علی ارجاع میدم تا مرور کنه.
                      </div>
                    </div>
                    <div class="bg-white dark:bg-gray-950 px-2 py-1.5 rounded-lg flex items-center justify-between shadow-sm">
                      <span class="text-xs text-gray-500 dark:text-gray-400">نوشتن یادداشت برای تیم...</span>
                      <Icon icon="material-symbols:send" class="text-[16px] text-primary-600" />
                    </div>
                  </div>

                  <div class="bg-white dark:bg-gray-950 p-4 rounded-xl shadow-sm flex flex-col justify-between border border-transparent dark:border-gray-800">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded font-medium">تسک متصل</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">مهلت: فردا</span>
                      </div>
                      <h4 class="text-[15px] font-semibold mb-1">بازبینی تعاملات و فیدبک‌ها</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
                        بررسی پاسخ سرور در حالات قطعی اینترنت و پیام‌های راهنما.
                      </p>
                      <div class="flex items-center justify-between pt-1">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center font-bold">ع</div>
                          <span class="text-xs">مسئول: علی رضایی</span>
                        </div>
                        <span class="text-xs text-primary-600 font-medium">در حال انجام</span>
                      </div>
                    </div>
                    <div class="mt-4 pt-1">
                      <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                        <div class="bg-primary-600 h-1.5 rounded-full" style="width: 70%"></div>
                      </div>
                      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>پیشرفت</span>
                        <span>۷۰٪</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Philosophy -->
      <section id="philosophy" class="w-full bg-gray-100/60 dark:bg-gray-900/60 py-32 text-center">
        <div class="max-w-4xl mx-auto px-5 lg:px-8">
          <span class="text-[13px] font-semibold tracking-wider text-primary-600">فلسفه سکوت</span>
          <h2 class="text-[42px] lg:text-[44px] font-bold mt-3 mb-6 tracking-tight">
            سروصدای کمتر.<br />تمرکز عمیق‌تر.
          </h2>
          <div class="w-12 h-1 bg-primary-600 mx-auto mb-8 rounded-full"></div>
          <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-loose">
            کار واقعی شما نباید در میان ده‌ها تب باز، پیام‌های فوری غیرضروری، نوتیفیکیشن‌های زرد و آیکون‌های چشمک‌زن ناپدید شود. ما اعتقاد داریم نرم‌افزار باید مانند یک کاغذ تمیز و باکیفیت، خادم افکار شما باشد نه رباینده حواس.
          </p>
        </div>
      </section>

      <!-- Features alternating -->
      <section class="w-full max-w-7xl mx-auto px-5 lg:px-8 py-28">
        <div class="flex flex-col gap-24">
          <!-- Feature 1 -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 order-2 lg:order-1 text-right">
              <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary-600 mb-2">
                <Icon icon="material-symbols:chat" class="text-[20px]" />
              </div>
              <span class="text-[13px] font-semibold tracking-wider text-primary-600">گفتگوی بی‌درنگ</span>
              <h3 class="text-xl font-semibold mt-1 mb-2">گفتگوهای متصل به کار</h3>
              <p class="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                هر پیامی می‌تواند منشأ یک خروجی واقعی باشد. با ایجاد زنجیره مکالمه ذیل هر تسک، تاریخچه تصمیم‌گیری‌ها برای همیشه شفاف می‌ماند.
              </p>
              <ul class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>پشتیبانی کامل از پیام‌های صوتی، تصاویر و اسناد</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>تایپ همزمان و نمایش زنده ویرایش‌ها</span>
                </li>
              </ul>
            </div>
            <div class="lg:col-span-7 order-1 lg:order-2">
              <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div class="bg-gray-50 dark:bg-gray-950 rounded-xl p-4 space-y-3">
                  <div class="flex items-center justify-between pb-2">
                    <span class="text-[13px] font-semibold">چت گروهی: بازنگری محصول</span>
                    <span class="text-xs text-primary-600">فعال</span>
                  </div>
                  <div class="bg-white dark:bg-gray-900 p-2 rounded-lg flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-gray-500 text-white text-[11px] flex items-center justify-center font-bold">م</span>
                      <span class="text-[15px]">فایل‌های گرافیکی نسخه موبایل بارگذاری شد.</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">۱۰:۳۲</span>
                  </div>
                  <div class="bg-white dark:bg-gray-900 p-2 rounded-lg flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-primary-600 text-white text-[11px] flex items-center justify-center font-bold">س</span>
                      <span class="text-[15px]">عالی، وظیفه بررسی به مهندس ناظر ارجاع شد.</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">۱۰:۳۴</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7">
              <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-950">
                    <span class="text-lg font-bold text-primary-600 block mb-1">۱۲</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">تسک‌های جاری</span>
                  </div>
                  <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-950">
                    <span class="text-lg font-bold block mb-1">۹۸٪</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">انجام به‌موقع</span>
                  </div>
                  <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-950">
                    <span class="text-lg font-bold block mb-1">۴</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">پروژه فعال</span>
                  </div>
                </div>
                <div class="mt-4 p-2 bg-gray-50 dark:bg-gray-950 rounded-xl flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs">تیم</div>
                    <span class="text-[15px] font-medium">هماهنگی تقویم انتشار بهار</span>
                  </div>
                  <span class="text-xs bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded text-gray-500 dark:text-gray-400">در حال پردازش</span>
                </div>
              </div>
            </div>
            <div class="lg:col-span-5 text-right">
              <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary-600 mb-2">
                <Icon icon="material-symbols:hub" class="text-[20px]" />
              </div>
              <span class="text-[13px] font-semibold tracking-wider text-primary-600">مدیریت کلان</span>
              <h3 class="text-xl font-semibold mt-1 mb-2">هماهنگی بی‌درنگ تیم</h3>
              <p class="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                یک نگاه گذرا به پنل تیمی برای درک وضعیت کلی تمام اعضا کافی است؛ دیگر نیازی به برگزاری جلسات استندآپ طولانی و فرساینده نیست.
              </p>
              <ul class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>مشاهده پیشرفت فاز به فاز پروژه‌ها</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>تعیین دسترسی‌های سفارشی برای اعضا یا مهمانان بیرونی</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 order-2 lg:order-1 text-right">
              <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary-600 mb-2">
                <Icon icon="material-symbols:person" class="text-[20px]" />
              </div>
              <span class="text-[13px] font-semibold tracking-wider text-primary-600">حریم خصوصی شخصی</span>
              <h3 class="text-xl font-semibold mt-1 mb-2">فضای کاری فردی، آرام و خلوت</h3>
              <p class="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                علاوه بر تسک‌های گروهی، یادداشت‌ها و کارهای شخصی خود را در مکانی کاملاً مجزا بنویسید که تنها خودتان به آن دسترسی دارید.
              </p>
              <ul class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>دسته‌بندی تسک‌ها با ماتریس اهمیت و فوریت</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>حالت کار عمیق (Focus Mode) بدون هیچ اعلان ورودی</span>
                </li>
              </ul>
            </div>
            <div class="lg:col-span-7 order-1 lg:order-2">
              <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div class="flex items-center justify-between pb-2 mb-2">
                  <span class="text-lg font-semibold">کارهای شخصی من</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">حالت تمرکز عمیق فعال است</span>
                </div>
                <div class="space-y-2">
                  <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-950 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-4 h-4 rounded-md bg-primary-600 text-white flex items-center justify-center">
                        <Icon icon="material-symbols:check" class="text-[12px]" />
                      </span>
                      <span class="text-[15px] line-through opacity-60">مطالعه گزارش فصلی</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">انجام شد</span>
                  </div>
                  <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-950 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-4 h-4 rounded-md bg-gray-200 dark:bg-gray-700"></span>
                      <span class="text-[15px]">نگارش یادداشت وبلاگ محصول</span>
                    </div>
                    <span class="text-xs text-primary-600">الویت اول</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="w-full bg-[#111311] text-white py-28 relative overflow-hidden">
        <div class="max-w-4xl mx-auto px-5 lg:px-8 text-center relative z-10">
          <div class="inline-flex items-center gap-2 bg-[#1c1b1b] px-3.5 py-1.5 rounded-full mb-6">
            <span class="w-2 h-2 rounded-full bg-primary-500"></span>
            <span class="text-[13px] font-semibold tracking-wider text-primary-300">آغاز کار با تودولیست من</span>
          </div>
          <h2 class="text-[32px] lg:text-[44px] font-bold text-white mb-4 tracking-tight">
            جایی بهتر برای کار کردن با هم.
          </h2>
          <p class="text-lg text-[#A7AAA5] max-w-xl mx-auto mb-10 leading-relaxed">
            فضایی آرام، یکپارچه و هوشمند برای تمام ارتباطات و وظایف تیم شما. بدون اشتراک‌های پیچیده یا تنظیمات گیج‌کننده.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="/auth/login" class="text-[13px] font-medium bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl transition-all shadow-sm">
              فضای کاری خود را بسازید
            </a>
            <a href="#principles" class="text-[13px] font-medium bg-transparent hover:bg-white/10 text-white px-8 py-3.5 rounded-xl transition-colors">
              مشاهده محصول
            </a>
          </div>
          <div class="mt-12 flex items-center justify-center gap-6 text-[#A7AAA5] text-xs">
            <span class="flex items-center gap-1.5">
              <Icon icon="material-symbols:check" class="text-[16px] text-primary-400" /> بدون نیاز به کارت بانکی
            </span>
            <span class="flex items-center gap-1.5">
              <Icon icon="material-symbols:check" class="text-[16px] text-primary-400" /> راه‌اندازی زیر ۱ دقیقه
            </span>
            <span class="flex items-center gap-1.5">
              <Icon icon="material-symbols:check" class="text-[16px] text-primary-400" /> پشتیبانی کامل از زبان فارسی
            </span>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 mt-10">
      <div class="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <!-- ستون لوگو + توضیح + شبکه‌های اجتماعی -->
          <div class="lg:col-span-1">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                <Icon icon="material-symbols:check-box" class="text-[18px]" />
              </div>
              <span class="text-lg font-semibold">تودولیست</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5 max-w-xs">
              ابزاری ساده و سریع برای مدیریت کارهای روزانه، پروژه‌های تیمی و برنامه‌های شخصی.
            </p>
            <div class="flex items-center gap-3">
              <a
                  v-for="s in socialLinks"
                  :key="s.label"
                  :href="s.href"
                  :title="s.label"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Icon :icon="s.icon" class="text-[18px]" />
              </a>
            </div>
          </div>

          <!-- صفحه های مهم -->
          <div class="flex flex-col gap-2.5">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">صفحه‌های مهم</h4>
            <NuxtLink
                v-for="link in siteLinks"
                :key="link.to"
                :to="link.to"
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <!-- حساب کاربری -->
          <div class="flex flex-col gap-2.5">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">حساب کاربری</h4>
            <NuxtLink to="/auth/login" class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              ورود
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              ثبت‌نام
            </NuxtLink>
            <NuxtLink to="/settings" class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              تنظیمات پروفایل
            </NuxtLink>
          </div>

          <!-- یه پیام برام بذار -->
          <div class="flex flex-col">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">یه پیام برام بذار</h4>
            <div class="border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col items-center text-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                برای ارسال پیام اول باید وارد حسابت بشی.
              </p>
              <NuxtLink
                  to="/login"
                  class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                ورود / ثبت‌نام
                <Icon icon="material-symbols:arrow-back" class="text-[16px]" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- خط جداکننده + کپی‌رایت -->
        <div class="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
          <NuxtLink to="/aboutMe" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            درباره‌ی این پروژه
          </NuxtLink>
          <p>© ۲۰۲۶ تودولیست. همه‌ی حقوق محفوظه.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

// Dark / Light Mode
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

// Social & Site Links
const socialLinks = [
  { label: 'GitHub', href: '#', icon: 'mdi:github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saleh-rezaei-1985b5415/', icon: 'mdi:linkedin' },
  { label: 'Gmail', href: 'mailto:salehrezaeipoor123@gmail.com', icon: 'tabler:brand-gmail' },
  { label: 'Reddit', href: '#', icon: 'ic:outline-reddit' },
]

const siteLinks = [
  { label: 'تودولیست من', to: '/mainTodo' },
  { label: 'کار تیمی', to: '/workPlan' },
  { label: 'تودولیست شخصی', to: '/customTodo' },
  { label: 'درباره‌ی پروژه', to: '/aboutMe' },
]

const principles = [
  {
    icon: 'material-symbols:shield',
    title: 'طراحی‌شده با حفظ حریم شخصی',
    desc: 'اطلاعات، گفتگوها و کارهای شما کاملاً خصوصی هستند و هیچ‌گاه برای آموزش مدل‌های شخص ثالث فروخته یا مصرف نمی‌شوند.',
    footer: 'رمزنگاری استاندارد',
    footerIcon: 'material-symbols:lock'
  },
  {
    icon: 'material-symbols:groups',
    title: 'ساخته‌شده برای تیم‌های واقعی',
    desc: 'ارتباطات روان بدون گم شدن در صدها پیام نامرتبط. هر گفت‌وگو دقیقاً در کنار کاری که باید انجام شود قرار می‌گیرد.',
    footer: 'همکاری همزمان بدون حاشیه',
    footerIcon: 'material-symbols:arrow-back'
  },
  {
    icon: 'material-symbols:psychology-alt',
    title: 'هوشمند در زمان مناسب',
    desc: 'دستیار هوش مصنوعی بدون تبلیغ و هیاهو، فقط زمانی که تصمیم به خلاصه‌سازی یا نظم‌دهی دارید وارد عمل می‌شود.',
    footer: 'پاسخ‌دهی دقیق در متن کار',
    footerIcon: 'material-symbols:bolt'
  },
  {
    icon: 'material-symbols:layers',
    title: 'یک فضای کاری یکپارچه',
    desc: 'دیگر نیازی به باز کردن ۵ نرم‌افزار مجزا برای تسک، چت، فایل و تقویم نیست؛ تمام جریان کاری در یک بستر آرام جریان دارد.',
    footer: 'پایداری و سرعت بالا',
    footerIcon: 'material-symbols:speed'
  }
]

const values = [
  {
    num: '۰۱',
    label: 'همکاری تیمی',
    title: 'کار گروهی بدون از دست رفتن کانتکست',
    desc: 'وقتی اعضای تیم درباره یک تسک یا پروژه صحبت می‌کنند، تمام ارجاعات و فایل‌ها در همان قاب ذخیره می‌شوند؛ بدون نیاز به سوئیچ مدام میان تب‌های مرورگر.'
  },
  {
    num: '۰۲',
    label: 'گفتگوی پیوسته',
    title: 'گفتگوهای متصل به وظایف و اقدامات',
    desc: 'گفت‌وگوها دیگر در اعماق پیام‌رسان‌ها گم نمی‌شوند. هر تصمیم مستقیماً به یک وظیفه مشخص با صاحب اختیار و مهلت تحویل پیوند می‌خورد.'
  },
  {
    num: '۰۳',
    label: 'همراهی هوش مصنوعی',
    title: 'یاری هوشمند در جایی که ارزش واقعی دارد',
    desc: 'خلاصه‌سازی جلسات طولانی، تشخیص خودکار کارهای معوق، و نگارش پیش‌نویس پاسخ‌ها با درک کامل از اسناد پیشین پروژه شما.'
  },
  {
    num: '۰۴',
    label: 'سازمان‌یافتگی کامل',
    title: 'پیوند پرونده‌ها، تصمیم‌ها و کارها در یک افق',
    desc: 'سیستم فیلترسازی و برچسب‌گذاری آرام اجازه می‌دهد تسک‌های فردی و تیمی در نماهای دلخواه (کانبان، لیست یا تقویم) بازنمایی شوند.'
  }
]

const collabPoints = [
  'تبدیل مستقیم هر پیام به تسک مشخص تنها با یک کلیک',
  'مشاهده وضعیت آنلاین اعضای تیم روی هر وظیفه به‌صورت زنده',
  'آرشیو خودکار تصمیمات بدون نیاز به نوشتن صورت‌جلسات ملال‌آور'
]
</script>