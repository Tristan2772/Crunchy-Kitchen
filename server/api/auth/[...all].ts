import { auth } from "~~/lib/auth";
import { toRequest } from "h3";

export default defineEventHandler((event) => {
  return auth.handler(toRequest(event));
});
