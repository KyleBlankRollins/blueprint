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
import type { AccordionVariant } from './components/accordion/accordion.js';
import type { AlertVariant } from './components/alert/alert.js';
import type {
  AvatarSize,
  AvatarShape,
  AvatarStatus,
} from './components/avatar/avatar.js';
// Badge does not export type aliases; variant and size are inlined below.
import type {
  BreadcrumbItem,
  BreadcrumbSize,
} from './components/breadcrumb/breadcrumb.js';
import type { ButtonVariant, ButtonSize } from './components/button/button.js';
import type { CardVariant, CardDirection } from './components/card/card.js';
import type { CheckboxSize } from './components/checkbox/checkbox.js';
import type { ColorPickerSize } from './components/color-picker/color-picker.js';
import type {
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
import type { IconSize, IconColor } from './components/icon/icon.js';
import type { IconName } from './components/icon/icons/registry.generated.js';
import type { InputSize, InputVariant } from './components/input/input.js';
import type {
  LinkVariant,
  LinkUnderline,
  LinkSize,
} from './components/link/link.js';
import type { MenuSize } from './components/menu/menu.js';
import type { ModalSize } from './components/modal/modal.js';
import type {
  MultiSelectSize,
  MultiSelectVariant,
} from './components/multi-select/multi-select.js';
import type {
  NumberInputSize,
  NumberInputVariant,
} from './components/number-input/number-input.js';
import type {
  PopoverPlacement,
  PopoverTrigger,
} from './components/popover/popover.js';
import type {
  ProgressVariant,
  ProgressSize,
} from './components/progress/progress.js';
import type { RadioSize } from './components/radio/radio.js';
import type { SelectSize } from './components/select/select.js';
import type { SliderSize } from './components/slider/slider.js';
import type {
  SpinnerSize,
  SpinnerVariant,
} from './components/spinner/spinner.js';
import type {
  StepperSize,
  StepperOrientation,
  Step,
} from './components/stepper/stepper.js';
import type { SwitchSize } from './components/switch/switch.js';
import type {
  TabsSize,
  TabsVariant,
  TabsPlacement,
  TabItem,
} from './components/tabs/tabs.js';
import type {
  TableVariant,
  TableSize,
  TableColumn,
  TableRow,
  TableSortState,
} from './components/table/table.js';
import type { TextSize, TextWeight } from './components/text/text.js';
import type {
  TextareaVariant,
  TextareaSize,
} from './components/textarea/textarea.js';
import type {
  TimePickerSize,
  TimeFormat,
} from './components/time-picker/time-picker.js';
import type { TooltipPlacement } from './components/tooltip/tooltip.js';
import type { TreeNode } from './components/tree/tree.js';

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
  variant?: StringAttr<AccordionVariant>;
  multiple?: BooleanAttr;
  expandedItems?: string[];
  disabled?: BooleanAttr;
}

interface BpAccordionItemProps extends BaseHTMLAttributes {
  itemId?: string;
  header?: string;
  expanded?: BooleanAttr;
  disabled?: BooleanAttr;
}

interface BpAlertProps extends BaseHTMLAttributes {
  variant?: StringAttr<AlertVariant>;
  dismissible?: BooleanAttr;
  showIcon?: BooleanAttr;
}

interface BpAvatarProps extends BaseHTMLAttributes {
  src?: string;
  alt?: string;
  initials?: string;
  size?: StringAttr<AvatarSize>;
  shape?: StringAttr<AvatarShape>;
  status?: StringAttr<AvatarStatus>;
  clickable?: BooleanAttr;
  name?: string;
}

interface BpBadgeProps extends BaseHTMLAttributes {
  variant?: StringAttr<
    'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral'
  >;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
  dot?: BooleanAttr;
}

interface BpBreadcrumbProps extends BaseHTMLAttributes {
  items?: BreadcrumbItem[];
  separator?: string;
  size?: StringAttr<BreadcrumbSize>;
  ariaLabel?: string;
  collapseOnMobile?: BooleanAttr;
  maxItems?: NumberAttr;
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
}

interface BpCardProps extends BaseHTMLAttributes {
  variant?: StringAttr<CardVariant>;
  hoverable?: BooleanAttr;
  clickable?: BooleanAttr;
  noPadding?: BooleanAttr;
  direction?: StringAttr<CardDirection>;
}

interface BpCheckboxProps extends BaseHTMLAttributes {
  checked?: BooleanAttr;
  indeterminate?: BooleanAttr;
  disabled?: BooleanAttr;
  name?: string;
  value?: string;
  required?: BooleanAttr;
  size?: StringAttr<CheckboxSize>;
  error?: BooleanAttr;
}

