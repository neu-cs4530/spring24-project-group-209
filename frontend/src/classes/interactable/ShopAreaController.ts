import _ from 'lodash';
import { ShopArea as ShopAreaModel, ShopItem } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import InteractableAreaController, {
  BaseInteractableEventMap,
  SHOP_AREA_TYPE,
} from './InteractableAreaController';

export type ShopAreaEvents = BaseInteractableEventMap & {
  itemPurchased: (player: PlayerController, item: string) => void;
};

/**
 * This class is the base class for all game controllers. It is responsible for managing the
 * state of the game, and for sending commands to the server to update the state of the game.
 * It is also responsible for notifying the UI when the state of the game changes, by emitting events.
 */
export default class ShopAreaController extends InteractableAreaController<
  ShopAreaEvents,
  ShopAreaModel
> {
  private _model: ShopAreaModel;

  constructor(shopArea: ShopAreaModel) {
    super(shopArea.id);
    this._model = shopArea;
  }

  public get friendlyName(): string {
    return this.id;
  }

  public get shopItems(): ShopItem[] {
    return this._model.items;
  }

  public isActive(): boolean {
    return this.occupants.length > 0;
  }

  get type(): string {
    return SHOP_AREA_TYPE;
  }

  toInteractableAreaModel(): ShopAreaModel {
    return this._model;
  }

  protected _updateFrom(): void {}
}
