# Notification Stack

A fixed screen region that shows `bp-notification` toasts one above another. Call `notify()` and the stack positions the notification, caps how many are visible at once (queuing the rest), and removes each one when it closes.

## Usage

Place one stack per page, usually at the end of `<body>`:

```html
<bp-notification-stack position="bottom-right"></bp-notification-stack>
```

Then show notifications from script:

```js
import { notify } from '@krollins/blueprint';

notify('Draft saved');

notify({
  variant: 'error',
  title: 'Upload failed',
  message: 'Failed to connect to server. Please try again.',
});
```

The `notify()` helper uses the first `bp-notification-stack` on the page, and creates one at the end of `<body>` if there is none. To target a specific stack, call its method instead:

```js
document.querySelector('bp-notification-stack').notify('Copied');
```

`notify()` returns the `bp-notification` element, so you can add an action or close it yourself:

```js
const n = notify({ message: 'Conversation archived.' });
const undo = document.createElement('bp-button');
undo.slot = 'action';
undo.textContent = 'Undo';
undo.addEventListener('bp-click', () => n.hide());
n.append(undo);
```

## API

### Properties

| Property   | Type                                                                                              | Default           | Description                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------- |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'`  | Where the stack sits on screen. Reflected.                                                    |
| `max`      | `number`                                                                                          | `3`               | Most notifications visible at once. The rest wait in a queue.                                 |
| `duration` | `number`                                                                                          | `5000`            | Default auto-dismiss time in ms for `notify()`. Errors ignore it. `0` turns auto-dismiss off. |
| `label`    | `string`                                                                                          | `'Notifications'` | Accessible name of the region.                                                                |
| `pending`  | `number` (read-only)                                                                              |                   | How many notifications are waiting in the queue.                                              |
| `visible`  | `BpNotification[]` (read-only)                                                                    |                   | The open notifications in the stack.                                                          |

### Methods

| Method            | Parameters                | Returns          | Description                                            |
| ----------------- | ------------------------- | ---------------- | ------------------------------------------------------ |
| `notify(options)` | `NotifyOptions \| string` | `BpNotification` | Show a notification, or queue it if the stack is full. |
| `clear()`         | None                      | `void`           | Close every notification and empty the queue.          |

`NotifyOptions`:

| Option     | Type                                          | Default                          | Description                            |
| ---------- | --------------------------------------------- | -------------------------------- | -------------------------------------- |
| `message`  | `string`                                      | `''`                             | Message text.                          |
| `title`    | `string`                                      | `''`                             | Optional bold title above the message. |
| `variant`  | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'`                         | Visual and semantic variant.           |
| `duration` | `number`                                      | stack `duration`; `0` for errors | Ms before it closes itself. `0` never. |
| `closable` | `boolean`                                     | `true`                           | Show a close button.                   |

The module also exports a standalone `notify(options)` function (see Usage).

### Events

| Event       | Detail                             | Description                                    |
| ----------- | ---------------------------------- | ---------------------------------------------- |
| `bp-notify` | `{ notification: BpNotification }` | A notification from `notify()` became visible. |

Each notification still fires its own `bp-show`, `bp-hide` and `bp-close`, which bubble through the stack.

### Slots

| Slot      | Description                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| (default) | `bp-notification` elements. Ones you add in markup are stacked too, but only hidden (not removed) when they close. |

### CSS Parts

| Part   | Description                                |
| ------ | ------------------------------------------ |
| `base` | The region that lays the notifications out |

## Behavior

- **Order.** The newest notification sits nearest the screen edge: at the bottom of a `bottom-*` stack and at the top of a `top-*` stack. DOM order matches what you see.
- **Queue.** Past `max`, new notifications wait and appear as others close. Raising `max` shows waiting ones at once.
- **Timing.** Notifications close after the stack's `duration` (5 seconds). Errors stay until the user dismisses them, so nobody misses a failure. Hovering or focusing a notification pauses its timer, and it resumes with the time that was left.
- **Clicks.** The empty part of the region lets clicks through to the page beneath.
- **Layering.** The stack sits at `--bp-z-popover` (1060), above modals, so a notification raised from a modal is still visible.

## Design Tokens Used

- `--bp-z-popover` - Stack layer
- `--bp-spacing-md` - Distance from the screen edge
- `--bp-spacing-sm` - Gap between notifications

## Accessibility

- The stack is a `region` landmark named by `label` ("Notifications").
- Info, success and warning notifications use `role="status"` and are announced politely. Errors use `role="alert"` and are announced at once.
- Stacked notifications never move focus, so a toast can't pull the user out of what they're doing. Escape closes a focused notification.
- Anything a notification offers (like Undo) should also be reachable some other way, because a timed notification may close before a keyboard or screen reader user gets to it.
