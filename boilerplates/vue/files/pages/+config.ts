import vikeVue from "vike-vue/config";
import type { Config } from "vike/types";
import Head from "../layouts/HeadDefault.vue";
import Layout from "../layouts/LayoutDefault.vue";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: "My Vike App",
  description: "Demo showcasing Vike",
  Head,

  //# BATI.has("auth0") || BATI.has("firebase-auth") || BATI.has("authjs") || BATI.has("lucia-auth")
  passToClient: ["user"],
  extends: vikeVue as typeof vikeVue,
} satisfies Config;
