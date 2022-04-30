import {registerRoute} from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';


// general static asset caching e.g. fonts, css, etc.
const destinations = ["style", "font", "manifest", "script", "worker"];
registerRoute(
    ({request}) => destinations.includes(request.destination),
    new CacheFirst({
        cacheName: 'static'
    })
);

// app route
// revalidate in case update is available
registerRoute(
    ({request}) => request.destination === "document",
    new StaleWhileRevalidate({
        cacheName: 'app'
    })
);


// catch all strategy
registerRoute(
    ({url}) => url.pathname === '/',
    new CacheFirst()
);