interface BpColorPickerProps extends BaseHTMLAttributes {
  value?: string;
  format?: StringAttr<'hex' | 'rgb' | 'hsl'>;
  alpha?: BooleanAttr;
  swatches?: string[];
  inline?: BooleanAttr;
  disabled?: BooleanAttr;
  readonly?: BooleanAttr;
  size?: StringAttr<ColorPickerSize>;
  label?: string;
  name?: string;
  placeholder?: string;
}

interface BpComboboxProps extends BaseHTMLAttributes {
  value?: string;
  name?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<ComboboxSize>;
  variant?: StringAttr<ComboboxVariant>;
  allowCustomValue?: BooleanAttr;
}

interface BpDatePickerProps extends BaseHTMLAttributes {
  value?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<DatePickerSize>;
  min?: string;
  max?: string;
  firstDayOfWeek?: StringAttr<'0' | '1'>;
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
  showClose?: BooleanAttr;
  closeOnBackdrop?: BooleanAttr;
  closeOnEscape?: BooleanAttr;
  showBackdrop?: BooleanAttr;
  label?: string;
  inline?: BooleanAttr;
}

interface BpDropdownProps extends BaseHTMLAttributes {
  open?: BooleanAttr;
  placement?: string;
  disabled?: BooleanAttr;
  closeOnClickOutside?: BooleanAttr;
  closeOnEscape?: BooleanAttr;
  closeOnSelect?: BooleanAttr;
  distance?: NumberAttr;
  arrow?: BooleanAttr;
  panelRole?: StringAttr<'menu' | 'dialog' | 'listbox'>;
}

interface BpFileUploadProps extends BaseHTMLAttributes {
  name?: string;
  label?: string;
  description?: string;
  accept?: string;
  multiple?: BooleanAttr;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  maxSize?: NumberAttr;
  maxFiles?: NumberAttr;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
  variant?: StringAttr<'default' | 'success' | 'error' | 'warning'>;
  message?: string;
  showPreviews?: BooleanAttr;
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
  ariaLabel?: string;
}

