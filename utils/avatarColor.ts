const avatarBgOptions = ['bg-primary-500', 'bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500']

export function colorFor(id: number): string {
    return avatarBgOptions[id % avatarBgOptions.length]
}