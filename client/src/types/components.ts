import { ReactNode } from 'react';
import { UserRole } from './index';

// ===============================================
// COMPONENT PROP TYPES
// ===============================================

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  icon?: ReactNode;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export interface EmptyStateProps extends BaseComponentProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ===============================================
// FORM COMPONENT TYPES
// ===============================================

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  icon?: ReactNode;
  autoComplete?: string;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  multiple?: boolean;
  searchable?: boolean;
}

export interface TextareaProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  indeterminate?: boolean;
}

export interface RadioProps extends BaseComponentProps {
  name: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
}

// ===============================================
// NAVIGATION COMPONENT TYPES
// ===============================================

export interface TabProps {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  badge?: number | string;
  icon?: ReactNode;
}

export interface TabsProps extends BaseComponentProps {
  tabs: TabProps[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  showHome?: boolean;
}

export interface MenuItemProps {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number | string;
  disabled?: boolean;
  children?: MenuItemProps[];
  requiredRole?: UserRole[];
}

export interface SidebarProps extends BaseComponentProps {
  items: MenuItemProps[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

// ===============================================
// TABLE COMPONENT TYPES
// ===============================================

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => ReactNode;
  className?: string;
}

export interface TableProps<T = any> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  selectable?: boolean;
  selectedRows?: T[];
  onRowSelect?: (rows: T[]) => void;
  onRowClick?: (row: T, index: number) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
}

// ===============================================
// GAME COMPONENT TYPES
// ===============================================

export interface GameFormatProps extends BaseComponentProps {
  format: string;
  quiz: any;
  sessionId: string;
  onGameComplete?: (results: any) => void;
  settings?: Record<string, any>;
}

export interface GameLobbyProps extends BaseComponentProps {
  sessionId: string;
  participants: any[];
  isHost: boolean;
  onStartGame?: () => void;
  onLeaveGame?: () => void;
}

export interface GameResultsProps extends BaseComponentProps {
  sessionId: string;
  results: any;
  onPlayAgain?: () => void;
  onBackToLobby?: () => void;
}

// ===============================================
// AI COMPONENT TYPES
// ===============================================

export interface AIGeneratorProps extends BaseComponentProps {
  type: 'quiz' | 'lesson' | 'rubric';
  onGenerate?: (content: any) => void;
  onError?: (error: string) => void;
  settings?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface ProgressIndicatorProps extends BaseComponentProps {
  steps: Array<{
    id: string;
    label: string;
    status: 'pending' | 'active' | 'completed' | 'error';
  }>;
  currentStep?: string;
}

// ===============================================
// DASHBOARD COMPONENT TYPES
// ===============================================

export interface StatsCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: ReactNode;
  loading?: boolean;
}

export interface ChartProps extends BaseComponentProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  data: any;
  options?: any;
  loading?: boolean;
  height?: number;
}

export interface CalendarProps extends BaseComponentProps {
  events: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
    type?: string;
    color?: string;
  }>;
  view?: 'month' | 'week' | 'day';
  onEventClick?: (event: any) => void;
  onDateClick?: (date: Date) => void;
} 