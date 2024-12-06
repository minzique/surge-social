declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const RECAPTCHA_SCRIPT_URL = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;

class ReCaptchaV3 {
  private static instance: ReCaptchaV3;
  private siteKey: string;
  private scriptLoaded: boolean;
  private loadPromise: Promise<void> | null;

  private constructor(siteKey: string) {
    this.siteKey = siteKey;
    this.scriptLoaded = false;
    this.loadPromise = null;
  }

  // Get or initialize the ReCaptchaV3 instance
  public static getInstance(siteKey: string): ReCaptchaV3 {
    if (!this.instance) {
      this.instance = new ReCaptchaV3(siteKey);
    }
    return this.instance;
  }

  // Load the reCAPTCHA v3 script
  public loadScript(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    if (this.scriptLoaded || window.grecaptcha) {
      this.loadPromise = Promise.resolve();
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = RECAPTCHA_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.grecaptcha.ready(() => {
          this.scriptLoaded = true;
          resolve();
        });
      };
      script.onerror = () => {
        this.loadPromise = null;
        reject(new Error("Failed to load reCAPTCHA script"));
      };
      document.body.appendChild(script);
    });

    return this.loadPromise;
  }

  // Execute a reCAPTCHA action
  public async execute(action: string): Promise<string> {
    if (!this.scriptLoaded) {
      await this.loadScript();
    }

    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(this.siteKey, { action });
          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Check if ReCAPTCHA is ready
  public isReady(): boolean {
    return this.scriptLoaded;
  }
}

export default ReCaptchaV3;
