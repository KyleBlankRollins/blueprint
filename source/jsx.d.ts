/**
 * JSX type declarations for Blueprint components.
 *
 * This file augments global JSX namespaces so that Blueprint custom elements
 * have proper IntelliSense in JSX/TSX environments (Astro, React, Solid, etc.).
 *
 * For HTML environments, the HTMLElementTagNameMap declarations in each
 * component file provide type information.
 */

// Import component types for type references
import type { AlertVariant } from './components/alert/alert.js';
import type {
  AvatarSize,
  AvatarShape,
  AvatarStatus,
} from './components/avatar/avatar.js';
import type { ButtonVariant, ButtonSize } from './components/button/button.js';
import type { CardVariant } from './components/card/card.js';
import type {
  ComboboxOption,
  ComboboxSize,
  ComboboxVariant,
} from './components/combobox/combobox.js';
import type { DatePickerSize } from './components/date-picker/date-picker.js';
import type {
  DividerOrientation,
  DividerSpacing,
  DividerVariant,
  DividerColor,
  DividerWeight,
} from './components/divider/divider.js';
import type {
  DrawerPlacement,
  DrawerSize,
} from './components/drawer/drawer.js';
import type {
  HeadingLevel,
  HeadingSize,
  HeadingWeight,
} from './components/heading/heading.js';
import type { IconName, IconSize, IconColor } from './components/icon/icon.js';
import type { InputSize } from './components/input/input.js';
import type {
  LinkVariant,
  LinkUnderline,
  LinkSize,
} from './components/link/link.js';
import type { MenuSize } from './components/menu/menu.js';
import type { ModalSize } from './components/modal/modal.js';
import type {
  MultiSelectOption,
  MultiSelectSize,
  MultiSelectVariant,
} from './components/multi-select/multi-select.js';
import type {
  PopoverPlacement,
  PopoverTrigger,
} from './components/popover/popover.js';
import type {
  ProgressVariant,
  ProgressSize,
} from './components/progress/progress.js';
import type { SelectSize } from './components/select/select.js';
import type { NumberInputSize } from './components/number-input/number-input.js';
import type { SliderSize } from './components/slider/slider.js';
import type {
  SpinnerSize,
  SpinnerVariant,
} from './components/spinner/spinner.js';
import type {
  TabsSize,
  TabsVariant,
  TabsPlacement,
  TabItem,
} from './components/tabs/tabs.js';
import type { SwitchSize } from './components/switch/switch.js';
import type { TextSize, TextWeight } from './components/text/text.js';
import type {
  TimePickerSize,
  TimeFormat,
} from './components/time-picker/time-picker.js';
import type { TooltipPlacement } from './components/tooltip/tooltip.js';

/**
 * Common HTML attributes that all custom elements accept.
 * These are the standard HTML attributes, not component-specific props.
 */
interface BaseHTMLAttributes {
  id?: string;
  class?: string;
  style?: string;
  slot?: string;
  hidden?: boolean;
  title?: string;
  children?: unknown;
  // Event handlers (common ones)
  onclick?: string | ((event: MouseEvent) => void);
  onchange?: string | ((event: Event) => void);
  oninput?: string | ((event: Event) => void);
  onfocus?: string | ((event: FocusEvent) => void);
  onblur?: string | ((event: FocusEvent) => void);
  onkeydown?: string | ((event: KeyboardEvent) => void);
  onkeyup?: string | ((event: KeyboardEvent) => void);
  onsubmit?: string | ((event: Event) => void);
}

/**
 * Helper to make string literal types also accept any string.
 * Useful for attributes like size="small" where the string is passed as-is.
 */
type StringAttr<T extends string> = T | (string & {});

/**
 * Helper for boolean attributes (can be true/false or empty string for HTML boolean attrs).
 */
type BooleanAttr = boolean | 'true' | 'false' | '';

/**
 * Helper for number attributes passed as strings in HTML.
 */
type NumberAttr<T extends number = number> = T | `${number}`;

// =============================================================================
// Component Prop Interfaces
// =============================================================================

interface BpAccordionProps extends BaseHTMLAttributes {
  multiple?: BooleanAttr;
  bordered?: BooleanAttr;
}

interface BpAlertProps extends BaseHTMLAttributes {
  variant?: StringAttr<AlertVariant>;
  dismissible?: BooleanAttr;
  icon?: string;
}

