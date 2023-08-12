window.xhrLog = [];

(function (open) {
  XMLHttpRequest.prototype.open = function () {
    const xhr = this;

    this.addEventListener("load", function () {
      if (xhr.responseURL.includes("api/v1/tags/web_info")) {
        const headers = xhr
          .getAllResponseHeaders()
          .trim()
          .split("\n")
          .reduce((acc, line) => {
            const [header, value] = line.split(": ");
            acc[header] = value;
            return acc;
          }, {});

        window.xhrLog.push({
          url: xhr.responseURL,
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.response,
          requestHeaders: headers,
        });
      }
    });

    open.apply(xhr, arguments);
  };
})(XMLHttpRequest.prototype.open);
