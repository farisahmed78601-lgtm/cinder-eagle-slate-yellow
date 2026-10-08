export async function exportDistHtml(avatarDataUrl: string) {
  const res = await fetch("/hina-dist.html");
  let html = await res.text();
  const inject = `<script>window.HINA_AVATAR = ${JSON.stringify(avatarDataUrl)};</script>`;
  html = html.replace("<head>", "<head>" + inject);
  downloadBlob("hina-dist.html", html);
}

function downloadBlob(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
