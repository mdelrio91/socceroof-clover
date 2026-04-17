const http = require("http");

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/clover/callback")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const code = url.searchParams.get("code");

    if (!code) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing code" }));
      return;
    }

    try {
      // Step 1: exchange code for token
      const tokenResponse = await fetch("https://apisandbox.dev.clover.com/oauth/v2/token", {
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

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          error: "No access token returned",
          tokenData
        }, null, 2));
        return;
      }

      // Step 2: use token to get merchant info
      const merchantResponse = await fetch("https://sandbox.dev.clover.com/v3/merchants/me", {
        method: "GET",
        headers: {
         "Authorization": "Bearer " + tokenData.access_token,
         "Content-Type": "application/json"
        }
      });

      const merchantData = await merchantResponse.json();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        merchant: merchantData
      }, null, 2));

    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        error: "Something failed",
        details: String(error)
      }, null, 2));
    }
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("App running");
  }
});

server.listen(3000);
