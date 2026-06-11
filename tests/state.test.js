/**
 * State Store Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getState, setState, subscribe, resetState, actions } from '../src/stores/state.js';

describe('State Store', () => {
  beforeEach(() => {
    resetState();
  });
  
  describe('getState', () => {
    it('should return current state', () => {
      const state = getState();
      expect(state).toBeDefined();
      expect(state.activeTab).toBe('map');
      expect(state.lang).toBe('fr');
    });
    
    it('should return a copy, not the original state', () => {
      const state1 = getState();
      const state2 = getState();
      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });
  });
  
  describe('setState', () => {
    it('should update state with partial updates', () => {
      setState({ activeTab: 'spots' });
      const state = getState();
      expect(state.activeTab).toBe('spots');
    });
    
    it('should preserve other state properties', () => {
      const initialLang = getState().lang;
      setState({ activeTab: 'spots' });
      expect(getState().lang).toBe(initialLang);
    });
    
    it('should handle multiple updates', () => {
      setState({ activeTab: 'spots' });
      setState({ viewMode: 'map' });
      const state = getState();
      expect(state.activeTab).toBe('spots');
      expect(state.viewMode).toBe('map');
    });
  });
  
  describe('subscribe', () => {
    it('should call subscriber with current state immediately', () => {
      const callback = vi.fn();
      subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        activeTab: 'map',
      }));
    });
    
    it('should call subscriber on state changes', () => {
      const callback = vi.fn();
      subscribe(callback);
      callback.mockClear();
      
      setState({ activeTab: 'spots' });
      
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        activeTab: 'spots',
      }));
    });
    
    it('should return unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = subscribe(callback);
      callback.mockClear();
      
      unsubscribe();
      setState({ activeTab: 'spots' });
      
      expect(callback).not.toHaveBeenCalled();
    });
  });
  
  describe('resetState', () => {
    it('should reset state to initial values', () => {
      setState({ 
        activeTab: 'spots', 
        points: 100,
        username: 'TestUser'
      });
      
      resetState();
      
      const state = getState();
      expect(state.activeTab).toBe('map');
      expect(state.points).toBe(0);
      expect(state.username).toBe('');
    });
  });
  
  describe('actions', () => {
    describe('changeTab', () => {
      it('should change active tab', () => {
        actions.changeTab('spots');
        expect(getState().activeTab).toBe('spots');
      });
      
      it('should clear selected spot when changing tab', () => {
        setState({ selectedSpot: { id: 1 } });
        actions.changeTab('chat');
        expect(getState().selectedSpot).toBeNull();
      });
    });
    
    describe('toggleTheme', () => {
      it('should toggle from dark to light', () => {
        setState({ theme: 'dark' });
        actions.toggleTheme();
        expect(getState().theme).toBe('light');
      });
      
      it('should toggle from light to dark', () => {
        setState({ theme: 'light' });
        actions.toggleTheme();
        expect(getState().theme).toBe('dark');
      });
    });
    
    describe('addPoints', () => {
      it('should add points', () => {
        actions.addPoints(50);
        expect(getState().points).toBe(50);
      });
      
      it('should update level when reaching 100 points', () => {
        actions.addPoints(100);
        expect(getState().level).toBe(2);
      });
      
      it('should accumulate points', () => {
        actions.addPoints(30);
        actions.addPoints(40);
        expect(getState().points).toBe(70);
      });
    });
    
    describe('incrementCheckins', () => {
      it('should increment checkins', () => {
        actions.incrementCheckins();
        expect(getState().checkins).toBe(1);
      });
      
      it('should also add points', () => {
        actions.incrementCheckins();
        expect(getState().points).toBe(5);
      });
    });
    
    describe('addBadge', () => {
      it('should add badge if not already present', () => {
        actions.addBadge('FirstSpot');
        expect(getState().badges).toContain('FirstSpot');
      });
      
      it('should not add duplicate badges', () => {
        actions.addBadge('FirstSpot');
        actions.addBadge('FirstSpot');
        expect(getState().badges.filter(b => b === 'FirstSpot').length).toBe(1);
      });
      
      it('should add points when earning badge', () => {
        actions.addBadge('FirstSpot');
        expect(getState().points).toBe(50);
      });
    });
    
    describe('tutorial actions', () => {
      it('nextTutorialStep should increment step', () => {
        setState({ tutorialStep: 0 });
        actions.nextTutorialStep();
        expect(getState().tutorialStep).toBe(1);
      });
      
      it('nextTutorialStep should close tutorial at last step', () => {
        setState({ tutorialStep: 7, showTutorial: true });
        actions.nextTutorialStep();
        expect(getState().showTutorial).toBe(false);
        expect(getState().tutorialStep).toBe(0);
      });
      
      it('prevTutorialStep should decrement step', () => {
        setState({ tutorialStep: 3 });
        actions.prevTutorialStep();
        expect(getState().tutorialStep).toBe(2);
      });
      
      it('skipTutorial should close tutorial', () => {
        setState({ showTutorial: true, tutorialStep: 3 });
        actions.skipTutorial();
        expect(getState().showTutorial).toBe(false);
      });

      it('prevTutorialStep should not go below 0', () => {
        setState({ tutorialStep: 0 });
        actions.prevTutorialStep();
        expect(getState().tutorialStep).toBe(0);
      });
    });

    describe('setLanguage', () => {
      it('should set language', () => {
        actions.setLanguage('en');
        expect(getState().lang).toBe('en');
      });

      it('should set language to de', () => {
        actions.setLanguage('de');
        expect(getState().lang).toBe('de');
      });
    });

    describe('setSpots', () => {
      it('should set spots and clear loading flag', () => {
        const spots = [{ id: 's1', name: 'Spot 1' }];
        actions.setSpots(spots);
        expect(getState().spots).toEqual(spots);
        expect(getState().isLoadingSpots).toBe(false);
      });
    });

    describe('selectSpot', () => {
      it('should set selectedSpot', () => {
        const spot = { id: 'abc', name: 'Paris Nord' };
        actions.selectSpot(spot);
        expect(getState().selectedSpot).toEqual(spot);
      });

      it('should clear selectedSpot when null', () => {
        actions.selectSpot({ id: 'x' });
        actions.selectSpot(null);
        expect(getState().selectedSpot).toBeNull();
      });
    });

    describe('setFilter', () => {
      it('should set activeFilter', () => {
        actions.setFilter('top');
        expect(getState().activeFilter).toBe('top');
      });
    });

    describe('setSearchQuery', () => {
      it('should set searchQuery', () => {
        actions.setSearchQuery('Lyon');
        expect(getState().searchQuery).toBe('Lyon');
      });
    });

    describe('setUser', () => {
      it('should set user and isLoggedIn', () => {
        actions.setUser({ uid: 'u1', displayName: 'Alice' });
        const s = getState();
        expect(s.user).toBeDefined();
        expect(s.isLoggedIn).toBe(true);
        expect(s.username).toBe('Alice');
      });

      it('should set isLoggedIn to false when user is null', () => {
        actions.setUser(null);
        expect(getState().isLoggedIn).toBe(false);
      });
    });

    describe('updateProfile', () => {
      it('should update username', () => {
        actions.updateProfile({ username: 'Bob' });
        expect(getState().username).toBe('Bob');
      });

      it('should update avatar', () => {
        actions.updateProfile({ avatar: 'adventurer' });
        expect(getState().avatar).toBe('adventurer');
      });
    });

    describe('incrementSpotsCreated', () => {
      it('should increment spotsCreated', () => {
        actions.incrementSpotsCreated();
        expect(getState().spotsCreated).toBe(1);
      });

      it('should add 20 points', () => {
        actions.incrementSpotsCreated();
        expect(getState().points).toBe(20);
      });
    });

    describe('incrementReviews', () => {
      it('should increment reviewsGiven', () => {
        actions.incrementReviews();
        expect(getState().reviewsGiven).toBe(1);
      });

      it('should add 10 points', () => {
        actions.incrementReviews();
        expect(getState().points).toBe(10);
      });
    });

    describe('setTripSteps', () => {
      it('should set tripSteps', () => {
        actions.setTripSteps([{ from: 'Paris', to: 'Lyon' }]);
        expect(getState().tripSteps.length).toBe(1);
      });
    });

    describe('saveTrip', () => {
      it('should append trip to savedTrips', () => {
        actions.saveTrip({ id: 't1', name: 'Paris-Lyon' });
        expect(getState().savedTrips.length).toBe(1);
      });

      it('should preserve existing trips', () => {
        actions.saveTrip({ id: 't1' });
        actions.saveTrip({ id: 't2' });
        expect(getState().savedTrips.length).toBe(2);
      });
    });

    describe('toggleSOS', () => {
      it('should toggle sosActive to true', () => {
        setState({ sosActive: false });
        actions.toggleSOS();
        expect(getState().sosActive).toBe(true);
      });

      it('should toggle sosActive back to false', () => {
        setState({ sosActive: true });
        actions.toggleSOS();
        expect(getState().sosActive).toBe(false);
      });
    });

    describe('addEmergencyContact', () => {
      it('should append contact to emergencyContacts', () => {
        actions.addEmergencyContact({ name: 'Maman', phone: '+33600000000' });
        expect(getState().emergencyContacts.length).toBe(1);
      });

      it('should preserve existing contacts', () => {
        actions.addEmergencyContact({ name: 'A' });
        actions.addEmergencyContact({ name: 'B' });
        expect(getState().emergencyContacts.length).toBe(2);
      });
    });

    describe('setOnlineStatus', () => {
      it('should set isOnline to true', () => {
        actions.setOnlineStatus(true);
        expect(getState().isOnline).toBe(true);
      });

      it('should set isOnline to false', () => {
        actions.setOnlineStatus(false);
        expect(getState().isOnline).toBe(false);
      });
    });

    describe('setUserLocation', () => {
      it('should set userLocation and gpsEnabled', () => {
        actions.setUserLocation({ lat: 48.8, lng: 2.3 });
        const s = getState();
        expect(s.userLocation).toEqual({ lat: 48.8, lng: 2.3 });
        expect(s.gpsEnabled).toBe(true);
      });

      it('should set gpsEnabled to false when null', () => {
        actions.setUserLocation(null);
        expect(getState().gpsEnabled).toBe(false);
      });
    });

    describe('addCheckinToHistory', () => {
      it('should prepend checkin to checkinHistory', () => {
        const checkin = actions.addCheckinToHistory({ spotId: 'sp1', note: 'Great!' });
        const history = getState().checkinHistory;
        expect(history.length).toBe(1);
        expect(history[0].spotId).toBe('sp1');
      });

      it('should return the new checkin with id', () => {
        const checkin = actions.addCheckinToHistory({ spotId: 'sp2' });
        expect(checkin.id).toBeDefined();
        expect(checkin.id).toContain('checkin_');
      });

      it('should prepend (most recent first)', () => {
        actions.addCheckinToHistory({ spotId: 'old' });
        actions.addCheckinToHistory({ spotId: 'new' });
        expect(getState().checkinHistory[0].spotId).toBe('new');
      });
    });
  });
});
