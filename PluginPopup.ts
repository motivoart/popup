// Functionality to create popups

// Class to handle all functionalities on popup
class Popup {
    popup: HTMLElement | null = null
    popupWrapper: HTMLElement | null = null
    popupTitleWrapper: HTMLElement | null = null
    popupTitle: HTMLElement | null = null
    popupContentWrapper: HTMLElement | null = null
    popupContent: HTMLElement | null = null
    popupBtnClose: HTMLElement | null = null
    popupIconClose: HTMLElement | null = null
    events: string[] = ['beforeOpen', 'afterOpen', 'beforeClose', 'afterClose']
    element: Element

    constructor(private options: PopupOptions) {
        // define instance
        let el = <Element>this.popup

        if (this.options.trigger === 'click' && this.options.openBtn) {
            el = this.options.openBtn
        } else {
            if (this.options.trigger === 'auto' && this.options.template) {
                el = this.options.template
            }
        }

        this.element = el

        // init Custom evets
        this.initCustomEvent()

        // init
        this.init()
    }

    init() {
        if (this.options.trigger === 'click' && this.options.openBtn) {
            const openBtn = this.options.openBtn

            openBtn.addEventListener('click', (e) => {
                e.preventDefault()

                this.initPopup()
                // despatch event AfetrOpen
                this.element.dispatchEvent(
                    new CustomEvent('afterOpen', { bubbles: true }),
                )
            })
        } else {
            // Init if auto open version and popup not already closed
            if (!this.isActivePopup()) {
                this.initPopup()
                // despatch event AfetrOpen
                this.element.dispatchEvent(
                    new CustomEvent('afterOpen', { bubbles: true }),
                )
            }
        }
    }

    // Check popup status on sessionStoreage
    isActivePopup(): boolean {
        return sessionStorage.getItem('hide-popup') !== null && true
    }

    // Init popup
    initPopup() {
        // Create popup
        this.popup = this.createPopup()

        if (this.popup) {
            // despatch event BeforeOpen
            this.element.dispatchEvent(
                new CustomEvent('beforeOpen', { bubbles: true }),
            )

            if (this.options.isTemplate) {
                if (this.options.template) {
                    // Create popup wrapper

                    this.popupWrapper = this.createPopupWrapper(this.popup)

                    // Add user template
                    this.popupWrapper.innerHTML = this.options.template.innerHTML

                    // despatch event AfetrOpen
                    // this.element.dispatchEvent(new CustomEvent('afterOpen', { bubbles: true }));
                } else {
                    console.error('Popup Plugin Error: Template not found')
                }
            } else {
                // Create popup wrapper

                this.popupWrapper = this.createPopupWrapper(this.popup)

                // Add title
                this.createPopupTitle(this.popupWrapper)

                // Add content
                this.createPopupContent(this.popupWrapper)

                // Add close button (on bottom popup)
                this.createPopupBtnClose(this.popupWrapper)

                // despatch event AfetrOpen
                // this.element.dispatchEvent(new CustomEvent('afterOpen', { bubbles: true }));
            }

            /**
             * Init all default events
             */
            this.defaulteEventsHandler()

            // Add popup in to body
            document.body.appendChild(this.popup)
        }
    }

    initCustomEvent() {
        if (this.options.onBeforeOpen) {
            this.on('beforeOpen', this.options.onBeforeOpen)
        }

        if (this.options.onAfterOpen) {
            this.on('afterOpen', this.options.onAfterOpen)
        }

        if (this.options.onBeforeClose) {
            this.on('beforeClose', this.options.onBeforeClose)
        }

        if (this.options.onAfterClose) {
            this.on('afterClose', this.options.onAfterClose)
        }
    }

    removeCustomEvent() {
        if (this.options.onBeforeOpen) {
            this.element.removeEventListener(
                'beforeOpen',
                this.options.onBeforeOpen,
                true,
            )
        }

        if (this.options.onAfterOpen) {
            this.element.removeEventListener(
                'afterOpen',
                this.options.onAfterOpen,
                true,
            )
        }

        if (this.options.onBeforeClose) {
            this.element.removeEventListener(
                'afterOpen',
                this.options.onBeforeClose,
                true,
            )
        }

        if (this.options.onAfterClose) {
            this.element.removeEventListener(
                'afterClose',
                this.options.onAfterClose,
                true,
            )
        }
    }

    createPopup() {
        // Close all popups before create new
        this.close()

        // Create popup
        this.popup = document.createElement('div')
        this.popup.classList.add('popup')
        if (this.options.customClass) {
            this.popup.className += ` ${this.options.customClass}`
        }

        this.popup.setAttribute('data-popup', 'true')

        return this.popup
    }

