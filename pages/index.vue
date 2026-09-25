<template>
  <div class="min-h-screen bg-primary-50 text-slate-800 transition-colors custom-scrollbar duration-300">
    <!-- Header -->
    <header class="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div class="max-w-7xl mx-auto h-16 px-4 lg:px-6 flex items-center justify-between rounded-2xl border border-primary-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center bg-primary-600 text-white">
              <Icon icon="mingcute:check-circle-fill" class="text-[20px]" />
            </div>
            <span class="text-lg font-semibold tracking-tight">تودولیست من</span>
          </NuxtLink>
          <nav class="hidden lg:flex items-center gap-4">
            <a href="#features" class="text-[15px] text-slate-500 hover:text-primary-700 transition-colors px-1 py-1">ویژگی‌ها</a>
            <a href="#collaboration" class="text-[15px] text-slate-500 hover:text-primary-700 transition-colors px-1 py-1">همکاری تیمی</a>
            <a href="#philosophy" class="text-[15px] text-slate-500 hover:text-primary-700 transition-colors px-1 py-1">درباره ما</a>
          </nav>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <button
              v-tooltip="'تغییر تم'"
              @click="toggleDark"
              class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <MorphIcon :icon="isDark ? heroMoon : heroSun" spring="smooth" class="text-lg" :size="18" />
          </button>

          <NuxtLink
              v-if="authState.isLoggedIn"
              to="/mainTodo"
              class="text-[13px] px-4 py-2"
              :class="btnPrimary"
          >
            <img
                v-if="authState.user?.avatar_url"
                :src="authState.user.avatar_url"
                alt="avatar"
                class="w-5 h-5 rounded-full object-cover"
            />
            <span v-else class="w-5 h-5 rounded-full bg-white/25 text-[11px] font-bold flex items-center justify-center">{{ userInitial }}</span>
            <span>ورود به برنامه</span>
          </NuxtLink>

          <template v-else>
            <NuxtLink to="/auth/login" class="hidden sm:inline-flex text-[13px] px-5 py-2" :class="btnGhost">
              ورود
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="text-[13px] px-5 py-2" :class="btnPrimary">
              ثبت‌نام
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <main class="w-full pt-24">
      <section class="w-full max-w-7xl mx-auto px-5 lg:px-8 pt-12 pb-24 text-center">
        <div class="inline-flex items-center gap-1.5 bg-white border border-primary-200/70 px-4 py-1.5 rounded-full mb-6 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-primary-600"></span>
          <span class="text-[13px] font-semibold tracking-wider text-primary-600">فضای کاری برای تسک‌های شخصی و تیمی</span>
        </div>

        <h1 class="text-[42px] lg:text-[68px] leading-[1.15] lg:leading-[1.08] font-semibold tracking-tight max-w-4xl mx-auto mb-4">
          با هم فکر کنید.<br class="hidden sm:inline" />
          <span class="text-primary-600">منظم‌تر</span> کار کنید.
        </h1>

        <p class="text-lg leading-relaxed text-slate-500 max-w-2xl mx-auto mb-10">
          تسک‌های شخصی، تسک‌های تیمی و گفتگوی گروهی در یک محیط یکپارچه؛ بدون سوئیچ بین چند برنامه‌ی جدا.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 mb-20">
          <NuxtLink :to="ctaTo" class="text-[13px] px-8 py-3.5" :class="btnPrimary">
            <span>{{ ctaLabel }}</span>
            <Icon icon="material-symbols:arrow-back" class="text-[18px]" />
          </NuxtLink>
          <a href="#principles" class="text-[13px] px-8 py-3.5" :class="btnGhost">
            مشاهده فلسفه و امکانات
          </a>
        </div>

        <div class="w-full text-start overflow-hidden" :class="card" style="box-shadow: 0 20px 50px -20px color-mix(in srgb, var(--t-500) 35%, transparent)">
          <div class="bg-primary-50/70 px-6 py-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-primary-200"></span>
              <span class="w-3 h-3 rounded-full bg-primary-200"></span>
              <span class="w-3 h-3 rounded-full bg-primary-200"></span>
            </div>
            <div class="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
              <Icon icon="mdi:account-group-outline" class="text-slate-500 text-[16px]" />
              <span class="text-xs text-slate-500">کار تیمی / بازطراحی زمستان</span>
            </div>
            <div>
              <span class="text-xs text-primary-700 bg-primary-100 px-2 py-0.5 rounded-md">۳ عضو آنلاین</span>
            </div>
          </div>

          <div class="grid grid-cols-12 min-h-[580px]">
            <div class="col-span-1 hidden lg:flex flex-col items-center justify-between py-6 bg-white">
              <div class="flex flex-col items-center gap-6">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-primary-600 text-white">
                  <Icon icon="mingcute:check-circle-fill" class="text-[20px]" />
                </div>
                <div class="flex flex-col gap-4 text-slate-500">
                  <NuxtLink
                      v-for="(r, i) in railLinks"
                      :key="r.to"
                      :to="r.to"
                      :title="r.label"
                      class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-primary-50 transition-colors"
                      :class="i === 0 ? 'text-primary-600 bg-primary-50' : ''"
                  >
                    <Icon :icon="r.icon" class="text-[20px]" />
                  </NuxtLink>
                </div>
              </div>
              <NuxtLink
                  :to="authState.isLoggedIn ? '/settings' : '/auth/login'"
                  class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs overflow-hidden"
              >
                <img v-if="authState.user?.avatar_url" :src="authState.user.avatar_url" alt="avatar" class="w-full h-full object-cover" />
                <span v-else>{{ userInitial || 'س‌م' }}</span>
              </NuxtLink>
            </div>

            <div class="col-span-12 md:col-span-6 lg:col-span-4 p-6 bg-white flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between pb-4 mb-4">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-semibold">کارهای امروز</span>
                    <span class="text-xs bg-primary-50 px-2 py-0.5 rounded-full text-slate-500">۳ تسک باز</span>
                  </div>
                  <div class="flex items-center gap-1 text-slate-500">
                    <button class="p-1 rounded hover:bg-primary-50"><Icon icon="mingcute:check-circle-line" class="text-[18px]" /></button>
                    <button class="p-1 rounded hover:bg-primary-50"><Icon icon="solar:sort-broken" class="text-[18px]" /></button>
                    <button class="p-1 rounded hover:bg-primary-50"><Icon icon="solar:flag-linear" class="text-[18px]" /></button>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="p-2.5 rounded-md border-s-4 border-slate-200 bg-primary-50/60">
                    <div class="flex items-start gap-2">
                      <input type="checkbox" checked disabled class="w-4 h-4 accent-primary-600 rounded mt-0.5" />
                      <span class="text-[14px] line-through opacity-50 flex-1">بررسی ساختار پایگاه‌داده</span>
                    </div>
                  </div>

                  <div class="p-2.5 rounded-md border-s-4 border-rose-400 bg-white shadow-sm">
                    <div class="flex items-start gap-2 mb-2">
                      <input type="checkbox" class="w-4 h-4 accent-primary-600 rounded mt-0.5" />
                      <div class="flex-1">
                        <div class="flex items-center justify-between">
                          <span class="text-[14px] font-medium">طراحی تعاملی صفحه لندینگ</span>
                          <span class="text-xs px-2 py-0.5 rounded" :class="badge">فوری</span>
                        </div>
                        <span class="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-600 mt-1.5">
                          <Icon icon="solar:users-group-rounded-linear" class="text-[10px]" />
                          تیم محصول
                        </span>
                        <div class="flex items-center gap-1 mt-2">
                          <div class="flex gap-0.5 flex-1">
                            <div class="h-1 flex-1 rounded-full bg-primary-500"></div>
                            <div class="h-1 flex-1 rounded-full bg-primary-500"></div>
                            <div class="h-1 flex-1 rounded-full bg-primary-200"></div>
                          </div>
                          <span class="text-[10px] text-slate-500 font-medium">۲/۳</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-end gap-1">
                      <button class="p-1.5 bg-primary-50 text-primary-700 rounded-full text-xs"><Icon icon="mi:edit" /></button>
                      <button class="p-1.5 bg-primary-50 text-primary-600 rounded-full text-xs"><Icon icon="mingcute:delete-line" /></button>
                    </div>
                  </div>

                  <div class="p-2.5 rounded-md border-s-4 border-primary-300 bg-primary-50/60">
                    <div class="flex items-start gap-2">
                      <input type="checkbox" class="w-4 h-4 accent-primary-600 rounded mt-0.5" />
                      <span class="text-[14px] flex-1">هماهنگی نهایی با تیم زیرساخت</span>
                      <span class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">عادی</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4">
                <div class="flex items-center gap-2 bg-primary-50/60 p-2 rounded-xl">
                  <Icon icon="mingcute:add-line" class="text-slate-500 text-[20px]" />
                  <input
                      class="bg-transparent text-[15px] w-full outline-none placeholder:text-slate-400"
                      placeholder="افزودن تسک جدید..."
                      type="text"
                      @keydown.enter="navigateTo(authState.isLoggedIn ? '/mainTodo' : '/auth/login')"
                  />
                  <span class="text-xs bg-white text-slate-500 px-2 py-1 rounded shadow-sm">Enter ↵</span>
                </div>
              </div>
            </div>

            <div class="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col justify-between bg-primary-50/50">
              <div>
                <div class="flex items-center justify-between px-6 pt-6 pb-4 mb-2">
                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm shrink-0">
                      <Icon icon="solar:users-group-rounded-bold" class="text-white text-lg" />
                    </div>
                    <div>
                      <span class="text-[14px] font-bold block">تیم محصول</span>
                      <span class="text-xs text-slate-500">۸ عضو • ۳ آنلاین</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 text-slate-500">
                    <button class="p-2 rounded-lg hover:bg-white/60"><Icon icon="solar:clipboard-list-linear" class="text-[18px]" /></button>
                    <button class="p-2 rounded-lg hover:bg-white/60"><Icon icon="boxicons:search" class="text-[18px]" /></button>
                    <button class="p-2 rounded-lg hover:bg-white/60"><Icon icon="mage:dots" class="text-[18px]" /></button>
                  </div>
                </div>

                <div class="flex flex-col gap-4 px-6">
                  <div class="flex items-start gap-2">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 bg-primary-600 text-white">سارا</div>
                    <div class="flex flex-col gap-1 max-w-lg">
                      <div class="flex items-center gap-2">
                        <span class="text-[13px] font-semibold">سارا میرزایی</span>
                        <span class="text-xs text-slate-500">۱۰:۱۴</span>
                      </div>
                      <div class="bg-white p-2 rounded-xl text-[15px]">
                        آیا زمان‌بندی انتشار نسخه بتا را به پنجشنبه منتقل کنیم؟
                      </div>
                    </div>
                  </div>

                  <div class="flex items-start gap-2">
                    <div class="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[11px] shrink-0">علی</div>
                    <div class="flex flex-col gap-1 max-w-lg">
                      <div class="flex items-center gap-2">
                        <span class="text-[13px] font-semibold">علی رحیمی</span>
                        <span class="text-xs text-slate-500">۱۰:۱۶</span>
                        <Icon icon="iconoir:pin" class="text-primary-500 -rotate-45 text-[11px]" />
                      </div>
                      <div class="bg-white p-2 rounded-xl text-[15px]">
                        کاملاً موافقم. هماهنگی با تیم مستندات هم نهایی شده.
                      </div>
                    </div>
                  </div>

                  <div class="my-1 p-3.5 rounded-xl bg-white border border-primary-200/70 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2 text-primary-600 min-w-0">
                      <Icon icon="mingcute:task-2-line" class="text-[18px] shrink-0" />
                      <span class="text-[13px] font-medium truncate">تسک «هماهنگی با تیم مستندات» از همین پیام ساخته شد</span>
                    </div>
                    <NuxtLink to="/workPlan" class="text-xs px-3 py-1.5 rounded-lg shrink-0" :class="btnPrimary">مشاهده</NuxtLink>
                  </div>
                </div>
              </div>

              <div class="p-4 pt-2">
                <div class="flex items-center gap-1 bg-white p-2 rounded-xl">
                  <button class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400"><Icon icon="lucide:paperclip" class="text-[16px]" /></button>
                  <input
                      class="bg-transparent text-[15px] w-full outline-none placeholder:text-slate-400"
                      placeholder="پیام بنویس یا با @ کسی رو منشن کن..."
                      type="text"
                      @keydown.enter="navigateTo(authState.isLoggedIn ? '/workPlan' : '/auth/login')"
                  />
                  <button class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400"><Icon icon="mdi:microphone" class="text-[18px]" /></button>
                  <NuxtLink
                      :to="authState.isLoggedIn ? '/workPlan' : '/auth/login'"
                      class="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-600 text-white"
                  >
                    <Icon icon="pepicons-pop:send" class="text-[16px]" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="principles" class="w-full bg-white/60 py-20 border-y border-primary-200/50">
        <div class="max-w-7xl mx-auto px-5 lg:px-8">
          <div class="text-center max-w-xl mx-auto mb-16">
            <span class="text-[13px] font-semibold tracking-wider text-primary-600">اصول بنیادین</span>
            <h2 class="text-[32px] lg:text-[44px] font-semibold mt-2">ساخته‌شده برای تمرکز و کار عمیق</h2>
            <p class="text-[15px] text-slate-500 mt-2">
              همون امکاناتی که واقعاً توی برنامه استفاده می‌کنی، نه یک ویترین تبلیغاتی.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(p, i) in principles" :key="i" class="p-6 flex flex-col justify-between transition-shadow hover:shadow-lg hover:shadow-primary-100" :class="card">
              <div>
                <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 mb-4">
                  <Icon :icon="p.icon" class="text-[22px]" />
                </div>
                <h3 class="text-lg font-semibold mb-2">{{ p.title }}</h3>
                <p class="text-[15px] text-slate-500 leading-relaxed">{{ p.desc }}</p>
              </div>
              <NuxtLink :to="p.to" class="mt-6 pt-2 text-xs text-primary-600 flex items-center gap-1">
                <span>{{ p.footer }}</span>
                <Icon icon="material-symbols:arrow-back" class="text-[14px]" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="w-full max-w-7xl mx-auto px-5 lg:px-8 py-28">
        <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span class="text-[13px] font-semibold tracking-wider text-primary-600">معماری ارزشی</span>
            <h2 class="text-[32px] lg:text-[44px] font-semibold mt-2">نظمی جدید برای جریان کاری روزمره</h2>
          </div>
          <p class="text-[15px] text-slate-500 max-w-md">
            هر بخش دقیقاً همون چیزیه که داخل برنامه استفاده می‌شه.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(v, i) in values" :key="i" class="p-6 relative overflow-hidden group" :class="card">
            <div class="flex items-baseline justify-between mb-4">
              <span class="text-4xl font-bold text-primary-200 group-hover:text-primary-600 transition-colors">{{ v.num }}</span>
              <span class="text-[13px] font-medium text-primary-600">{{ v.label }}</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ v.title }}</h3>
            <p class="text-[15px] text-slate-500 leading-relaxed">{{ v.desc }}</p>
          </div>
        </div>
      </section>

      <section id="collaboration" class="w-full bg-white/60 py-28 border-y border-primary-200/50">
        <div class="max-w-7xl mx-auto px-5 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 text-start">
              <span class="text-[13px] font-semibold tracking-wider text-primary-600">ارتباط پیوسته</span>
              <h2 class="text-[32px] lg:text-[44px] font-semibold mt-2 mb-4 leading-tight">
                با هم کار کنید، بدون اینکه زمینه کار را از دست بدهید.
              </h2>
              <p class="text-lg text-slate-500 mb-6 leading-relaxed">
                در تودولیست من، گفت‌وگوی گروهی درست کنار تسک‌های همون گروه قرار داره؛ هر پیام مهم می‌تونه مستقیماً به یک تسک تبدیل بشه.
              </p>
              <div class="flex flex-col gap-2 mb-6">
                <div v-for="(item, i) in collabPoints" :key="i" class="flex items-start gap-2">
                  <Icon icon="material-symbols:check-circle" class="text-primary-600 text-[20px] mt-0.5" />
                  <span class="text-[15px]">{{ item }}</span>
                </div>
              </div>
              <NuxtLink to="/workPlan" class="text-[13px] px-6 py-3" :class="btnPrimary">
                <span>رفتن به کار تیمی</span>
                <Icon icon="material-symbols:arrow-back" class="text-[18px]" />
              </NuxtLink>
            </div>

            <div class="lg:col-span-7">
              <div class="p-6 shadow-md" :class="card">
                <div class="flex items-center justify-between pb-4 mb-4">
                  <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold">ت</span>
                    <div>
                      <h4 class="text-lg font-semibold">تیم توسعه محصول</h4>
                      <span class="text-xs text-slate-500">۸ عضو فعال • ۳ گفتگوی در جریان</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-primary-600"></span>
                    <span class="text-xs text-slate-500">سینک آنی</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-primary-50/60 p-4 rounded-xl flex flex-col justify-between">
                    <div class="flex flex-col gap-2 mb-4">
                      <div class="text-[12px] text-slate-500 text-center mb-1">امروز - ۱۱:۳۰</div>
                      <div class="bg-white p-1.5 px-2 rounded-lg text-[15px]">
                        <span class="font-semibold text-primary-600 block text-xs">سارا:</span>
                        تسک نهایی‌سازی دیزاین سیستم با موفقیت ثبت شد.
                      </div>
                      <div class="p-1.5 px-2 rounded-lg text-[15px] self-start max-w-[85%] bg-primary-600 text-white">
                        عالیه، الان تسک رو به علی ارجاع میدم تا مرور کنه.
                      </div>
                    </div>
                    <div class="bg-white px-2 py-1.5 rounded-lg flex items-center justify-between shadow-sm">
                      <span class="text-xs text-slate-500">نوشتن یادداشت برای تیم...</span>
                      <Icon icon="pepicons-pop:send" class="text-[16px] text-primary-600" />
                    </div>
                  </div>

                  <div class="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between border border-primary-200/70">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs px-2 py-0.5 rounded font-medium" :class="badge">تسک متصل به گفتگو</span>
                        <span class="text-xs text-slate-500">مهلت: فردا</span>
                      </div>
                      <h4 class="text-[15px] font-semibold mb-1">بازبینی تعاملات و فیدبک‌ها</h4>
                      <p class="text-xs text-slate-500 leading-relaxed mb-2">
                        بررسی پاسخ سرور در حالات قطعی اینترنت و پیام‌های راهنما.
                      </p>
                      <div class="flex items-center justify-between pt-1">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold bg-primary-600 text-white">ع</div>
                          <span class="text-xs">مسئول: علی رضایی</span>
                        </div>
                        <span class="text-xs text-primary-600 font-medium">در حال انجام</span>
                      </div>
                    </div>
                    <div class="mt-4 pt-1">
                      <div class="w-full bg-primary-100 rounded-full h-1.5">
                        <div class="bg-primary-600 h-1.5 rounded-full" style="width: 70%"></div>
                      </div>
                      <div class="flex justify-between text-xs text-slate-500 mt-1">
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

      <section id="philosophy" class="w-full py-32 text-center">
        <div class="max-w-4xl mx-auto px-5 lg:px-8">
          <span class="text-[13px] font-semibold tracking-wider text-primary-600">فلسفه سکوت</span>
          <h2 class="text-[42px] lg:text-[44px] font-bold mt-3 mb-6 tracking-tight">
            سروصدای کمتر.<br />تمرکز عمیق‌تر.
          </h2>
          <div class="w-12 h-1 bg-primary-600 mx-auto mb-8 rounded-full"></div>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto leading-loose">
            کار واقعی شما نباید در میان ده‌ها تب باز و پیام‌های پراکنده گم بشه. تسک شخصی، تسک تیمی و گفتگوی گروهی همه در یک صفحه کنار هم می‌شینن.
          </p>
        </div>
      </section>

      <section class="w-full max-w-7xl mx-auto px-5 lg:px-8 pb-28">
        <div class="flex flex-col gap-24">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 order-2 lg:order-1 text-start">
              <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 mb-2">
                <Icon icon="material-symbols:chat" class="text-[20px]" />
              </div>
              <span class="text-[13px] font-semibold tracking-wider text-primary-600">گفتگوی بی‌درنگ</span>
              <h3 class="text-xl font-semibold mt-1 mb-2">گفتگوهای متصل به کار</h3>
              <p class="text-[15px] text-slate-500 leading-relaxed mb-4">
                هر پیامی می‌تونه مستقیماً به یک تسک با مسئول مشخص تبدیل بشه؛ بدون کپی-پیست بین برنامه‌های مختلف.
              </p>
              <ul class="space-y-2 text-xs text-slate-500 mb-5">
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>پشتیبانی از پیام صوتی، تصویر و فایل ضمیمه</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>سنجاق کردن پیام‌های مهم و منشن اعضا با @</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>نشانگر تایپ زنده و وضعیت خوانده‌شدن پیام</span>
                </li>
              </ul>
              <NuxtLink to="/workPlan" class="inline-flex items-center gap-1 text-[13px] font-medium text-primary-600 hover:text-primary-700 transition-colors">
                باز کردن چت‌های گروهی
                <Icon icon="material-symbols:arrow-back" class="text-[16px]" />
              </NuxtLink>
            </div>
            <div class="lg:col-span-7 order-1 lg:order-2">
              <div class="p-6" :class="card">
                <div class="bg-primary-50/60 rounded-xl p-4 space-y-3">
                  <div class="flex items-center justify-between pb-2">
                    <span class="text-[13px] font-semibold">چت گروهی: بازنگری محصول</span>
                    <span class="text-xs text-primary-600 flex items-center gap-1"><Icon icon="solar:check-read-linear" class="text-[14px]" /> خونده شد</span>
                  </div>
                  <div class="bg-white p-2 rounded-lg flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-slate-500 text-white text-[11px] flex items-center justify-center font-bold">م</span>
                      <span class="text-[15px]">فایل‌های گرافیکی نسخه موبایل بارگذاری شد.</span>
                    </div>
                    <Icon icon="solar:document-linear" class="text-primary-500 text-[16px]" />
                  </div>
                  <div class="bg-white p-2 rounded-lg flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full text-[11px] flex items-center justify-center font-bold bg-primary-600 text-white">س</span>
                      <span class="text-[15px]">عالی، وظیفه بررسی به مهندس ناظر ارجاع شد.</span>
                    </div>
                    <Icon icon="mingcute:task-2-line" class="text-primary-500 text-[16px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7">
              <div class="p-6" :class="card">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[13px] font-semibold">ساخت گروه جدید</span>
                  <span class="text-xs text-slate-500">مرحله ۲ از ۲</span>
                </div>
                <div class="bg-primary-50/60 rounded-xl p-4">
                  <p class="text-xs text-slate-500 mb-2">اعمال یک ران‌بوک آماده روی این گروه</p>
                  <div class="flex items-center justify-between bg-white px-3 py-2.5 rounded-lg">
                    <div class="flex items-center gap-2">
                      <Icon icon="mdi:book-cog-outline" class="text-primary-600 text-[18px]" />
                      <span class="text-[14px] font-medium">راه‌اندازی پروژه‌ی جدید</span>
                    </div>
                    <span class="text-xs text-slate-500">۶ تسک</span>
                  </div>
                </div>
                <div class="mt-4 p-2 bg-primary-50/60 rounded-xl flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">تیم</div>
                    <span class="text-[15px] font-medium">هماهنگی تقویم انتشار بهار</span>
                  </div>
                  <span class="text-xs bg-white px-2.5 py-1 rounded text-slate-500">در حال پردازش</span>
                </div>
              </div>
            </div>
            <div class="lg:col-span-5 text-start">
              <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 mb-2">
                <Icon icon="mdi:book-cog-outline" class="text-[20px]" />
              </div>
              <span class="text-[13px] font-semibold tracking-wider text-primary-600">ران‌بوک‌ها</span>
              <h3 class="text-xl font-semibold mt-1 mb-2">چک‌لیست‌های آماده برای گروه‌های جدید</h3>
              <p class="text-[15px] text-slate-500 leading-relaxed mb-4">
                یک بار مجموعه‌ی تسک‌های تکرارشونده رو به‌عنوان یک ران‌بوک بساز، بعد موقع ساخت هر گروه جدید همون رو یک‌جا اعمال کن.
              </p>
              <ul class="space-y-2 text-xs text-slate-500">
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>مدیریت اعضا و دسترسی ادمین برای هر گروه</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>اعلان لحظه‌ای دعوت‌نامه‌ها و پیام‌های جدید</span>
                </li>
              </ul>
              <NuxtLink to="/runbooks" class="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-primary-600 hover:text-primary-700 transition-colors">
                مشاهده ران‌بوک‌ها
                <Icon icon="material-symbols:arrow-back" class="text-[16px]" />
              </NuxtLink>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 order-2 lg:order-1 text-start">
              <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 mb-2">
                <Icon icon="material-symbols:person" class="text-[20px]" />
              </div>
              <span class="text-[13px] font-semibold tracking-wider text-primary-600">حریم خصوصی شخصی</span>
              <h3 class="text-xl font-semibold mt-1 mb-2">فضای کاری فردی، آرام و خلوت</h3>
              <p class="text-[15px] text-slate-500 leading-relaxed mb-4">
                علاوه بر تسک‌های گروهی، تسک‌های شخصی خودت رو با مراحل ریز، اولویت و فیلتر جداگانه مدیریت کن.
              </p>
              <ul class="space-y-2 text-xs text-slate-500 mb-5">
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>فیلتر بر اساس وضعیت و اولویت، مرتب‌سازی بر اساس تاریخ</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="material-symbols:done" class="text-[16px] text-primary-600" />
                  <span>مراحل ریز (Steps) با نوار پیشرفت برای هر تسک</span>
                </li>
              </ul>
              <NuxtLink to="/mainTodo" class="inline-flex items-center gap-1 text-[13px] font-medium text-primary-600 hover:text-primary-700 transition-colors">
                رفتن به تودولیست من
                <Icon icon="material-symbols:arrow-back" class="text-[16px]" />
              </NuxtLink>
            </div>
            <div class="lg:col-span-7 order-1 lg:order-2">
              <div class="p-6" :class="card">
                <div class="flex items-center justify-between pb-2 mb-2">
                  <span class="text-lg font-semibold">کارهای شخصی من</span>
                  <div class="flex items-center gap-1 text-slate-400">
                    <Icon icon="mingcute:check-circle-line" class="text-[16px]" />
                    <Icon icon="solar:sort-broken" class="text-[16px]" />
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="p-2.5 rounded-md border-s-4 border-slate-200 bg-primary-50/60 flex items-center gap-2">
                    <input type="checkbox" checked disabled class="w-4 h-4 accent-primary-600 rounded" />
                    <span class="text-[15px] line-through opacity-60 flex-1">مطالعه گزارش فصلی</span>
                  </div>
                  <div class="p-2.5 rounded-md border-s-4 border-rose-400 bg-primary-50/60 flex items-center gap-2">
                    <input type="checkbox" class="w-4 h-4 accent-primary-600 rounded" />
                    <span class="text-[15px] flex-1">نگارش یادداشت وبلاگ محصول</span>
                    <span class="text-xs px-2 py-0.5 rounded" :class="badge">فوری</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="w-full bg-slate-900 text-white py-28 relative overflow-hidden">
        <div class="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-primary-500/25 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -end-24 w-96 h-96 rounded-full bg-primary-500/15 blur-3xl pointer-events-none"></div>
        <div class="max-w-4xl mx-auto px-5 lg:px-8 text-center relative z-10">
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full mb-6">
            <span class="w-2 h-2 rounded-full bg-primary-500"></span>
            <span class="text-[13px] font-semibold tracking-wider text-white/85">آغاز کار با تودولیست من</span>
          </div>
          <h2 class="text-[32px] lg:text-[44px] font-bold text-white mb-4 tracking-tight">
            جایی بهتر برای کار کردن با هم.
          </h2>
          <p class="text-lg text-white/65 max-w-xl mx-auto mb-10 leading-relaxed">
            فضایی یکپارچه برای تمام ارتباطات و وظایف تیم شما؛ بدون اشتراک‌های پیچیده یا تنظیمات گیج‌کننده.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <NuxtLink :to="ctaTo" class="text-[13px] px-8 py-3.5" :class="btnPrimary">
              {{ authState.isLoggedIn ? 'ادامه‌ی کار در برنامه' : 'فضای کاری خود را بسازید' }}
            </NuxtLink>
            <a href="#principles" class="text-[13px] font-medium bg-white/10 hover:bg-white/15 text-white px-8 py-3.5 rounded-xl transition-colors">
              مشاهده محصول
            </a>
          </div>
          <div class="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/60 text-xs">
            <span class="flex items-center gap-1.5">
              <Icon icon="material-symbols:check" class="text-[16px] text-primary-500" /> بدون نیاز به کارت بانکی
            </span>
            <span class="flex items-center gap-1.5">
              <Icon icon="material-symbols:check" class="text-[16px] text-primary-500" /> ۴ تم رنگی و حالت تاریک
            </span>
            <span class="flex items-center gap-1.5">
              <Icon icon="material-symbols:check" class="text-[16px] text-primary-500" /> پشتیبانی کامل از زبان فارسی
            </span>
          </div>
        </div>
      </section>
    </main>

    <footer class="w-full bg-white border-t border-primary-200/60">
      <div class="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div class="lg:col-span-1">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-600 text-white">
                <Icon icon="mingcute:check-circle-fill" class="text-[18px]" />
              </div>
              <span class="text-lg font-semibold">تودولیست</span>
            </div>
            <p class="text-sm text-slate-500 leading-relaxed mb-5 max-w-xs">
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
              class="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
              <Icon :icon="s.icon" class="text-[18px]" />
              </a>
            </div>
          </div>

          <div class="flex flex-col gap-2.5">
            <h4 class="text-sm font-semibold mb-1">صفحه‌های مهم</h4>
            <NuxtLink
                v-for="link in siteLinks"
                :key="link.to"
                :to="link.to"
                class="text-sm text-slate-500 hover:text-primary-600 transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <div class="flex flex-col gap-2.5">
            <h4 class="text-sm font-semibold mb-1">حساب کاربری</h4>
            <template v-if="authState.isLoggedIn">
              <NuxtLink to="/mainTodo" class="text-sm text-slate-500 hover:text-primary-600 transition-colors">
                ورود به برنامه
              </NuxtLink>
              <NuxtLink to="/settings" class="text-sm text-slate-500 hover:text-primary-600 transition-colors">
                تنظیمات پروفایل
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login" class="text-sm text-slate-500 hover:text-primary-600 transition-colors">
                ورود
              </NuxtLink>
              <NuxtLink to="/auth/signup" class="text-sm text-slate-500 hover:text-primary-600 transition-colors">
                ثبت‌نام
              </NuxtLink>
              <NuxtLink to="/auth/forgot-password" class="text-sm text-slate-500 hover:text-primary-600 transition-colors">
                فراموشی رمز عبور
              </NuxtLink>
            </template>
          </div>

          <div class="flex flex-col">
            <h4 class="text-sm font-semibold mb-3">یه پیام برام بذار</h4>
            <div class="rounded-2xl border border-primary-200/70 bg-white p-4 shadow-sm">
              <Contactfeedback title="" />
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-primary-200/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <NuxtLink to="/aboutMe" class="hover:text-primary-600 transition-colors">
            درباره‌ی این پروژه
          </NuxtLink>
          <p>© ۲۰۲۶ تودولیست. همه‌ی حقوق محفوظه.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import Contactfeedback from '~/components/Contactfeedback.vue'
