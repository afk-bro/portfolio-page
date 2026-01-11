// lib/interactive-hero/channelLocks.ts
import { ChannelLockType } from "./types";
import type { ChannelId, ChannelLock, ChannelLockTypeValue } from "./types";

export interface ChannelLockManager {
  locks: ChannelLock[];
}

export function createChannelLockManager(): ChannelLockManager {
  return { locks: [] };
}

function getChannelBase(channel: ChannelId): string {
  // Extract base channel (e.g., 'letters' from 'letters:soft')
  return channel.split(":")[0];
}

function cleanExpiredLocks(manager: ChannelLockManager): void {
  const now = performance.now();
  manager.locks = manager.locks.filter((lock) => lock.expiresAt > now);
}

export function getActiveLocks(manager: ChannelLockManager): ChannelLock[] {
  cleanExpiredLocks(manager);
  return [...manager.locks];
}

export function canAcquireLock(
  manager: ChannelLockManager,
  channel: ChannelId,
  type: ChannelLockTypeValue,
): boolean {
  cleanExpiredLocks(manager);
  const channelBase = getChannelBase(channel);

  // Find locks on the same channel base
  const conflictingLocks = manager.locks.filter(
    (lock) => getChannelBase(lock.channel) === channelBase,
  );

  if (conflictingLocks.length === 0) return true;

  // Hard lock blocks everything
  if (type === ChannelLockType.Hard) return false;

  // Check if any existing lock blocks us
  for (const lock of conflictingLocks) {
    // Hard lock blocks all
    if (lock.type === ChannelLockType.Hard) return false;

    // Transform-soft blocks other transform-soft
    if (
      type === ChannelLockType.TransformSoft &&
      lock.type === ChannelLockType.TransformSoft
    ) {
      return false;
    }
  }

  // Soft can coexist with soft and transform-soft
  return true;
}

export function acquireLock(
  manager: ChannelLockManager,
  channel: ChannelId,
  type: ChannelLockTypeValue,
  effectId: string,
  duration: number,
): ChannelLock | null {
  if (!canAcquireLock(manager, channel, type)) {
    return null;
  }

  const lock: ChannelLock = {
    channel,
    type,
    effectId,
    expiresAt: performance.now() + duration,
  };

  manager.locks.push(lock);
  return lock;
}

export function releaseLock(
  manager: ChannelLockManager,
  effectId: string,
): void {
  manager.locks = manager.locks.filter((lock) => lock.effectId !== effectId);
}

export function releaseAllLocks(manager: ChannelLockManager): void {
  manager.locks = [];
}
