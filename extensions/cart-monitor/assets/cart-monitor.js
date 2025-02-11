class CartMonitor {
  constructor(config = {}) {
    this.debug = config.debug || false;
    this.cartEndpoints = config.cartEndpoints || [
      "/cart/add.js",
      "/cart/update.js",
      "/cart/change.js",
      "/cart/clear.js",
    ];

    this.initializeInterceptors();
    this.log("Cart monitor initialized");
  }

  log(...args) {
    if (this.debug) {
      console.log("🛒 CartMonitor:", ...args);
    }
  }

  initializeInterceptors() {
    this.initializeXHRInterceptor();
    this.initializeFetchInterceptor();
  }

  initializeXHRInterceptor() {
    // Store original methods
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    const self = this;

    // Intercept XHR Open
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      // Store request data for later use
      this._cartMonitorData = { method, url };
      return originalXHROpen.apply(this, [method, url, ...args]);
    };

    // Intercept XHR Send
    XMLHttpRequest.prototype.send = function (data) {
      if (
        this._cartMonitorData &&
        self.isCartEndpoint(this._cartMonitorData.url)
      ) {
        self.log("Intercepted XHR cart request:", this._cartMonitorData);

        // Store the original onreadystatechange
        const originalStateChange = this.onreadystatechange;

        this.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300) {
              try {
                const cartData = JSON.parse(this.responseText);
                self.handleCartUpdate(cartData, "xhr");
              } catch (error) {
                self.log("Error processing XHR cart response:", error);
              }
            }
          }

          // Call original onreadystatechange if it exists
          if (originalStateChange) {
            originalStateChange.apply(this, arguments);
          }
        };
      }

      return originalXHRSend.apply(this, arguments);
    };
  }

  initializeFetchInterceptor() {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = async function (input, init) {
      const url = typeof input === "string" ? input : input.url;

      if (self.isCartEndpoint(url)) {
        self.log("Intercepted fetch cart request:", { url, init });

        try {
          // Make the original request
          const response = await originalFetch.apply(window, arguments);

          // Clone the response so we can read it multiple times
          const clone = response.clone();

          // Process the response if it's JSON
          if (
            response.headers.get("content-type")?.includes("application/json")
          ) {
            const cartData = await clone.json();
            self.handleCartUpdate(cartData, "fetch");
          }

          return response;
        } catch (error) {
          self.log("Error processing fetch cart response:", error);
          throw error; // Re-throw to not interrupt error handling
        }
      }

      // Pass through non-cart requests
      return originalFetch.apply(window, arguments);
    };
  }

  isCartEndpoint(url) {
    try {
      const urlObj = new URL(url, window.location.origin);
      return this.cartEndpoints.some(
        (endpoint) =>
          urlObj.pathname.endsWith(endpoint) ||
          urlObj.pathname.includes("/cart/add"),
      );
    } catch {
      return false;
    }
  }

  handleCartUpdate(cartData, source) {
    this.log(`Cart updated (via ${source}):`, cartData);

    // Dispatch custom event
    const event = new CustomEvent("tinker:cart-update", {
      detail: {
        cart: cartData,
        timestamp: new Date().toISOString(),
        source: source, // 'xhr' or 'fetch'
      },
      bubbles: true,
    });
    document.dispatchEvent(event);
  }
}

// Initialize function
export function initializeCartMonitor(config = {}) {
  window.TinkerCartMonitor = new CartMonitor(config);

  // Log initialization if debug is enabled
  if (config.debug) {
    console.log("🛒 CartMonitor: Initialized with config:", config);

    // Add debug event listener
    document.addEventListener("tinker:cart-update", (event) => {
      console.log("🛒 CartMonitor: Cart update event:", event.detail);
    });
  }

  return window.TinkerCartMonitor;
}