import { useAuth } from '~/composables/useAuth'
import { useTheme } from '~/composables/useTheme'
import {MorphIcon} from "morphicons/vue";


const heroSun = "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
const heroMoon = "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"


useSeoMeta({
  title: 'تودولیست من',
  description: 'فضایی برای تسک‌های شخصی، تسک‌های تیمی و گفتگوی گروهی، همه در یک محیط یکپارچه.',
})

const { authState } = useAuth()
const { isDark, toggleDark } = useTheme()

const userInitial = computed(() => {
  const name = authState.user?.name || authState.user?.username || ''
  return name.trim().charAt(0).toUpperCase()
})

const ctaTo = computed(() => (authState.isLoggedIn ? '/mainTodo' : '/auth/signup'))
const ctaLabel = computed(() => (authState.isLoggedIn ? 'ورود به داشبورد' : 'شروع کنید'))

const btnPrimary =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-l from-primary-600 to-primary-700 font-medium text-white shadow-sm transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-200 active:scale-[0.98]'
const btnGhost =
    'inline-flex items-center justify-center gap-2 rounded-xl border border-primary-200/70 bg-white/80 font-medium text-slate-800 shadow-sm transition-colors hover:bg-primary-50'
const card = 'rounded-2xl border border-primary-200/70 bg-white shadow-sm'
const badge = 'bg-primary-100 text-primary-700'

