'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, SlidersHorizontal, Loader2, Home, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapView } from '@/components/map-view'
import { PinBottomSheet } from '@/components/pin-bottom-sheet'
import { PinCard } from '@/components/pin-card'
import { getAllPins } from '@/lib/services/pins'
import { useAuth } from '@/contexts/auth-context'
import { useNotifications } from '@/contexts/notification-context'
import { CATEGORIES, type Pin, type PinCategory } from '@/lib/types'
import { cn, calculateDistanceInKm } from '@/lib/utils'
import { MessageBadge } from '@/components/message-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Suspense } from 'react'

type ViewMode = 'map' | 'list'

function ExplorePageContent() {
  const { user } = useAuth()
  const { permission, isEnabled, toggleNotifications } = useNotifications()
  const searchParams = useSearchParams()
  
  // URL params for centering / selecting a pin
  const urlLat = searchParams.get('lat')
  const urlLng = searchParams.get('lng')
  const urlPinId = searchParams.get('pin')

  const [pins, setPins] = useState<Pin[]>([])
  const [loadingPins, setLoadingPins] = useState(true)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [filterCategory, setFilterCategory] = useState<PinCategory | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState<'newest' | 'nearest'>('newest')

  const [radiusKm, _setRadiusKm] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Auto-detect category from URL
    const cat = searchParams.get('category') as PinCategory | 'all'
    if (cat) {
      setFilterCategory(cat)
      
      // Special behavior for Fuel/EV: Switch to list view and sort by nearest
      if (cat === 'fuel_ev') {
        setViewMode('list')
        setSortMode('nearest')
        
        // Trigger geolocation automatically
        if (typeof window !== 'undefined' && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation([position.coords.latitude, position.coords.longitude])
            },
            (err) => {
              let errorMsg = 'Unknown location error';
              switch(err.code) {
                case err.PERMISSION_DENIED: errorMsg = 'User denied location access'; break;
                case err.POSITION_UNAVAILABLE: errorMsg = 'Location information is unavailable'; break;
                case err.TIMEOUT: errorMsg = 'Location request timed out'; break;
              }
              console.warn(`[Geolocation] Auto-location error: ${errorMsg}`, err.message);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
          )
        }
      }
    }

    const q = searchParams.get('q')
    if (q) setSearchQuery(q)
  }, [searchParams])

  const initialCenter = useMemo<[number, number] | undefined>(() => {
    if (urlLat && urlLng) {
      return [parseFloat(urlLat), parseFloat(urlLng)]
    }
    return undefined
  }, [urlLat, urlLng])

  // Sync initial center to user location if provided via URL
  useEffect(() => {
    if (initialCenter && !userLocation) {
      setUserLocation(initialCenter)
    }
  }, [initialCenter, userLocation])

  useEffect(() => {
    const fetchPins = async () => {
      setLoadingPins(true)
      try {
        const excludeIds = [...(user?.blockedUsers || []), ...(user?.blockedBy || [])]
        const fetchedPins = await getAllPins('all', excludeIds)
        setPins(fetchedPins)
        
        // If a pin ID is in search params, find it and select it
        if (urlPinId) {
          const pin = fetchedPins.find((p) => p.id === urlPinId)
          if (pin) {
            setSelectedPin(pin)
          }
        }
      } catch (error) {
        console.error("Failed to fetch pins:", error)
      } finally {
        setLoadingPins(false)
      }
    }
    fetchPins()
  }, [urlPinId, user?.blockedUsers, user?.blockedBy])

  const filteredPins = pins.filter((pin) => {
    const matchCat = filterCategory === 'all' || pin.category === filterCategory
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || 
      pin.title.toLowerCase().includes(q) || 
      pin.description.toLowerCase().includes(q) ||
      pin.pinNumber?.toLowerCase().includes(q)
    // Extra client-side check if user state changed
    const excludeIds = [...(user?.blockedUsers || []), ...(user?.blockedBy || [])]
    const notBlocked = !excludeIds.includes(pin.ownerId || '')

    // Spatial filter
    const matchRadius = radiusKm === null || (
      userLocation && typeof pin.lat === 'number' && typeof pin.lng === 'number'
      ? calculateDistanceInKm(userLocation[0], userLocation[1], pin.lat, pin.lng) <= radiusKm
      : false
    )

    return matchCat && matchSearch && notBlocked && matchRadius
  })


  const sortedPins = useMemo(() => {
    let result = [...filteredPins]
    
    if (sortMode === 'nearest' && userLocation) {
      result.sort((a, b) => {
        const distA = calculateDistanceInKm(userLocation[0], userLocation[1], a.lat, a.lng)
        const distB = calculateDistanceInKm(userLocation[0], userLocation[1], b.lat, b.lng)
        return distA - distB
      })
    } else {
      // Default: Newest first
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    
    return result
  }, [filteredPins, sortMode, userLocation])

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Header - mudmy branding matching reference */}
      <header className="px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/40 z-30 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="h-9 w-20 rounded-xl bg-white flex items-center justify-center shadow-md shadow-orange-500/10 group-hover:scale-105 transition-transform border border-orange-100/60 p-0.5">
                <img src="/logo1.png" alt="mudmy" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white animate-pulse" />
            </div>
          </Link>

          {/* Right Header: Notification & User Pill */}
          <div className="flex items-center gap-2">
            {/* Message Button */}
            <MessageBadge />

            {/* Notification Bell Toggle */}
            <button
              onClick={toggleNotifications}
              className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
              title={isEnabled ? 'ปิดการแจ้งเตือน' : 'เปิดการแจ้งเตือน'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              {(permission === 'default' || !isEnabled) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
              )}
            </button>

            {/* User Profile Pill */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-orange-400/60 shadow-sm flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name || 'profile'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-primary to-primary/70 text-white flex items-center justify-center font-bold text-[10px]">
                    {user?.name ? user.name.slice(0, 1).toUpperCase() : 'M'}
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[70px] truncate">
                {user?.name || 'mudmy'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Search & Category Selector Bar */}
      <div className="px-3 pt-2.5 pb-1 space-y-2.5 z-20 shrink-0 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <Input
              placeholder="ค้นหาหมุดหมาย หรือบริการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 rounded-2xl h-11 text-xs sm:text-sm shadow-sm bg-white/95 dark:bg-slate-900/95 border-slate-200/80 dark:border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary/30",
                searchQuery && "pr-10"
              )}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="ล้างคำค้นหา"
                title="ล้างคำค้นหา"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown Filter */}
          <div className="shrink-0">
            {mounted ? (
              <Select 
                value={filterCategory} 
                onValueChange={(val: any) => setFilterCategory(val)}
              >
                <SelectTrigger className="w-[110px] sm:w-[130px] h-11 rounded-2xl bg-white/95 dark:bg-slate-900/95 border-slate-200/80 dark:border-slate-800 shadow-sm font-semibold text-xs text-slate-700 dark:text-slate-200">
                  <SelectValue placeholder="ทุกประเภท" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl">
                  <SelectItem value="all" className="text-xs font-semibold">✨ ทุกประเภท</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className="text-xs">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="w-[110px] h-11 rounded-2xl bg-muted" />
            )}
          </div>
        </div>

      </div>

      {/* Main Content (Map / List) */}
      <main className="flex-1 relative overflow-hidden">
        {viewMode === 'map' ? (
          <>
            <MapView
              pins={sortedPins}
              selectedPin={selectedPin}
              onPinSelect={setSelectedPin}
              filterCategory={filterCategory}
              initialCenter={initialCenter}
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              radiusKm={radiusKm}
            />

            {/* Selected Pin Bottom Sheet */}
            <PinBottomSheet
              pin={selectedPin}
              onClose={() => setSelectedPin(null)}
            />
          </>
        ) : (
          <div className="h-full overflow-y-auto pb-24">
            <PinBottomSheet
              pin={selectedPin}
              onClose={() => setSelectedPin(null)}
            />
            <div className="max-w-7xl mx-auto px-4 py-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {loadingPins ? (
                      <span className="animate-pulse">กำลังโหลดข้อมูล...</span>
                    ) : (
                      <>พบ {sortedPins.length} หมุดในบริเวณนี้</>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={sortMode} onValueChange={(val: any) => setSortMode(val)}>
                    <SelectTrigger className="h-9 w-[130px] rounded-xl text-xs bg-muted/50 border-none font-bold">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-3 h-3" />
                        <SelectValue placeholder="เรียงลำดับ" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="newest" className="text-xs font-medium">ล่าสุด</SelectItem>
                      <SelectItem value="nearest" className="text-xs font-medium" disabled={!userLocation}>
                        ระยะทางใกล้ที่สุด
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Grid */}
              {loadingPins ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-sm sm:text-base">กำลังโหลดหมุดหมาย...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                    {sortedPins.map((pin) => (
                      <div key={pin.id} className="animate-slide-up h-full">
                        <PinCard 
                          pin={pin} 
                          userLocation={userLocation} 
                          onClick={(p) => setSelectedPin(p)}
                        />
                      </div>
                    ))}
                  </div>

                  {sortedPins.length === 0 && (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-lg font-semibold text-foreground">ไม่พบหมุดหมายในหมวดนี้</p>
                      <Button 
                        variant="outline" 
                        className="mt-6 rounded-2xl"
                        onClick={() => {
                          setFilterCategory('all')
                          setSearchQuery('')
                        }}
                      >
                        ล้างตัวกรอง
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar (As in Image) */}
      <nav className={cn("fixed inset-x-0 bottom-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-2xl", selectedPin && "hidden")}>
        <div className="max-w-md mx-auto flex items-center justify-around gap-1">
          {/* Tab 1: Home */}
          <Link
            href="/home"
            className="flex flex-col items-center gap-1 px-3 py-1 text-slate-400 hover:text-slate-600 transition-all"
          >
            <div className="relative flex items-center justify-center w-[22px] h-[22px]">
              <Home className="w-[22px] h-[22px]" />
            </div>
            <span className="text-[11px]">Home</span>
          </Link>

          {/* Tab 2: แผนที่ */}
          <button
            onClick={() => setViewMode('map')}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 transition-all",
              viewMode === 'map' ? "text-primary font-bold" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
              {viewMode === 'map' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary" />
              )}
            </div>
            <span className="text-[11px]">แผนที่</span>
          </button>

          {/* Tab 3: รายการ */}
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 transition-all",
              viewMode === 'list' ? "text-primary font-bold" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              {viewMode === 'list' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary" />
              )}
            </div>
            <span className="text-[11px]">รายการ</span>
          </button>

          {/* Tab 4: เพิ่มหมุด */}
          <Link
            href="/create-pin"
            aria-label="เพิ่มหมุด"
            className="flex flex-col items-center gap-1 px-3 py-1 text-primary hover:text-primary/80 transition-all"
          >
            <div className="flex h-[22px] w-[22px] items-center justify-center">
              <Plus className="h-[22px] w-[22px] stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-bold">เพิ่มหมุด</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  )
}
