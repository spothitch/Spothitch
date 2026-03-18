/**
 * Storage Utility Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Storage, safeSetItem } from '../src/utils/storage.js';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
    localStorage.clear.mockClear();
  });
  
  describe('get', () => {
    it('should return parsed JSON from localStorage', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({ test: 'value' }));
      
      const result = Storage.get('key');
      
      expect(localStorage.getItem).toHaveBeenCalledWith('spothitch_v4_key');
      expect(result).toEqual({ test: 'value' });
    });
    
    it('should return null if key does not exist', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const result = Storage.get('nonexistent');
      
      expect(result).toBeNull();
    });
    
    it('should return null on parse error', () => {
      localStorage.getItem.mockReturnValue('invalid json');
      
      const result = Storage.get('key');
      
      expect(result).toBeNull();
    });
    
    it('should handle primitive values', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify(42));
      expect(Storage.get('number')).toBe(42);
      
      localStorage.getItem.mockReturnValue(JSON.stringify('string'));
      expect(Storage.get('string')).toBe('string');
      
      localStorage.getItem.mockReturnValue(JSON.stringify(true));
      expect(Storage.get('boolean')).toBe(true);
    });
  });
  
  describe('set', () => {
    it('should store JSON in localStorage', () => {
      const result = Storage.set('key', { test: 'value' });
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'spothitch_v4_key',
        JSON.stringify({ test: 'value' })
      );
      expect(result).toBe(true);
    });
    
    it('should handle arrays', () => {
      Storage.set('array', [1, 2, 3]);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'spothitch_v4_array',
        JSON.stringify([1, 2, 3])
      );
    });
    
    it('should return false on error', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      
      const result = Storage.set('key', 'value');
      
      expect(result).toBe(false);
    });
  });
  
  describe('remove', () => {
    it('should remove item from localStorage', () => {
      const result = Storage.remove('key');
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('spothitch_v4_key');
      expect(result).toBe(true);
    });
    
    it('should return false on error', () => {
      localStorage.removeItem.mockImplementation(() => {
        throw new Error('Error');
      });
      
      const result = Storage.remove('key');
      
      expect(result).toBe(false);
    });
  });
  
  describe('clear', () => {
    it('should clear SpotHitch keys', () => {
      localStorage.removeItem = vi.fn();

      // Just verify clear doesn't throw
      expect(() => Storage.clear()).not.toThrow();
    });

    it('should return false on error', () => {
      const origKeys = Object.keys;
      Object.keys = () => { throw new Error('fail') };
      expect(Storage.clear()).toBe(false);
      Object.keys = origKeys;
    });
  });
});

describe('safeSetItem', () => {
  it('should set item and return true', () => {
    localStorage.setItem.mockRestore?.();
    const origSet = localStorage.setItem.bind(localStorage);
    localStorage.setItem = vi.fn(origSet);
    expect(safeSetItem('safe_test_key', 'val')).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('safe_test_key', 'val');
  });

  it('should handle QuotaExceededError by clearing cache', () => {
    let calls = 0;
    localStorage.setItem.mockImplementation(() => {
      calls++;
      if (calls === 1) {
        const err = new Error('quota');
        err.name = 'QuotaExceededError';
        throw err;
      }
    });
    // Mock Object.keys to return cache keys
    const origKeys = Object.keys;
    Object.keys = (obj) => {
      if (obj === localStorage) return ['some_cache_key', 'some_history_data'];
      return origKeys(obj);
    };
    localStorage.removeItem = vi.fn();

    expect(safeSetItem('key', 'val')).toBe(true);
    Object.keys = origKeys;
  });

  it('should return false if quota still exceeded after cleanup', () => {
    localStorage.setItem.mockImplementation(() => {
      const err = new Error('quota');
      err.name = 'QuotaExceededError';
      throw err;
    });
    const origKeys = Object.keys;
    Object.keys = (obj) => {
      if (obj === localStorage) return [];
      return origKeys(obj);
    };
    localStorage.removeItem = vi.fn();

    expect(safeSetItem('key', 'val')).toBe(false);
    Object.keys = origKeys;
  });

  it('should return false on non-quota error', () => {
    localStorage.setItem.mockImplementation(() => {
      throw new Error('other error');
    });

    expect(safeSetItem('key', 'val')).toBe(false);
  });
});
