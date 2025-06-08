import { B as BUILD, c as consoleDevInfo, H, w as win, N as NAMESPACE, p as promiseResolve, g as globalScripts, b as bootstrapLazy } from './index-BPmV3ait.js';
export { s as setNonce } from './index-BPmV3ait.js';

/*
 Stencil Client Patch Browser v4.33.1 | MIT Licensed | https://stenciljs.com
 */

var patchBrowser = () => {
  if (BUILD.isDev && !BUILD.isTesting) {
    consoleDevInfo("Running in development mode.");
  }
  if (BUILD.cloneNodeFix) {
    patchCloneNodeFix(H.prototype);
  }
  const scriptElm = BUILD.scriptDataOpts ? win.document && Array.from(win.document.querySelectorAll("script")).find(
    (s) => new RegExp(`/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) || s.getAttribute("data-stencil-namespace") === NAMESPACE
  ) : null;
  const importMeta = import.meta.url;
  const opts = BUILD.scriptDataOpts ? (scriptElm || {})["data-opts"] || {} : {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};
var patchCloneNodeFix = (HTMLElementPrototype) => {
  const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;
  HTMLElementPrototype.cloneNode = function(deep) {
    if (this.nodeName === "TEMPLATE") {
      return nativeCloneNodeFn.call(this, deep);
    }
    const clonedNode = nativeCloneNodeFn.call(this, false);
    const srcChildNodes = this.childNodes;
    if (deep) {
      for (let i = 0; i < srcChildNodes.length; i++) {
        if (srcChildNodes[i].nodeType !== 2) {
          clonedNode.appendChild(srcChildNodes[i].cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["wallet-transactions",[[1,"wallet-transactions",{"walletId":[1,"wallet-id"]}]]],["notification-toast",[[1,"notification-toast",{"message":[1],"type":[1],"duration":[2],"visible":[32]},null,{"message":["onMessageChange"]}]]],["wallet-dashboard",[[1,"wallet-dashboard",{"walletId":[1,"wallet-id"],"wallet":[32],"amount":[32],"description":[32],"isCredit":[32],"loading":[32],"loadingWallet":[32]},null,{"walletId":["walletIdChanged"]}]]],["wallet-setup",[[1,"wallet-setup",{"name":[32],"balance":[32],"loading":[32],"error":[32]}]]],["wallet-transactions-table",[[0,"wallet-transactions-table",{"walletId":[1,"wallet-id"],"transactions":[32],"total":[32],"skip":[32],"limit":[32],"loading":[32],"error":[32],"sortBy":[32],"sortDir":[32]},null,{"walletId":["walletIdChanged"]}]]],["wallet-app-root",[[1,"wallet-app-root",{"page":[32],"walletId":[32],"theme":[32],"notification":[32]},[[8,"change","handleThemeChange"]]]]]], options);
});
//# sourceMappingURL=wallet-app.esm.js.map

//# sourceMappingURL=wallet-app.esm.js.map