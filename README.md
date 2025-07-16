
# Popup Plugin

A flexible, TypeScript-based popup plugin that supports click-triggered and auto-open modals. It allows for both generated content and custom HTML templates.

---

## 📦 Features

- ✅ Trigger by click or automatically on page load
- ✅ Support for custom HTML templates
- ✅ Custom events: `beforeOpen`, `afterOpen`, `beforeClose`, `afterClose`
- ✅ Optional close buttons and title/content sections
- ✅ Session-based control to prevent auto-popup repetition

---

## 🚀 Getting Started

### 1. Import

You can import the class directly into your TypeScript or JavaScript project.

```
import { Popup } from './PluginPopup';
```

### 2. Include the HTML

Add the trigger and optional popup content template to your HTML:

```html
<!-- Trigger button -->
<a href="#" data-action="show-popup">Show popup</a>

<!-- Optional HTML template -->
<div data-item="content-popup" style="display: none;">
    <button class="popup__close" type="button" data-popup="close"></button>
    <div class="popup__title" data-popup="title">
        <h2>Auto open popup with HTML Content</h2>
    </div>
    <div class="popup__content" data-popup="content">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
    </div>
    <button class="popup__close-btn" type="button" data-popup="close">Close</button>
</div>
```

---

### 3. Initialize the Plugin

#### Click-Triggered Popup with Generated Content

```ts
const showPopupBtn = document.querySelector('[data-action="show-popup"]');

if (showPopupBtn) {
    const popupOnClick = new Popup({
        trigger: 'click',
        openBtn: showPopupBtn,
        title: 'Popup with generated content',
        content: 'Lorem ipsum dolor sit amet...',
        iconClose: true,
        btnClose: true,
        btnCloseContent: 'Close',
        isTemplate: false,
        template: null,
        customClass: '',
        onBeforeOpen() {
            console.log('before open click');
        },
        onAfterOpen() {
            console.log('after open click');
        },
        onBeforeClose() {
            console.log('before close click');
        },
        onAfterClose() {
            console.log('after close click');
        }
    });
}
```

#### Auto-Opened Popup Using HTML Template

```ts
const template = document.querySelector('[data-item="content-popup"]');

if (template) {
    const popupAutoOpen = new Popup({
        trigger: 'auto',
        openBtn: null,
        title: '',
        content: '',
        isTemplate: true,
        template: template,
        iconClose: false,
        btnClose: true,
        btnCloseContent: '',
        customClass: '',
        onBeforeOpen() {
            console.log('before open auto');
        },
        onAfterOpen() {
            console.log('after open auto');
        },
        onBeforeClose() {
            console.log('before close auto');
        },
        onAfterClose() {
            console.log('after close auto');
        }
    });
}
```

---

## ⚙️ Options

| Option            | Type                          | Description                                      |
|-------------------|-------------------------------|--------------------------------------------------|
| `trigger`         | `"click"` or `"auto"`         | Defines when the popup should open              |
| `openBtn`         | `Element \| null`             | The button that triggers the popup              |
| `title`           | `string`                      | Title text (used only when `isTemplate` is false) |
| `content`         | `string`                      | Content text (used only when `isTemplate` is false) |
| `isTemplate`      | `boolean`                     | Whether to use a custom HTML template           |
| `template`        | `Element \| null`             | HTML element used as the popup template         |
| `iconClose`       | `boolean`                     | Adds a close icon in top-right corner           |
| `btnClose`        | `boolean`                     | Adds a bottom close button                      |
| `btnCloseContent` | `string`                      | Text for the bottom close button                |
| `customClass`     | `string`                      | Additional class name(s) for styling the popup  |
| `onBeforeOpen`    | `function`                    | Callback before popup opens                     |
| `onAfterOpen`     | `function`                    | Callback after popup opens                      |
| `onBeforeClose`   | `function`                    | Callback before popup closes                    |
| `onAfterClose`    | `function`                    | Callback after popup closes                     |

---

## 📂 Events

These events are dispatched on the element used as trigger (`openBtn` or `template`):

- `beforeOpen`
- `afterOpen`
- `beforeClose`
- `afterClose`

Use `addEventListener` or the options' event handlers to respond to these events.

---

## 🎨 Styling

Add your custom styles classes:

```scss

$bg_content_color: #ffffff;
$content_color: #000000;
$btn_bg_color: #ffffff;
$btn_border_color: #000000;
$btn_text_color: #000000;

.popup {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  z-index: 9999;

  &__wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: $bg_content_color;
    color: $content_color;
    width: auto;
    height: auto;
    max-width: 90%;
    padding: 50px 30px 35px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
  }

  &__title {
    margin-bottom: 20px;
    width: 100%;

    h2 {
      font-size: 24px;
    }
  }

  &__content {
    margin-bottom: 30px;

    p {
      font-size: 16px;
    }
  }

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    z-index: 5;
    background-color: transparent;
    border: 0;
    padding: 0;

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background-image: url(close-popup.png);
    }
  }

  &__close-btn {
    background-color: $btn_bg_color;
    border: 1px solid $btn_border_color;
    color: $btn_text_color;
    padding: 10px 30px;
    margin: 0 auto;
    width: auto;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
}
```

---

## 🧠 Notes

- When using `trigger: 'auto'`, the popup won't appear again in the same session (due to `sessionStorage`).
- Templates must be valid HTML and hidden via `display: none` or similar.
- The plugin automatically removes previous popups before creating a new one.

