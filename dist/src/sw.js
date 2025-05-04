"use strict";
const DomainName = self.location.origin?.split(`.`)?.[0], CACHE_NAME = `cache_${DomainName}`, ROOT_URI = `APP_URL`, NOTIFICATION_ICON = `APP_ICON`, NOTIFICATION_BADGE = `APP_BADGE`, DEFAULT_NOTIFICATION_DATA = {
    title: `New Notification`,
    body: `You have a new notification!`,
    url: `NOTIFICATION_URI`
}, 
/** Check internet connectivity */
isOnline = async () => {
    try {
        // Attempt to fetch a small resource to check connectivity
        await fetch(`REFERENCE_FILE`, {
            method: `HEAD`,
            mode: `no-cors`,
            cache: `no-store`
        });
        return true;
    }
    catch {
        return false;
    }
    ;
};
// Install event: No pre-caching, just activate immediately
self.addEventListener(`install`, (event) => {
    event.waitUntil(self.skipWaiting());
});
// Activate event: Clean up old caches
self.addEventListener(`activate`, (event) => {
    event.waitUntil(caches.keys().then(cacheNames => Promise.all(cacheNames.map(name => {
        if (name !== CACHE_NAME) {
            return caches.delete(name);
        }
        return null;
    }))).then(() => self
        ?.clients
        ?.claim()));
});
// Fetch event: Use network when online, cache visited pages, serve cache when offline
self.addEventListener(`fetch`, (event) => {
    event.respondWith(isOnline().then(online => {
        if (online) {
            // When online, always fetch from network
            return fetch(event.request)
                .then(networkResponse => {
                // Cache GET requests with valid responses
                if (event.request.method === `GET` && networkResponse.ok) {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }
                return networkResponse;
            })
                .catch(error => {
                // Network failed, try cache
                if (event.request.method === `GET`) {
                    return caches.match(event.request).then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        return new Response(`Network unavailable and no cached response found`, {
                            status: 503,
                            statusText: `Service Unavailable`
                        });
                    });
                }
                return new Response(`Network unavailable`, {
                    status: 503,
                    statusText: `Service Unavailable`
                });
            });
        }
        else {
            // When offline, serve from cache for GET requests
            if (event.request.method === `GET`) {
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return new Response(`Offline and no cached response found`, {
                        status: 503,
                        statusText: `Service Unavailable`
                    });
                });
            }
            return new Response(`Offline and non-GET request`, {
                status: 503,
                statusText: `Service Unavailable`
            });
        }
    }));
});
// Notification click: Open or focus window
self.addEventListener(`notificationclick`, (event) => {
    event.notification.close();
    const url = new URL(ROOT_URI, self.location.origin).href;
    event.waitUntil(self
        ?.clients
        ?.matchAll({ type: `window`, includeUncontrolled: true }) // @ts-ignore
        ?.then(clients => {
        for (const client of clients) {
            if (client.url === url && `focus` in client)
                return client.focus();
        }
        ; // @ts-ignore
        if (self?.clients.openWindow)
            return self.clients.openWindow(url);
    }));
});
// Notification close: Log event
self.addEventListener(`notificationclose`, (event) => {
    console.log(`Notification closed:`, event.notification);
});
// Push event: Show notification
self.addEventListener(`push`, (event) => {
    let data = DEFAULT_NOTIFICATION_DATA;
    if (event.data) {
        try {
            data = event.data.json();
        }
        catch (e) {
            console.warn(`Invalid push data, using default: ${e}`);
        }
        ;
    }
    ;
    const options = {
        body: data.body,
        icon: NOTIFICATION_ICON,
        badge: NOTIFICATION_BADGE,
        data: { url: new URL(data.url || ROOT_URI, self.location.origin).href }
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});
