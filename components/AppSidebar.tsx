'use client';

import { 
  Settings2, 
  Table2, 
  BarChart3, 
  HelpCircle,
  ChevronRight,
  Calculator,
  Lock
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const items = [
  {
    title: 'Configuration',
    icon: Settings2,
    id: 'setup',
  },
  {
    title: 'Analyse',
    icon: Table2,
    id: 'analysis',
  },
  {
    title: 'Détails',
    icon: Calculator,
    id: 'details',
  },
  {
    title: 'Résultats',
    icon: BarChart3,
    id: 'results',
  },
];

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  lockedSections: {
    analysis: boolean;
    details: boolean;
    results: boolean;
  };
}

export function AppSidebar({ activeSection, onSectionChange, lockedSections }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-background/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">AHP Studio</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">INE-SIGL-1</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isLocked = lockedSections[item.id as keyof typeof lockedSections] ?? false;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => onSectionChange(item.id)}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200",
                        isLocked && "opacity-60 grayscale-[0.5]"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium flex items-center gap-2">
                        {item.title}
                        {isLocked && <Lock className="h-3 w-3 opacity-50" />}
                      </span>
                      {activeSection === item.id && (
                        <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Auteur</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="px-2 py-2 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Réalisé par</span>
                  <span className="text-xs font-semibold text-foreground/80">A. Jordan FOTSO</span>
                  <span className="text-[9px] text-muted-foreground">Mat: 22T2961</span>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="GitHub" asChild>
                  <a href="https://github.com/JordanFotso" target="_blank" rel="noreferrer">
                    <HelpCircle className="h-4 w-4" />
                    <span className="font-medium">GitHub</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
