'use client';

interface ScriptOptions {
  async?: boolean;
  defer?: boolean;
  type?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
  id?: string;
}

export function loadScript(
  src: string,
  options: ScriptOptions = {}
): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Cannot load script on server side'));
      return;
    }

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve(existingScript as HTMLScriptElement);
      return;
    }

    const {
      async = true,
      defer = true,
      type = 'text/javascript',
      onLoad,
      onError,
      id,
    } = options;

    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    script.type = type;
    if (id) script.id = id;

    script.onload = () => {
      if (onLoad) onLoad();
      resolve(script);
    };

    script.onerror = (error) => {
      if (onError) onError(error as unknown as Error);
      reject(error);
    };

    const { strategy = 'afterInteractive' } = options;

    if (strategy === 'beforeInteractive') {
      document.head.appendChild(script);
    } else if (strategy === 'afterInteractive') {
      document.body.appendChild(script);
    } else if (strategy === 'lazyOnload') {
      window.addEventListener('load', () => {
        document.body.appendChild(script);
      });
    }
  });
}

export function loadScriptsSequentially(
  scripts: Array<{ src: string; options?: ScriptOptions }>
): Promise<HTMLScriptElement[]> {
  return scripts.reduce(
    (promise, { src, options }) =>
      promise.then((results) =>
        loadScript(src, options).then((script) => [...results, script])
      ),
    Promise.resolve([] as HTMLScriptElement[])
  );
}

export function loadScriptsInParallel(
  scripts: Array<{ src: string; options?: ScriptOptions }>
): Promise<HTMLScriptElement[]> {
  return Promise.all(
    scripts.map(({ src, options }) => loadScript(src, options))
  );
}

export default {
  loadScript,
  loadScriptsSequentially,
  loadScriptsInParallel,
};
