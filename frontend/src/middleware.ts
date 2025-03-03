import { authMiddleware } from "@/middleware/authMiddleware";
import { stackMiddlewares } from "@/middleware/stackHandler";

const middlewares = [authMiddleware];
export default stackMiddlewares(middlewares);
