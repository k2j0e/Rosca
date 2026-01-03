import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.rosca.app',
    appName: 'Rosca',
    webDir: 'out',
    server: {
        // Load the production Vercel site directly
        url: 'https://rosca-alpha.vercel.app',
        cleartext: false
    },
    ios: {
        contentInset: 'automatic',
        allowsLinkPreview: true,
    },
    android: {
        allowMixedContent: false,
    }
};

export default config;
