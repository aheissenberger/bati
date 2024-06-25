import vikeSolid from "vike-solid/config";
import type { Config } from "vike/types";
import Head from "../layouts/HeadDefault.js";
import Layout from "../layouts/LayoutDefault.js";

// Default config (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  /*{ @if (it.BATI.has("auth0") || it.BATI.has("firebase-auth")) }*/
  passToClient: ["user"],
  /*{ /if }*/
  title: "My Vike App",
  stream:
    BATI.has("express") || BATI.has("fastify") || BATI.has("h3") || BATI.has("hattip") || BATI.has("hono")
      ? "web"
      : true,
  extends: vikeSolid,
  /*{ @if (it.BATI.has("firebase-auth")) }*/
  meta: {
    // Temporary workaround until +client.js is implemented: https://github.com/vikejs/vike/issues/1468
    firebaseApp: {
      env: { client: true },
    },
  },
  /*{ /if }*/
} satisfies Config;
