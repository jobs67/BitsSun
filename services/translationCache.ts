// Translation Cache Service with LocalStorage Persistence
const CACHE_KEY = 'bitssun_translations_v1';
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

interface CacheEntry {
    value: string;
    timestamp: number;
}

class TranslationCache {
    private cache: Map<string, CacheEntry>;

    constructor() {
        this.cache = new Map();
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(CACHE_KEY);
            if (stored) {
                const entries: [string, CacheEntry][] = JSON.parse(stored);
                this.cache = new Map(entries);
                console.log(`✅ Loaded ${this.cache.size} cached translations`);
            }
        } catch (error) {
            console.error('Failed to load translation cache:', error);
            this.cache = new Map();
        }
    }

    private saveToStorage(): void {
        try {
            const entries = Array.from(this.cache.entries());
            localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
        } catch (error) {
            console.error('Failed to save translation cache:', error);
        }
    }

    get(key: string): string | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        // Check expiry
        if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
            this.cache.delete(key);
            this.saveToStorage();
            return null;
        }

        return entry.value;
    }

    set(key: string, value: string): void {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
        this.saveToStorage();
    }

    clear(): void {
        this.cache.clear();
        localStorage.removeItem(CACHE_KEY);
        console.log('🗑️ Translation cache cleared');
    }

    getStats(): { size: number; oldestEntry: number | null } {
        let oldestTimestamp: number | null = null;

        for (const entry of this.cache.values()) {
            if (!oldestTimestamp || entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
            }
        }

        return {
            size: this.cache.size,
            oldestEntry: oldestTimestamp
        };
    }
}

// Singleton instance
export const translationCache = new TranslationCache();
