import crypto from 'crypto';

export interface GeneratedApiKey {
  fullKey: string;
  prefix: string;
  hashedKey: string;
}

export function generateApiKey(environment: 'production' | 'test' = 'production'): GeneratedApiKey {
  // Generate 32 random bytes and convert to hex (64 characters)
  const randomBytes = crypto.randomBytes(32).toString('hex');
  
  // Create prefix based on environment
  const prefix = environment === 'production' ? 'ak_live_' : 'ak_test_';
  
  // Full key format: ak_{env}_{64_chars}
  const fullKey = `${prefix}${randomBytes}`;
  
  // Hash the full key for storage
  const hashedKey = crypto.createHash('sha256').update(fullKey).digest('hex');
  
  // Create display prefix (first 8 chars of random part)
  const displayPrefix = `${prefix}${randomBytes.substring(0, 8)}...${randomBytes.substring(randomBytes.length - 4)}`;
  
  return {
    fullKey,
    prefix: displayPrefix,
    hashedKey,
  };
}

export function verifyApiKey(providedKey: string, hashedKey: string): boolean {
  const computedHash = crypto.createHash('sha256').update(providedKey).digest('hex');
  return computedHash === hashedKey;
}

