'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminConfigState {
  isSlotClaimed: boolean;
  registeredAdminEmail: string | null;
  registeredAdminName: string | null;
  claimAdminSlot: (email: string, name: string) => boolean;
}

export const useAdminConfigStore = create<AdminConfigState>()(
  persist(
    (set, get) => ({
      // Initially false or checks if admin already registered
      isSlotClaimed: false,
      registeredAdminEmail: null,
      registeredAdminName: null,
      claimAdminSlot: (email: string, name: string) => {
        // Enforce strictly 1 slot: If already claimed, reject
        if (get().isSlotClaimed) {
          return false;
        }
        set({
          isSlotClaimed: true,
          registeredAdminEmail: email.trim().toLowerCase(),
          registeredAdminName: name.trim(),
        });
        return true;
      },
    }),
    {
      name: 'guna_admin_slot_config_v1',
    }
  )
);
