import React, { useState } from 'react';
import { usePathname } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ChatButton from './ChatButton';
import ChatModal from './ChatModal';

/**
 * Mounts the AI assistant only where it belongs:
 *   • the signed-in user is a farmer or buyer (admins never see it), and
 *   • the current route is inside that role's area (/farmer/* or /buyer/*),
 *     so it never overlays the login, register or admin screens.
 *
 * Rendered once from the root layout, exactly like the previous ChatbotWidget.
 */
export default function AssistantHost() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Normalize role to ensure case-insensitivity
  const normalizedRole = user?.role ? user.role.toLowerCase().trim() : null;
  const role = normalizedRole === 'farmer' || normalizedRole === 'buyer' ? (normalizedRole as 'farmer' | 'buyer') : null;

  // Check if current route is within the user's role portal
  const currentPath = (pathname || '').toLowerCase();
  const inRoleArea =
    role !== null &&
    (currentPath.includes(`/${role}`) ||
      currentPath.includes(role) ||
      currentPath === '/' ||
      currentPath === '');

  if (!user || !role || !inRoleArea) return null;

  return (
    <>
      <ChatButton open={open} onPress={() => setOpen((v) => !v)} />
      <ChatModal visible={open} role={role} userName={user?.name} onClose={() => setOpen(false)} />
    </>
  );
}