    /**
     *  Function to create popup wrapper
     */
    createPopupWrapper(popup: HTMLElement) {
        // Create popup wrapper
        this.popupWrapper = document.createElement('div')
        this.popupWrapper.classList.add(`popup__wrapper`)
        this.popupWrapper.setAttribute('data-popup', 'wrapper')
        popup.appendChild(this.popupWrapper)

        // Add close button (top X icon)
        if (this.options.iconClose) {
            this.popupIconClose = document.createElement('button')
            this.popupIconClose.classList.add(`popup__close`)
            this.popupIconClose.setAttribute('type', 'button')
            this.popupIconClose.setAttribute('data-popup', 'close')
            this.popupWrapper.appendChild(this.popupIconClose)
        }

        return this.popupWrapper
    }

    /**
     *  Function to create popup title
     */
    createPopupTitle(popupWrapper: HTMLElement) {
        if (this.options.title) {
            this.popupTitleWrapper = document.createElement('div')
            this.popupTitleWrapper.classList.add(`popup__title`)
            this.popupTitleWrapper.setAttribute('data-popup', 'title')

            this.popupTitle = document.createElement('h2')
            this.popupTitle.innerHTML = this.options.title

            this.popupTitleWrapper.appendChild(this.popupTitle)
            popupWrapper.appendChild(this.popupTitleWrapper)
        }
    }

    /**
     *  Function to create popup content
     */
    createPopupContent(popupWrapper: HTMLElement) {
        if (this.options.content) {
            this.popupContentWrapper = document.createElement('div')
            this.popupContentWrapper.classList.add(`popup__content`)
            this.popupContentWrapper.setAttribute('data-popup', 'content')

            this.popupContent = document.createElement('p')
            this.popupContent.innerHTML = this.options.content

            this.popupContentWrapper.appendChild(this.popupContent)
            popupWrapper.appendChild(this.popupContentWrapper)
        }
    }

    /**
     *  Function to create popup close button
     */
    createPopupBtnClose(popupWrapper: HTMLElement) {
        if (this.options.btnClose) {
            this.popupBtnClose = document.createElement('button')
            this.popupBtnClose.classList.add(`popup__close-btn`)
            this.popupBtnClose.setAttribute('type', 'button')
            this.popupBtnClose.setAttribute('data-popup', 'close')
            this.popupBtnClose.innerHTML = this.options.btnCloseContent
            popupWrapper.appendChild(this.popupBtnClose)
        }
    }

    /**
     * Listen to all default events
     */
    defaulteEventsHandler() {
        const popup = this.popup

        if (popup) {
            // Init functionality to close popup when click button
            const closeButtons = popup.querySelectorAll(`[data-popup="close"]`)
            if (closeButtons.length > 0) {
                closeButtons.forEach((close) => {
                    close.addEventListener('click', () => {
                        this.close()
                    })
                })
            }

            // Init functionality to close popup when click outside
            popup.addEventListener('click', (e) => {
                if (popup === e.target) {
                    this.close()
                }
            })
        }
    }

    /**
     * Listen to all custom events
     */
    on(eventName: string, callback: EventListenerOrEventListenerObject): void {
        const event = this.events.find((e) => e === eventName)
        // console.log(this.element)
        // console.log(eventName)

        if (event) {
            this.element.addEventListener(eventName, callback)
        } else {
            console.error(`Popup Plugin Error: event ${eventName} does not exist.`)
        }

        // document.removeEventListener(eventName, callback)
    }

    /**
     *  Function to close all popups and remove it from body
     */
    close() {
        const isPopup = document.querySelectorAll(`[data-popup="true"]`)
        if (isPopup.length > 0) {
            isPopup.forEach((popup) => {
                // despatch event BeforeClose
                this.element.dispatchEvent(
                    new CustomEvent('beforeClose', { bubbles: true }),
                )

                popup.remove()

                // despatch event AfetrClose
                this.element.dispatchEvent(
                    new CustomEvent('afterClose', { bubbles: true }),
                )

                if (this.options.trigger === 'auto') {
                    // Set to sessionStorage
                    sessionStorage.setItem('hide-popup', 'true')
                }
            })

            this.removeCustomEvent()
        }
    }
}

export type PopupOptions = {
    trigger: string
    openBtn: Element | null
    title: string
    content: string
    isTemplate: boolean
    template: Element | null
    iconClose: boolean
    btnClose: boolean
    btnCloseContent: string
    customClass: string
    onBeforeOpen?: EventListenerOrEventListenerObject | null
    onAfterOpen?: EventListenerOrEventListenerObject | null
    onBeforeClose?: EventListenerOrEventListenerObject | null
    onAfterClose?: EventListenerOrEventListenerObject | null
}

export default Popup
