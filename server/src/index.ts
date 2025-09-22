import { createApp } from "./app.js"; 

const port = Number(process.env.PORT || 8000);
const serveFrontend = process.env.SERVE_FRONTEND === "true";

createApp(serveFrontend).listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
