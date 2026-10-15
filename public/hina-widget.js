(function () {
  var script = document.currentScript;
  if (!script) return;
  var origin = new URL(script.src).origin;
  var root = document.createElement("div");
  root.style.cssText = "position:fixed;z-index:2147483000;right:16px;bottom:16px;font-family:sans-serif;";
  var frame = document.createElement("iframe");
  frame.src = origin + "/embed";
  frame.title = "Hina";
  frame.allow = "microphone; autoplay";
  frame.style.cssText =
    "display:none;width:min(380px,calc(100vw - 32px));height:min(640px,calc(100vh - 96px));border:0;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);background:#fff;margin-bottom:10px;";
  var btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Hina";
  btn.style.cssText =
    "margin-left:auto;display:block;border:0;border-radius:999px;background:#d4a394;color:#1c1412;font-weight:600;padding:12px 18px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.2);";
  btn.addEventListener("click", function () {
    var open = frame.style.display === "block";
    frame.style.display = open ? "none" : "block";
  });
  root.appendChild(frame);
  root.appendChild(btn);
  document.body.appendChild(root);
})();
