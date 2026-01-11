// lib/interactive-hero/__tests__/channelLocks.test.ts
import {
  createChannelLockManager,
  canAcquireLock,
  acquireLock,
  releaseLock,
  releaseAllLocks,
  getActiveLocks,
} from "../channelLocks";
import { ChannelLockType } from "../types";

describe("Channel Lock System", () => {
  let manager: ReturnType<typeof createChannelLockManager>;

  beforeEach(() => {
    manager = createChannelLockManager();
    jest.spyOn(performance, "now").mockReturnValue(1000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("canAcquireLock", () => {
    it("allows acquiring lock on empty channel", () => {
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(true);
    });

    it("blocks hard lock when channel has any lock", () => {
      acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(manager, "letters:hard", ChannelLockType.Hard),
      ).toBe(false);
    });

    it("allows soft lock when channel has soft lock", () => {
      acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(true);
    });

    it("blocks any lock when channel has hard lock", () => {
      acquireLock(
        manager,
        "letters:hard",
        ChannelLockType.Hard,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(false);
    });

    it("transform-soft blocks other transform-soft", () => {
      acquireLock(
        manager,
        "letters:transform-soft",
        ChannelLockType.TransformSoft,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(
          manager,
          "letters:transform-soft",
          ChannelLockType.TransformSoft,
        ),
      ).toBe(false);
    });

    it("transform-soft allows soft", () => {
      acquireLock(
        manager,
        "letters:transform-soft",
        ChannelLockType.TransformSoft,
        "effect-1",
        1000,
      );
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(true);
    });
  });

  describe("acquireLock", () => {
    it("adds lock to manager", () => {
      const lock = acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        500,
      );
      expect(lock).toBeDefined();
      expect(lock?.effectId).toBe("effect-1");
      expect(lock?.expiresAt).toBe(1500); // 1000 + 500
    });

    it("returns null if cannot acquire", () => {
      acquireLock(
        manager,
        "letters:hard",
        ChannelLockType.Hard,
        "effect-1",
        1000,
      );
      const lock = acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-2",
        500,
      );
      expect(lock).toBeNull();
    });
  });

  describe("releaseLock", () => {
    it("removes lock by effect id", () => {
      acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        1000,
      );
      releaseLock(manager, "effect-1");
      expect(getActiveLocks(manager)).toHaveLength(0);
    });
  });

  describe("releaseAllLocks", () => {
    it("clears all locks", () => {
      acquireLock(
        manager,
        "letters:soft",
        ChannelLockType.Soft,
        "effect-1",
        1000,
      );
      acquireLock(
        manager,
        "heroLighting:soft",
        ChannelLockType.Soft,
        "effect-2",
        1000,
      );
      releaseAllLocks(manager);
      expect(getActiveLocks(manager)).toHaveLength(0);
    });
  });

  describe("expired locks", () => {
    it("ignores expired locks when checking", () => {
      acquireLock(
        manager,
        "letters:hard",
        ChannelLockType.Hard,
        "effect-1",
        500,
      );
      // Advance time past expiry
      (performance.now as jest.Mock).mockReturnValue(2000);
      expect(
        canAcquireLock(manager, "letters:soft", ChannelLockType.Soft),
      ).toBe(true);
    });
  });
});
