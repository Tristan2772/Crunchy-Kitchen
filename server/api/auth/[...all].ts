import { fromWebHandler } from "h3";

import { auth } from "../../../app/lib/auth";

export default fromWebHandler(auth.handler);
