const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/clover/callback")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const code = url.searchParams.get("code");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Callback received", code }));
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Socceroof Clover App is running");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});