interface BpInputProps extends BaseHTMLAttributes {
  type?: StringAttr<
    'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  >;
  variant?: StringAttr<InputVariant>;
  value?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: BooleanAttr;
  readonly?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<InputSize>;
  name?: string;
  autocomplete?: string;
  pattern?: string;
  minlength?: NumberAttr;
  maxlength?: NumberAttr;
  min?: NumberAttr;
  max?: NumberAttr;
  step?: NumberAttr;
  inputmode?: StringAttr<
    'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  >;
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

interface BpMenuItemProps extends BaseHTMLAttributes {
  value?: string;
  disabled?: BooleanAttr;
  selected?: BooleanAttr;
  hasSubmenu?: BooleanAttr;
  size?: StringAttr<MenuSize>;
  shortcut?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BpMenuDividerProps extends BaseHTMLAttributes {}

interface BpModalProps extends BaseHTMLAttributes {
  open?: BooleanAttr;
  size?: StringAttr<ModalSize>;
  ariaLabelledby?: string;
}

interface BpMultiSelectProps extends BaseHTMLAttributes {
  value?: string[];
  name?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<MultiSelectSize>;
  variant?: StringAttr<MultiSelectVariant>;
  maxSelections?: NumberAttr;
  clearable?: BooleanAttr;
}

interface BpNotificationProps extends BaseHTMLAttributes {
  variant?: StringAttr<'info' | 'success' | 'warning' | 'error'>;
  open?: BooleanAttr;
  closable?: BooleanAttr;
  title?: string;
  message?: string;
  duration?: NumberAttr;
  position?: StringAttr<
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  >;
}

interface BpNumberInputProps extends BaseHTMLAttributes {
  value?: NumberAttr;
  min?: NumberAttr;
  max?: NumberAttr;
  step?: NumberAttr;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  readonly?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<NumberInputSize>;
  variant?: StringAttr<NumberInputVariant>;
  message?: string;
  precision?: NumberAttr;
  hideButtons?: BooleanAttr;
}

interface BpPaginationProps extends BaseHTMLAttributes {
  currentPage?: NumberAttr;
  totalPages?: NumberAttr;
  siblingCount?: NumberAttr;
  boundaryCount?: NumberAttr;
  showFirstLast?: BooleanAttr;
  showPrevNext?: BooleanAttr;
  showInfo?: BooleanAttr;
  disabled?: BooleanAttr;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
}

interface BpPopoverProps extends BaseHTMLAttributes {
  open?: BooleanAttr;
  placement?: StringAttr<PopoverPlacement>;
  trigger?: StringAttr<PopoverTrigger>;
  arrow?: BooleanAttr;
  showClose?: BooleanAttr;
  closeOnOutsideClick?: BooleanAttr;
  closeOnEscape?: BooleanAttr;
  distance?: NumberAttr;
  showDelay?: NumberAttr;
  hideDelay?: NumberAttr;
  disabled?: BooleanAttr;
  label?: string;
}

interface BpProgressProps extends BaseHTMLAttributes {
  value?: NumberAttr;
  max?: NumberAttr;
  variant?: StringAttr<ProgressVariant>;
  size?: StringAttr<ProgressSize>;
  label?: string;
  indeterminate?: BooleanAttr;
  showValue?: BooleanAttr;
}

interface BpRadioProps extends BaseHTMLAttributes {
  checked?: BooleanAttr;
  disabled?: BooleanAttr;
  name?: string;
  value?: string;
  required?: BooleanAttr;
  size?: StringAttr<RadioSize>;
  error?: BooleanAttr;
}

interface BpSelectProps extends BaseHTMLAttributes {
  value?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<SelectSize>;
  name?: string;
  label?: string;
}

interface BpSkeletonProps extends BaseHTMLAttributes {
  variant?: StringAttr<'text' | 'circular' | 'rectangular' | 'rounded'>;
  width?: string;
  height?: string;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
  animated?: BooleanAttr;
  lines?: NumberAttr;
}

interface BpSliderProps extends BaseHTMLAttributes {
  value?: NumberAttr;
  min?: NumberAttr;
  max?: NumberAttr;
  step?: NumberAttr;
  name?: string;
  label?: string;
  disabled?: BooleanAttr;
  size?: StringAttr<SliderSize>;
  showValue?: BooleanAttr;
  showTicks?: BooleanAttr;
}

interface BpSpinnerProps extends BaseHTMLAttributes {
  size?: StringAttr<SpinnerSize>;
  variant?: StringAttr<SpinnerVariant>;
  label?: string;
}

interface BpStepperProps extends BaseHTMLAttributes {
  steps?: Step[];
  currentStep?: NumberAttr;
  orientation?: StringAttr<StepperOrientation>;
  size?: StringAttr<StepperSize>;
  linear?: BooleanAttr;
  disabled?: BooleanAttr;
  hideLabels?: BooleanAttr;
  clickable?: BooleanAttr;
  showNavigation?: BooleanAttr;
}

interface BpSwitchProps extends BaseHTMLAttributes {
  checked?: BooleanAttr;
  disabled?: BooleanAttr;
  name?: string;
  value?: string;
  required?: BooleanAttr;
  size?: StringAttr<SwitchSize>;
  error?: BooleanAttr;
}

interface BpTableProps extends BaseHTMLAttributes {
  columns?: TableColumn[];
  rows?: TableRow[];
  variant?: StringAttr<TableVariant>;
  size?: StringAttr<TableSize>;
  selectable?: BooleanAttr;
  multiSelect?: BooleanAttr;
  selectedRows?: (string | number)[];
  sortState?: TableSortState | null;
  stickyHeader?: BooleanAttr;
  hoverable?: BooleanAttr;
  loading?: BooleanAttr;
}

interface BpTabsProps extends BaseHTMLAttributes {
  value?: string;
  tabs?: TabItem[];
  size?: StringAttr<TabsSize>;
  variant?: StringAttr<TabsVariant>;
  placement?: StringAttr<TabsPlacement>;
  disabled?: BooleanAttr;
  manual?: BooleanAttr;
}

interface BpTabPanelProps extends BaseHTMLAttributes {
  tabId?: string;
}

interface BpTagProps extends BaseHTMLAttributes {
  variant?: StringAttr<'solid' | 'outlined'>;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
  color?: StringAttr<
    'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral'
  >;
  removable?: BooleanAttr;
  disabled?: BooleanAttr;
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
  variant?: StringAttr<TextareaVariant>;
  size?: StringAttr<TextareaSize>;
  value?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: BooleanAttr;
  readonly?: BooleanAttr;
  required?: BooleanAttr;
  rows?: NumberAttr;
  cols?: NumberAttr;
  resize?: StringAttr<'none' | 'vertical' | 'horizontal' | 'both'>;
  name?: string;
  minlength?: NumberAttr;
  maxlength?: NumberAttr;
  autocomplete?: string;
  spellcheck?: BooleanAttr;
  wrap?: StringAttr<'soft' | 'hard'>;
}

interface BpTimePickerProps extends BaseHTMLAttributes {
  value?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<TimePickerSize>;
  format?: StringAttr<TimeFormat>;
  step?: NumberAttr;
}

interface BpTooltipProps extends BaseHTMLAttributes {
  content?: string;
  placement?: StringAttr<TooltipPlacement>;
  disabled?: BooleanAttr;
  delay?: NumberAttr;
}

interface BpTreeProps extends BaseHTMLAttributes {
  nodes?: TreeNode[];
  selectedId?: string | null;
  expandedIds?: string[];
  selectable?: BooleanAttr;
  multiSelect?: BooleanAttr;
  showLines?: BooleanAttr;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
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
  'bp-accordion-item': BpAccordionItemProps;
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
  'bp-menu-item': BpMenuItemProps;
  'bp-menu-divider': BpMenuDividerProps;
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
