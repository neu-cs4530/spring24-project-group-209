import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import InvalidParametersError from '../lib/InvalidParametersError';
import {
  BoundingBox,
  InteractableCommand,
  InteractableCommandReturnType,
  TownEmitter,
  ShopArea as ShopAreaModel,
  ShopAreaUpdateCommand,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

export default class ShopArea extends InteractableArea {
  /**
   * Convert this ViewingArea instance to a simple ViewingAreaModel suitable for
   * transporting over a socket to a client.
   */
  public toModel(): ShopAreaModel {
    return {
      id: this.id,
      occupants: this.occupantsByID,
      items: ['SKIN1', 'SKIN2', 'SKIN3', 'SKIN4'],
      type: 'ShopArea',
    };
  }

  /**
   * Creates a new ShopArea object that will represent a Viewing Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this viewing area exists
   * @param townEmitter An emitter that can be used by this viewing area to broadcast updates to players in the town
   * @returns
   */
  public static fromMapObject(mapObject: ITiledMapObject, townEmitter: TownEmitter): ShopArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed shop area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new ShopArea(name, rect, townEmitter);
  }

  public handleCommand<CommandType extends InteractableCommand>(
    command: CommandType,
  ): InteractableCommandReturnType<CommandType> {
    if (command.type === 'ShopAreaUpdate') {
      const shopArea = command as ShopAreaUpdateCommand;
      this.updateModel(shopArea.update);
      return {} as InteractableCommandReturnType<CommandType>;
    }
    throw new InvalidParametersError('Unknown command type');
  }

  public updateModel(update: ShopAreaModel): void {}
}