interface BpAvatarProps extends BaseHTMLAttributes {
  src?: string;
  alt?: string;
  initials?: string;
  size?: StringAttr<AvatarSize>;
  shape?: StringAttr<AvatarShape>;
  status?: StringAttr<AvatarStatus>;
}

interface BpBadgeProps extends BaseHTMLAttributes {
  variant?: StringAttr<
    'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  >;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
  pill?: BooleanAttr;
  dot?: BooleanAttr;
}

interface BpBreadcrumbProps extends BaseHTMLAttributes {
  separator?: string;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
}

interface BpBreadcrumbItemProps extends BaseHTMLAttributes {
  href?: string;
  current?: BooleanAttr;
}

interface BpButtonProps extends BaseHTMLAttributes {
  variant?: StringAttr<ButtonVariant>;
  size?: StringAttr<ButtonSize>;
  disabled?: BooleanAttr;
  type?: StringAttr<'button' | 'submit' | 'reset'>;
  loading?: BooleanAttr;
  fullWidth?: BooleanAttr;
}

interface BpCardProps extends BaseHTMLAttributes {
  variant?: StringAttr<CardVariant>;
  hoverable?: BooleanAttr;
  clickable?: BooleanAttr;
  noPadding?: BooleanAttr;
}

interface BpCheckboxProps extends BaseHTMLAttributes {
  checked?: BooleanAttr;
  indeterminate?: BooleanAttr;
  disabled?: BooleanAttr;
  name?: string;
  value?: string;
  required?: BooleanAttr;
  label?: string;
}

interface BpColorPickerProps extends BaseHTMLAttributes {
  value?: string;
  disabled?: BooleanAttr;
  format?: StringAttr<'hex' | 'rgb' | 'hsl'>;
}

interface BpComboboxProps extends BaseHTMLAttributes {
  value?: string;
  options?: ComboboxOption[];
  placeholder?: string;
  disabled?: BooleanAttr;
  size?: StringAttr<ComboboxSize>;
  variant?: StringAttr<ComboboxVariant>;
  multiple?: BooleanAttr;
}

interface BpDatePickerProps extends BaseHTMLAttributes {
  value?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  size?: StringAttr<DatePickerSize>;
  min?: string;
  max?: string;
  format?: string;
}

interface BpDividerProps extends BaseHTMLAttributes {
  orientation?: StringAttr<DividerOrientation>;
  spacing?: StringAttr<DividerSpacing>;
  variant?: StringAttr<DividerVariant>;
  color?: StringAttr<DividerColor>;
  weight?: StringAttr<DividerWeight>;
}

interface BpDrawerProps extends BaseHTMLAttributes {
  open?: BooleanAttr;
  placement?: StringAttr<DrawerPlacement>;
  size?: StringAttr<DrawerSize>;
  header?: string;
  closable?: BooleanAttr;
  modal?: BooleanAttr;
}

interface BpDropdownProps extends BaseHTMLAttributes {
  open?: BooleanAttr;
  trigger?: StringAttr<'click' | 'hover'>;
  placement?: string;
  disabled?: BooleanAttr;
}

interface BpFileUploadProps extends BaseHTMLAttributes {
  accept?: string;
  multiple?: BooleanAttr;
  disabled?: BooleanAttr;
  maxSize?: NumberAttr;
  maxFiles?: NumberAttr;
}

interface BpHeadingProps extends BaseHTMLAttributes {
  level?: NumberAttr<HeadingLevel>;
  size?: StringAttr<HeadingSize>;
  weight?: StringAttr<HeadingWeight>;
}

interface BpIconProps extends BaseHTMLAttributes {
  name?: StringAttr<IconName> | (string & {});
  size?: StringAttr<IconSize>;
  color?: StringAttr<IconColor>;
  label?: string;
}

interface BpInputProps extends BaseHTMLAttributes {
  type?: StringAttr<
    'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  >;
  value?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  readonly?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<InputSize>;
  name?: string;
  autocomplete?: string;
  pattern?: string;
  minlength?: NumberAttr;
  maxlength?: NumberAttr;
  min?: string;
  max?: string;
  step?: string;
}

interface BpLinkProps extends BaseHTMLAttributes {
  href?: string;
  target?: StringAttr<'_self' | '_blank' | '_parent' | '_top'>;
  rel?: string;
  variant?: StringAttr<LinkVariant>;
  underline?: StringAttr<LinkUnderline>;
  size?: StringAttr<LinkSize>;
  disabled?: BooleanAttr;
}

