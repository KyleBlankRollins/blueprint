/**
 * JSX type declarations for Blueprint components.
 *
 * This file augments global JSX namespaces so that Blueprint custom elements
 * have proper IntelliSense in JSX/TSX environments (Astro, React, Solid, etc.).
 *
 * For HTML environments, the HTMLElementTagNameMap declarations in each
 * component file provide type information.
 *
 * ⚠️  AUTO-GENERATED — DO NOT EDIT
 * Run `npx bp generate jsx` to regenerate from component source files.
 */

import type { AccordionVariant } from './components/accordion/accordion.js';
import type { AlertVariant } from './components/alert/alert.js';
import type {
  AvatarShape,
  AvatarSize,
  AvatarStatus,
} from './components/avatar/avatar.js';
import type {
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbSize,
} from './components/breadcrumb/breadcrumb.js';
import type { ButtonSize, ButtonVariant } from './components/button/button.js';
import type { CardDirection, CardVariant } from './components/card/card.js';
import type { CheckboxSize } from './components/checkbox/checkbox.js';
import type { CodeBlockHighlightAdapter } from './components/code-block/code-block.js';
import type { ColorPickerSize } from './components/color-picker/color-picker.js';
import type {
  ComboboxSize,
  ComboboxVariant,
} from './components/combobox/combobox.js';
import type { DatePickerSize } from './components/date-picker/date-picker.js';
import type {
  DividerColor,
  DividerOrientation,
  DividerSpacing,
  DividerVariant,
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
import type { IconColor, IconSize } from './components/icon/icon.js';
import type { IconName } from './components/icon/icons/icon-name.generated.js';
import type {
  AutocompleteType,
  InputModeType,
  InputSize,
  InputType,
  InputVariant,
} from './components/input/input.js';
import type {
  LinkSize,
  LinkUnderline,
  LinkVariant,
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
  ProgressSize,
  ProgressVariant,
} from './components/progress/progress.js';
import type { RadioSize } from './components/radio/radio.js';
import type { SelectSize } from './components/select/select.js';
import type { SliderSize } from './components/slider/slider.js';
import type {
  SpinnerSize,
  SpinnerVariant,
} from './components/spinner/spinner.js';
import type {
  Step,
  StepperOrientation,
  StepperSize,
} from './components/stepper/stepper.js';
import type { SwitchSize } from './components/switch/switch.js';
import type {
  TableColumn,
  TableRow,
  TableSize,
  TableSortState,
  TableVariant,
} from './components/table/table.js';
import type {
  TabItem,
  TabsPlacement,
  TabsSize,
  TabsVariant,
} from './components/tabs/tabs.js';
import type {
  TextAlign,
  TextElement,
  TextLineHeight,
  TextSize,
  TextTracking,
  TextTransform,
  TextVariant,
  TextWeight,
} from './components/text/text.js';
import type {
  TextareaAutocomplete,
  TextareaResize,
  TextareaSize,
  TextareaVariant,
} from './components/textarea/textarea.js';
import type {
  TimeFormat,
  TimePickerSize,
} from './components/time-picker/time-picker.js';
import type { TooltipPlacement } from './components/tooltip/tooltip.js';
import type { TreeNode } from './components/tree/tree.js';

interface BaseHTMLAttributes {
  id?: string;
  class?: string;
  style?: string;
  slot?: string;
  hidden?: boolean;
  title?: string;
  children?: unknown;
  onclick?: string | ((event: MouseEvent) => void);
  onchange?: string | ((event: Event) => void);
  oninput?: string | ((event: Event) => void);
  onfocus?: string | ((event: FocusEvent) => void);
  onblur?: string | ((event: FocusEvent) => void);
  onkeydown?: string | ((event: KeyboardEvent) => void);
  onkeyup?: string | ((event: KeyboardEvent) => void);
  onsubmit?: string | ((event: Event) => void);
}

type StringAttr<T extends string> = T | (string & {});
type BooleanAttr = boolean | 'true' | 'false' | '';
type NumberAttr<T extends number = number> = T | `${number}`;

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
  size?: StringAttr<BreadcrumbSize>;
  separator?: StringAttr<BreadcrumbSeparator>;
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
  required?: BooleanAttr;
  name?: string;
  value?: string;
  size?: StringAttr<CheckboxSize>;
  error?: BooleanAttr;
}

interface BpCodeBlockProps extends BaseHTMLAttributes {
  code?: string;
  language?: string;
  showLineNumbers?: BooleanAttr;
  highlightLines?: number[];
  wrapLines?: BooleanAttr;
  showCopyButton?: BooleanAttr;
  maxLines?: NumberAttr;
  showHeader?: BooleanAttr;
  highlightAdapter?: CodeBlockHighlightAdapter;
}

