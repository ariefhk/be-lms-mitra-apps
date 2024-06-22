import { logger } from "./application/logging.js";
import { web } from "./application/web.js";
const PORT = process.env.PORT ?? 5000;

web.listen(PORT, () => {
  logger.info("Listening on port: " + PORT);
});
