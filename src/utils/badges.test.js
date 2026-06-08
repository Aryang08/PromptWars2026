import { describe, it, expect } from 'vitest';
import { checkBadges, calculatePoints, getCurrentLevel, calculateStreak } from './badges.js';

describe('Badges & Gamification', () => {
  describe('checkBadges', () => {
    it('should unlock welcome badge on first scan', () => {
      const stats = { totalScans: 1 };
      const unlocked = checkBadges(stats);
      expect(unlocked).toContain('first-scan');
    });

    it('should unlock streak badges', () => {
      const stats = { currentStreak: 4 };
      const unlocked = checkBadges(stats);
      expect(unlocked).toContain('streak-3');
    });

    it('should unlock target badges when emissions are below target', () => {
      const stats = { latestTotal: 150 };
      const unlocked = checkBadges(stats);
      expect(unlocked).toContain('paris-2030');
    });
  });

  describe('calculatePoints', () => {
    it('should calculate points based on multiple stats', () => {
      const stats = {
        totalScans: 2, // 20
        completedActions: 3, // 45
        currentStreak: 2, // 40
        latestTotal: 500,
        firstTotal: 500
      };
      const points = calculatePoints(stats);
      // Badges: first-scan, second-scan
      // Total badges = 2. 2 * 25 = 50.
      // 20 + 45 + 40 + 50 = 155
      expect(points).toBe(155);
    });
  });

  describe('getCurrentLevel', () => {
    it('should return correct level for points', () => {
      const level = getCurrentLevel(150); // Level 3 starts at 150
      expect(level.current.level).toBe(3);
      expect(level.next.minPoints).toBe(300);
      expect(level.progress).toBe(0); // 0% into level 3
    });

    it('should handle max level', () => {
      const level = getCurrentLevel(2500); // Max is 8 (2000)
      expect(level.current.level).toBe(8);
      expect(level.next).toBeNull();
      expect(level.progress).toBe(100);
    });
  });

  describe('calculateStreak', () => {
    it('should handle empty dates', () => {
      expect(calculateStreak([])).toBe(0);
    });

    it('should calculate consecutive months correctly', () => {
      // Mock dates: current month and previous month
      const current = new Date();
      const prev = new Date();
      prev.setMonth(current.getMonth() - 1);
      
      const dates = [prev.toISOString(), current.toISOString()];
      expect(calculateStreak(dates)).toBe(2);
    });
  });
});
