export default function initialise() {
    // initialise the app
    
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(new URL('./service.worker.ts', import.meta.url), {
            type: "module",
            scope: '/'
        });
    }, {once: true});
}