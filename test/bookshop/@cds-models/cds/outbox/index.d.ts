// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../../_';

// entity 'Message'
export declare function _MessageAspect<TBase extends new (...args: any[]) => object>(
  Base: TBase,
): {
  new (...args: any[]): {
    ID?: __.Key<string>;
    timestamp?: __.CdsTimestamp | null;
    target?: string | null;
    msg?: string | null;
    attempts?: number | null;
    partition?: number | null;
    lastError?: string | null;
    lastAttemptTimestamp?: __.CdsTimestamp | null;
    status?: string | null;
    task?: string | null;
    appid?: string | null;
  } & InstanceType<TBase>;
  readonly kind: 'entity';
  readonly keys: __.KeysOf<Message>;
  readonly elements: __.ElementsOf<Message>;
  readonly actions: globalThis.Record<never, never>;
};
export class Message extends _MessageAspect(__.Entity) {}
export class Messages extends Array<Message> {
  $count?: number;
}
