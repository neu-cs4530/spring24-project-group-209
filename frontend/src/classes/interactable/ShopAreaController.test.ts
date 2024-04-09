import PlayerController from '../PlayerController';
import { nanoid } from 'nanoid';
import TownController from '../TownController';
import { mock } from 'jest-mock-extended';
import assert from 'assert';
import ShopAreaController from './ShopAreaController';
import { ShopArea } from '../../types/CoveyTownSocket';

describe('ShopAreaController', () => {
  const ourPlayer = new PlayerController(nanoid(), nanoid(), {
    x: 0,
    y: 0,
    moving: false,
    rotation: 'front',
  });
  const otherPlayers = [
    new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
    new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
  ];

  const mockTownController = mock<TownController>();
  Object.defineProperty(mockTownController, 'ourPlayer', {
    get: () => ourPlayer,
  });
  Object.defineProperty(mockTownController, 'players', {
    get: () => [ourPlayer, ...otherPlayers],
  });
  mockTownController.getPlayer.mockImplementation(playerID => {
    const p = mockTownController.players.find(player => player.id === playerID);
    assert(p);
    return p;
  });
});
const area: ShopArea = { items: [], id: nanoid(), x: 0, y: 0 };
describe('properties of a new shop', () => {
  it('should have an id', () => {
    const shop = new ShopAreaController(area);
    expect(shop.id).toBeTruthy();
  });
  it('should have a friendly name', () => {
    const shop = new ShopAreaController(area);
    expect(shop.friendlyName).toBeTruthy();
  });
  it('should have no shop items', () => {
    const shop = new ShopAreaController(area);
    expect(shop.shopItems).toHaveLength(0);
  });
  it('should be inactive', () => {
    const shop = new ShopAreaController(area);
    expect(shop.isActive()).toBe(false);
  });
});
