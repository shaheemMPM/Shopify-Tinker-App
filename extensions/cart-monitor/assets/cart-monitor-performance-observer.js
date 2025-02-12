class CartMonitor {
  constructor(config = {}) {
    this.debug = config.debug || false;
    this.cartEndpoints = [
      "/cart/add.js",
      "/cart/add",
      "/cart/update.js",
      "/cart/update",
      "/cart/change.js",
      "/cart/change",
      "/cart/clear.js",
      "/cart/clear",
    ];

    // Initialize the network observer
    this.observer = null;
    this.isUnsupported = typeof window.PerformanceObserver === "undefined";

    this.initializeObserver();
    this.checkCartOnLoad();
    this.log("Cart monitor:performance-observer initialized");
  }

  log(...args) {
    if (this.debug) {
      console.log("🛒 CartMonitor:", ...args);
    }
  }

  async checkCartOnLoad() {
    try {
      const response = await fetch("/cart.js");
      const cartData = await response.json();

      if (cartData?.items?.length) {
        this.handleCartUpdate(cartData, "pageLoad");
      }
    } catch (error) {
      this.log("Error fetching cart on page load:", error);
    }
  }

  initializeObserver() {
    if (this.isUnsupported) {
      this.log(
        "PerformanceObserver isn't supported by this browser. Features may be affected",
      );
      return;
    }

    // Public method for manual cleanup if needed
    if (this.observer) {
      this.observer.disconnect();
    }

    // Create new observer
    this.observer = new PerformanceObserver((entries) => {
      let shouldUpdateCart = false;

      for (const entry of entries.getEntries()) {
        // Check if this is a cart-related request
        if (this.isCartEndpoint(entry.name)) {
          this.log("Detected cart request:", entry.name);
          shouldUpdateCart = true;
          break;
        }
      }

      if (shouldUpdateCart) {
        // Use requestAnimationFrame to batch multiple cart updates
        window.requestAnimationFrame(async () => {
          try {
            const response = await fetch("/cart.js");
            const cartData = await response.json();
            this.handleCartUpdate(cartData, "observer");
          } catch (error) {
            this.log("Error fetching cart data:", error);
          }
        });
      }
    });

    // Start observing network requests
    this.observer.observe({
      entryTypes: ["resource"],
    });
  }

  isCartEndpoint(url) {
    try {
      const urlObj = new URL(url, window.location.origin);
      return this.cartEndpoints.some((endpoint) =>
        urlObj.pathname.endsWith(endpoint),
      );
    } catch {
      return false;
    }
  }

  handleCartUpdate(cartData, source) {
    this.log(`Cart updated (via ${source}):`, cartData);

    const event = new CustomEvent("tinker:cart-update", {
      detail: {
        cart: cartData,
        timestamp: new Date().toISOString(),
        source,
      },
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}

export function initializeCartMonitor(config = {}) {
  window.TinkerCartMonitor = new CartMonitor(config);

  if (config.debug) {
    console.log("🛒 CartMonitor: Initialized with config:", config);

    // Debug event listener
    document.addEventListener("tinker:cart-update", (event) => {
      console.log("🛒 CartMonitor: Cart update event:", event.detail);
    });
  }

  return window.TinkerCartMonitor;
}
