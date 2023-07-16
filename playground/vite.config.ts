import { defineConfig } from "vite";
import ReactEmail from "vite-plugin-react-email";

export default defineConfig({
  plugins: [
    ReactEmail({
      emailDir: "emails",
    }),
  ],
});
