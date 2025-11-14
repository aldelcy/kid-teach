// Service Worker for KidTeach PWA
const CACHE_NAME = 'kidteach-v1'
const STATIC_CACHE = 'kidteach-static-v1'
const DYNAMIC_CACHE = 'kidteach-dynamic-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/alphabet',
  '/colors',
  '/animals',
  '/family',
  '/actions',
  '/manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== STATIC_CACHE && name !== DYNAMIC_CACHE
          })
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          const responseToCache = response.clone()

          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If fetch fails and it's a navigation request, show offline page
          if (request.mode === 'navigate') {
            return caches.match('/offline')
          }
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
          })
        })
    })
  )
})