interface BpMenuProps extends BaseHTMLAttributes {
  size?: StringAttr<MenuSize>;
}

interface BpModalProps extends BaseHTMLAttributes {
  open?: BooleanAttr;
  size?: StringAttr<ModalSize>;
  header?: string;
  closable?: BooleanAttr;
  closeOnOverlayClick?: BooleanAttr;
  closeOnEscape?: BooleanAttr;
}

interface BpMultiSelectProps extends BaseHTMLAttributes {
  value?: string[];
  options?: MultiSelectOption[];
  placeholder?: string;
  disabled?: BooleanAttr;
  size?: StringAttr<MultiSelectSize>;
  variant?: StringAttr<MultiSelectVariant>;
}

interface BpNotificationProps extends BaseHTMLAttributes {
  variant?: StringAttr<'info' | 'success' | 'warning' | 'error'>;
  title?: string;
  message?: string;
  dismissible?: BooleanAttr;
  duration?: NumberAttr;
}

interface BpNumberInputProps extends BaseHTMLAttributes {
  value?: NumberAttr;
  min?: NumberAttr;
  max?: NumberAttr;
  step?: NumberAttr;
  placeholder?: string;
  disabled?: BooleanAttr;
  readonly?: BooleanAttr;
  size?: StringAttr<NumberInputSize>;
}

interface BpPaginationProps extends BaseHTMLAttributes {
  total?: NumberAttr;
  current?: NumberAttr;
  pageSize?: NumberAttr;
  showFirstLast?: BooleanAttr;
}

interface BpPopoverProps extends BaseHTMLAttributes {
  open?: BooleanAttr;
  placement?: StringAttr<PopoverPlacement>;
  trigger?: StringAttr<PopoverTrigger>;
  offset?: NumberAttr;
}

interface BpProgressProps extends BaseHTMLAttributes {
  value?: NumberAttr;
  max?: NumberAttr;
  variant?: StringAttr<ProgressVariant>;
  size?: StringAttr<ProgressSize>;
  indeterminate?: BooleanAttr;
  showValue?: BooleanAttr;
}

interface BpRadioProps extends BaseHTMLAttributes {
  checked?: BooleanAttr;
  disabled?: BooleanAttr;
  name?: string;
  value?: string;
  required?: BooleanAttr;
  label?: string;
}

interface BpSelectProps extends BaseHTMLAttributes {
  value?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<SelectSize>;
  name?: string;
}

interface BpSkeletonProps extends BaseHTMLAttributes {
  variant?: StringAttr<'text' | 'circular' | 'rectangular'>;
  width?: string;
  height?: string;
  animation?: StringAttr<'pulse' | 'wave' | 'none'>;
}

interface BpSliderProps extends BaseHTMLAttributes {
  value?: NumberAttr;
  min?: NumberAttr;
  max?: NumberAttr;
  step?: NumberAttr;
  disabled?: BooleanAttr;
  size?: StringAttr<SliderSize>;
  showValue?: BooleanAttr;
}

interface BpSpinnerProps extends BaseHTMLAttributes {
  size?: StringAttr<SpinnerSize>;
  variant?: StringAttr<SpinnerVariant>;
}

interface BpStepperProps extends BaseHTMLAttributes {
  activeStep?: NumberAttr;
  orientation?: StringAttr<'horizontal' | 'vertical'>;
  linear?: BooleanAttr;
}

interface BpSwitchProps extends BaseHTMLAttributes {
  checked?: BooleanAttr;
  disabled?: BooleanAttr;
  name?: string;
  value?: string;
  required?: BooleanAttr;
  size?: StringAttr<SwitchSize>;
  label?: string;
}

interface BpTableProps extends BaseHTMLAttributes {
  striped?: BooleanAttr;
  hoverable?: BooleanAttr;
  bordered?: BooleanAttr;
  compact?: BooleanAttr;
}

interface BpTabsProps extends BaseHTMLAttributes {
  value?: string;
  size?: StringAttr<TabsSize>;
  variant?: StringAttr<TabsVariant>;
  placement?: StringAttr<TabsPlacement>;
  tabs?: TabItem[];
}

interface BpTabPanelProps extends BaseHTMLAttributes {
  value?: string;
  label?: string;
  disabled?: BooleanAttr;
  icon?: string;
}

interface BpTagProps extends BaseHTMLAttributes {
  variant?: StringAttr<
    'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  >;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
  removable?: BooleanAttr;
}

