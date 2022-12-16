const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    document.body.appendChild(script);
  });
};

export default loadScript;
