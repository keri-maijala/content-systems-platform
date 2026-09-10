'use client';

type Role = 'contributor' | 'domain_owner' | 'content_owner';

interface NavProps {
  role: Role;
  userName: string;
  activeDomains?: string[];
  activeView: string;
  onViewChange: (view: string) => void;
  onSignOut: () => void;
}

export default function Nav({ role, userName, activeDomains = [], activeView, onViewChange, onSignOut }: NavProps) {
  const navItems = [
    { id: 'agent', label: 'Agent', roles: ['contributor', 'domain_owner', 'content_owner'] },
    { id: 'requests', label: 'Requests', roles: ['contributor', 'domain_owner', 'content_owner'] },
    { id: 'logs', label: 'Logs', roles: ['domain_owner', 'content_owner'] },
    { id: 'domains', label: 'Domains', roles: ['domain_owner', 'content_owner'] },
    { id: 'admin', label: 'Admin', roles: ['content_owner'] },
  ];