interface BpTextProps extends BaseHTMLAttributes {
  as?: StringAttr<'p' | 'span' | 'div'>;
  size?: StringAttr<TextSize>;
  weight?: StringAttr<TextWeight>;
  variant?: StringAttr<
    'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error'
  >;
  align?: StringAttr<'left' | 'center' | 'right' | 'justify'>;
  transform?: StringAttr<'none' | 'uppercase' | 'lowercase' | 'capitalize'>;
  tracking?: StringAttr<'tighter' | 'tight' | 'normal' | 'wide' | 'wider'>;
  'line-height'?: StringAttr<
    'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
  >;
  clamp?: NumberAttr;
  italic?: BooleanAttr;
  truncate?: BooleanAttr;
}

interface BpTextareaProps extends BaseHTMLAttributes {
  value?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  readonly?: BooleanAttr;
  required?: BooleanAttr;
  rows?: NumberAttr;
  cols?: NumberAttr;
  resize?: StringAttr<'none' | 'vertical' | 'horizontal' | 'both'>;
  name?: string;
  minlength?: NumberAttr;
  maxlength?: NumberAttr;
}

interface BpTimePickerProps extends BaseHTMLAttributes {
  value?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  size?: StringAttr<TimePickerSize>;
  format?: StringAttr<TimeFormat>;
  step?: NumberAttr;
}

interface BpTooltipProps extends BaseHTMLAttributes {
  content?: string;
  placement?: StringAttr<TooltipPlacement>;
  trigger?: StringAttr<'hover' | 'click' | 'focus'>;
  delay?: NumberAttr;
}

interface BpTreeProps extends BaseHTMLAttributes {
  selectable?: BooleanAttr;
  multiSelect?: BooleanAttr;
  checkable?: BooleanAttr;
  expandOnClick?: BooleanAttr;
}

// =============================================================================
// Blueprint Elements Map
// =============================================================================

/**
 * Blueprint component element definitions.
 * Maps custom element tag names to their prop types.
 */
export interface BlueprintElements {
  'bp-accordion': BpAccordionProps;
  'bp-alert': BpAlertProps;
  'bp-avatar': BpAvatarProps;
  'bp-badge': BpBadgeProps;
  'bp-breadcrumb': BpBreadcrumbProps;
  'bp-breadcrumb-item': BpBreadcrumbItemProps;
  'bp-button': BpButtonProps;
  'bp-card': BpCardProps;
  'bp-checkbox': BpCheckboxProps;
  'bp-color-picker': BpColorPickerProps;
  'bp-combobox': BpComboboxProps;
  'bp-date-picker': BpDatePickerProps;
  'bp-divider': BpDividerProps;
  'bp-drawer': BpDrawerProps;
  'bp-dropdown': BpDropdownProps;
  'bp-file-upload': BpFileUploadProps;
  'bp-heading': BpHeadingProps;
  'bp-icon': BpIconProps;
  'bp-input': BpInputProps;
  'bp-link': BpLinkProps;
  'bp-menu': BpMenuProps;
  'bp-modal': BpModalProps;
  'bp-multi-select': BpMultiSelectProps;
  'bp-notification': BpNotificationProps;
  'bp-number-input': BpNumberInputProps;
  'bp-pagination': BpPaginationProps;
  'bp-popover': BpPopoverProps;
  'bp-progress': BpProgressProps;
  'bp-radio': BpRadioProps;
  'bp-select': BpSelectProps;
  'bp-skeleton': BpSkeletonProps;
  'bp-slider': BpSliderProps;
  'bp-spinner': BpSpinnerProps;
  'bp-stepper': BpStepperProps;
  'bp-switch': BpSwitchProps;
  'bp-table': BpTableProps;
  'bp-tabs': BpTabsProps;
  'bp-tab-panel': BpTabPanelProps;
  'bp-tag': BpTagProps;
  'bp-text': BpTextProps;
  'bp-textarea': BpTextareaProps;
  'bp-time-picker': BpTimePickerProps;
  'bp-tooltip': BpTooltipProps;
  'bp-tree': BpTreeProps;
}

// =============================================================================
// Astro JSX Support
// =============================================================================
declare global {
  namespace astroHTML.JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends BlueprintElements {}
  }
}

// =============================================================================
// React JSX Support (for React 17+ with new JSX transform)
// =============================================================================
declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends BlueprintElements {}
  }
}

// =============================================================================
// Solid.js JSX Support
// =============================================================================
declare module 'solid-js' {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends BlueprintElements {}
  }
}

export {};