const railLinks = [
  { label: 'تودولیست من', icon: 'mdi:format-list-checks', to: '/mainTodo' },
  { label: 'کار تیمی و گفتگو', icon: 'mdi:account-group-outline', to: '/workPlan' },
  { label: 'رانبوک‌ها', icon: 'mdi:book-cog-outline', to: '/runbooks' },
  { label: 'تنظیمات', icon: 'weui:me-filled', to: '/settings' },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/salehre', icon: 'mdi:github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saleh-rezaei-1985b5415/', icon: 'mdi:linkedin' },
  { label: 'Gmail', href: 'mailto:salehrezaeipoor123@gmail.com', icon: 'tabler:brand-gmail' },
  { label: 'Reddit', href: 'https://www.reddit.com/user/salehrezaei/', icon: 'ic:outline-reddit' },
]

const siteLinks = [
  { label: 'تودولیست من', to: '/mainTodo' },
  { label: 'کار تیمی', to: '/workPlan' },
  { label: 'رانبوک‌ها', to: '/runbooks' },
  { label: 'درباره‌ی پروژه', to: '/aboutMe' },
]

const principles = [
  {
    icon: 'material-symbols:shield',
    title: 'نشست امن و مبتنی بر کوکی',
    desc: 'ورود با Sanctum و CSRF واقعی؛ اطلاعات و گفتگوهای تیمی فقط برای اعضای همون گروه قابل مشاهده‌ست.',
    footer: 'صفحه‌ی ورود و ثبت‌نام',
    footerIcon: 'material-symbols:lock',
    to: '/auth/login',
  },
  {
    icon: 'material-symbols:groups',
    title: 'ساخته‌شده برای تیم‌های واقعی',
    desc: 'گفتگوی گروهی دقیقاً کنار تسک‌های همون گروه، با پیام صوتی، تصویر، فایل و منشن اعضا.',
    footer: 'کار تیمی و گفتگو',
    footerIcon: 'material-symbols:arrow-back',
    to: '/workPlan',
  },
  {
    icon: 'mdi:book-cog-outline',
    title: 'ران‌بوک‌های آماده',
    desc: 'یک‌بار چک‌لیست تکرارشونده رو بساز، بعد موقع ساخت هر گروه جدید همون رو یک‌جا اعمال کن.',
    footer: 'مشاهده ران‌بوک‌ها',
    footerIcon: 'material-symbols:arrow-back',
    to: '/runbooks',
  },
  {
    icon: 'material-symbols:palette-outline',
    title: 'شخصی‌سازی کامل',
    desc: '۴ تم رنگی، حالت تاریک/روشن و دو زبان فارسی و انگلیسی، همه از صفحه‌ی تنظیمات قابل تغییرن.',
    footer: 'رفتن به تنظیمات',
    footerIcon: 'material-symbols:arrow-back',
    to: '/settings',
  },
]

