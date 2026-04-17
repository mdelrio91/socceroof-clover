const http = require("http");

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/clover/callback")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const code = url.searchParams.get("code");

    if (!code) {
      res.end("Missing code");
      return;
    }

    const response = await fetch("https://apisandbox.dev.clover.com/oauth/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.CLOVER_CLIENT_ID,
        client_secret: process.env.CLOVER_CLIENT_SECRET,
        code: code
      })
    });

    const data = await response.json();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data, null, 2));
  } else {
    res.end("App running");
  }
});

server.listen(3000);
