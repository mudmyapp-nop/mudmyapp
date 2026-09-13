'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Plus, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { subscribeToUserConversations } from '@/lib/services/messages'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [unreadCount, setUnreadCount] = useState(0)

  const NAV = [
    { href: '/home', label: t('navbar.home') || 'Home', icon: Home },
    { href: '/explore', label: t('navbar.explore') || 'Explore', icon: Compass },
    // Center button handled separately
    { href: '/messages', label: t('messages.title') || 'Chat', icon: MessageCircle },
    { href: '/profile/settings', label: t('profile.settings') || 'Me', icon: User },
  ]

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserConversations(user.id, (conversations) => {
      const totalUnread = conversations.reduce((sum, conv) => {
        return sum + (conv.unreadCount?.[user.id] || 0)
      }, 0)
      setUnreadCount(totalUnread)
    })

    return () => unsubscribe()
  }, [user])

  return (
    <nav className="mudmy-mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 hidden w-full pointer-events-none md:hidden">
      <div className="mx-auto box-border w-full max-w-[28rem] overflow-hidden px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        <div className="mudmy-bottom-nav pointer-events-auto relative grid h-[4.5rem] min-w-0 grid-cols-5 items-end overflow-hidden rounded-[1.75rem] border border-border/50 bg-background/98 px-1.5 pt-2 pb-1.5 shadow-2xl shadow-black/15 backdrop-blur-2xl">
          {/* Left 2 */}
          {NAV.slice(0, 2).map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative col-span-1 flex min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-1 py-2 text-[10px] font-bold transition-all',
                  active 
                    ? 'text-primary bg-primary/15 scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95'
                )}
              >
                <div className={cn(
                  'p-2 rounded-xl transition-all',
                  active && 'bg-primary/20 shadow-sm'
                )}>
                  <Icon className={cn('w-5.5 h-5.5', active && 'drop-shadow-sm stroke-[2.5]')} />
                </div>
                <span className="min-w-0 max-w-full truncate leading-none">{item.label}</span>
              </Link>
            )
          })}

          {/* Center FAB - Elevated */}
          <div className="col-span-1 flex min-w-0 items-center justify-center">
            <Link
              href="/create-pin"
              aria-label="สร้างหมุด"
              className={cn(
                "w-[3.75rem] h-[3.75rem] rounded-[1.5rem] text-primary-foreground flex items-center justify-center -mt-9",
                "border-[6px] border-background",
                "bg-gradient-to-br from-primary via-primary to-secondary",
                "shadow-xl shadow-primary/30",
                "hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-95",
                "transition-all duration-200"
              )}
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </Link>
          </div>

          {/* Right 2 */}
          {NAV.slice(2).map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            const isChat = item.href === '/messages'

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative col-span-1 flex min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl px-1 py-2 text-[10px] font-bold transition-all',
                  active 
                    ? 'text-primary bg-primary/15 scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95'
                )}
              >
                <div className={cn(
                  'p-2 rounded-xl transition-all',
                  active && 'bg-primary/20 shadow-sm'
                )}>
                  <Icon className={cn('w-5.5 h-5.5', active && 'drop-shadow-sm stroke-[2.5]')} />
                </div>
                <span className="min-w-0 max-w-full truncate leading-none">{item.label}</span>

                {isChat && unreadCount > 0 && (
                  <span className="absolute top-0 right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground ring-2 ring-background animate-in zoom-in">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