const values = [
  {
    num: '۰۱',
    label: 'همکاری تیمی',
    title: 'کار گروهی بدون از دست رفتن کانتکست',
    desc: 'تسک‌های هر گروه دقیقاً کنار گفتگوی همون گروه قرار دارن؛ نیازی به سوئیچ بین چند برنامه نیست.'
  },
  {
    num: '۰۲',
    label: 'گفتگوی پیوسته',
    title: 'گفتگوهای متصل به وظایف',
    desc: 'هر پیام مهم می‌تونه مستقیماً به یک تسک با مسئول و مهلت مشخص تبدیل بشه؛ با پیام صوتی، عکس و فایل.'
  },
  {
    num: '۰۳',
    label: 'ران‌بوک‌ها',
    title: 'چک‌لیست‌های قابل استفاده مجدد',
    desc: 'مجموعه‌ای از تسک‌های تکرارشونده رو یک بار بساز و روی هر گروه جدید که ساختی اعمالش کن.'
  },
  {
    num: '۰۴',
    label: 'سازمان‌یافتگی',
    title: 'فیلتر، اولویت و مراحل ریز برای هر تسک',
    desc: 'فیلتر بر اساس وضعیت و اولویت، مرتب‌سازی بر اساس تاریخ و نوار پیشرفت مراحل، هم برای تسک شخصی و هم تیمی.'
  }
]

const collabPoints = [
  'تبدیل مستقیم هر پیام مهم به یک تسک مشخص',
  'پیوست پیام صوتی، تصویر و فایل به هر گفتگو',
  'سنجاق کردن پیام‌های مهم و نشانگر تایپ و خوانده‌شدن آنی'
]
</script>