interface BpColorPickerProps extends BaseHTMLAttributes {
  value?: string;
  format?: string;
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
  placement?: StringAttr<
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'right'
  >;
  closeOnClickOutside?: BooleanAttr;
  closeOnEscape?: BooleanAttr;
  closeOnSelect?: BooleanAttr;
  disabled?: BooleanAttr;
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
  maxSize?: NumberAttr;
  maxFiles?: NumberAttr;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  variant?: StringAttr<'default' | 'success' | 'error' | 'warning'>;
  message?: string;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
  showPreviews?: BooleanAttr;
}

interface BpHeadingProps extends BaseHTMLAttributes {
  level?: NumberAttr<HeadingLevel>;
  size?: StringAttr<HeadingSize>;
  weight?: StringAttr<HeadingWeight>;
}

interface BpIconProps extends BaseHTMLAttributes {
  name?: StringAttr<IconName | ''>;
  size?: StringAttr<IconSize>;
  color?: StringAttr<IconColor>;
  ariaLabel?: string;
}

interface BpInputProps extends BaseHTMLAttributes {
  variant?: StringAttr<InputVariant>;
  size?: StringAttr<InputSize>;
  type?: StringAttr<InputType>;
  value?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  readonly?: BooleanAttr;
  name?: string;
  autocomplete?: StringAttr<AutocompleteType>;
  minlength?: NumberAttr;
  maxlength?: NumberAttr;
  pattern?: string;
  step?: NumberAttr;
  min?: NumberAttr;
  max?: NumberAttr;
  inputmode?: StringAttr<InputModeType>;
}

interface BpLinkProps extends BaseHTMLAttributes {
  href?: string;
  target?: string;
  rel?: string;
  variant?: StringAttr<LinkVariant>;
  underline?: StringAttr<LinkUnderline>;
  size?: StringAttr<LinkSize>;
  disabled?: BooleanAttr;
}

interface BpMenuProps extends BaseHTMLAttributes {
  size?: StringAttr<MenuSize>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BpMenuDividerProps extends BaseHTMLAttributes {}

interface BpMenuItemProps extends BaseHTMLAttributes {
  value?: string;
  disabled?: BooleanAttr;
  selected?: BooleanAttr;
  hasSubmenu?: BooleanAttr;
  size?: StringAttr<MenuSize>;
  shortcut?: string;
}

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
  duration?: NumberAttr;
  title?: string;
  message?: string;
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
  value?: number | null;
  min?: NumberAttr;
  max?: NumberAttr;
  step?: NumberAttr;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  readonly?: BooleanAttr;
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
  showValue?: BooleanAttr;
  indeterminate?: BooleanAttr;
}

interface BpRadioProps extends BaseHTMLAttributes {
  checked?: BooleanAttr;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  name?: string;
  value?: string;
  size?: StringAttr<RadioSize>;
  error?: BooleanAttr;
}

interface BpSelectProps extends BaseHTMLAttributes {
  value?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: BooleanAttr;
  required?: BooleanAttr;
  size?: StringAttr<SelectSize>;
}

interface BpSkeletonProps extends BaseHTMLAttributes {
  variant?: StringAttr<'text' | 'circular' | 'rectangular' | 'rounded'>;
  width?: string;
  height?: string;
  animated?: BooleanAttr;
  lines?: NumberAttr;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
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
  required?: BooleanAttr;
  name?: string;
  value?: string;
  size?: StringAttr<SwitchSize>;
  error?: BooleanAttr;
}

interface BpTabPanelProps extends BaseHTMLAttributes {
  tabId?: string;
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
  as?: StringAttr<TextElement>;
  size?: StringAttr<TextSize>;
  weight?: StringAttr<TextWeight>;
  variant?: StringAttr<TextVariant>;
  align?: StringAttr<TextAlign>;
  transform?: StringAttr<TextTransform>;
  tracking?: StringAttr<TextTracking>;
  lineHeight?: StringAttr<TextLineHeight>;
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
  required?: BooleanAttr;
  readonly?: BooleanAttr;
  name?: string;
  rows?: NumberAttr;
  cols?: NumberAttr;
  maxlength?: NumberAttr;
  minlength?: NumberAttr;
  resize?: StringAttr<TextareaResize>;
  autocomplete?: StringAttr<TextareaAutocomplete>;
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
  multiSelect?: BooleanAttr;
  showLines?: BooleanAttr;
  selectable?: BooleanAttr;
  size?: StringAttr<'sm' | 'md' | 'lg'>;
}

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
  'bp-code-block': BpCodeBlockProps;
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
  'bp-menu-divider': BpMenuDividerProps;
  'bp-menu-item': BpMenuItemProps;
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
  'bp-tab-panel': BpTabPanelProps;
  'bp-table': BpTableProps;
  'bp-tabs': BpTabsProps;
  'bp-tag': BpTagProps;
  'bp-text': BpTextProps;
  'bp-textarea': BpTextareaProps;
  'bp-time-picker': BpTimePickerProps;
  'bp-tooltip': BpTooltipProps;
  'bp-tree': BpTreeProps;
}

declare global {
  namespace astroHTML.JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends BlueprintElements {}
  }
}

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends BlueprintElements {}
  }
}

declare module 'solid-js' {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends BlueprintElements {}
  }
}

export {};
