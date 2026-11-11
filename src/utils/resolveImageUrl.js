import { ENV } from '../config/env';

export const DUMMY_IMAGE_PATH = '/dummy-image.jpeg';
export const EVENT_PLACEHOLDER_PATH = '/event-placeholder.png';
export const DISCOVER_DEFAULT_PLACEHOLDER = '/discover-placeholder.png';

export const SPORT_PLACEHOLDERS = {
    football: '/backup_football.jpeg',
    cricket: '/backup_cricket.jpeg',
    golf: '/backup_golf.jpeg',
    squash: '/backup_squash.jpeg',
};

export const getSportPlaceholder = (
    sportOrSports,
    fallback = DISCOVER_DEFAULT_PLACEHOLDER
) => {
    if (!sportOrSports) return fallback;

    const list = Array.isArray(sportOrSports) ? sportOrSports : [sportOrSports];
    for (const item of list) {
        if (!item) continue;
        const normalized = String(item).trim().toLowerCase();
        for (const [key, path] of Object.entries(SPORT_PLACEHOLDERS)) {
            if (normalized.includes(key)) {
                return path;
            }
        }
    }

    return fallback;
};

export const pickImageSource = (...candidates) => {
    for (const candidate of candidates) {
        if (candidate == null) continue;
        const value = String(candidate).trim();
        if (value) return value;
    }
    return null;
};

export const resolveImageUrl = (value, fallback = DUMMY_IMAGE_PATH) => {
    if (value == null) return fallback;

    const imageUrl = String(value).trim();
    if (!imageUrl) return fallback;

    if (/^https?:\/\//i.test(imageUrl)) {
        try {
            const parsedImageUrl = new URL(imageUrl);
            const apiBaseUrl = String(ENV.API_BASE_URL || '').trim();
            const parsedApiBaseUrl = apiBaseUrl ? new URL(apiBaseUrl) : null;

            if (
                parsedApiBaseUrl &&
                parsedImageUrl.pathname.includes('/uploads/') &&
                parsedImageUrl.hostname !== parsedApiBaseUrl.hostname
            ) {
                return `${parsedApiBaseUrl.origin}${parsedImageUrl.pathname}${parsedImageUrl.search}${parsedImageUrl.hash}`;
            }
            return imageUrl;
        } catch {
            return imageUrl;
        }
    }

    const apiBaseUrl = String(ENV.API_BASE_URL || '').replace(/\/+$/, '');
    if (apiBaseUrl && imageUrl.startsWith('/uploads/')) {
        return `${apiBaseUrl}${imageUrl}`;
    }

    return imageUrl;
};

export const handleImageLoadError = (event, fallback = DUMMY_IMAGE_PATH) => {
    const img = event.currentTarget;
    if (!fallback) return;

    try {
        const currentPath = new URL(img.src, window.location.origin).pathname;
        const fallbackPath = new URL(fallback, window.location.origin).pathname;
        if (currentPath === fallbackPath) return;
    } catch {
        if (String(img.src).includes('dummy-image.jpeg')) return;
    }

    img.onerror = null;
    img.src = fallback;
};
