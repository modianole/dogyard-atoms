import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const devHost = (env.VITE_DEV_HOST || process.env.VITE_DEV_HOST || "0.0.0.0").trim();
  const devPortRaw = (env.VITE_DEV_PORT || process.env.VITE_DEV_PORT || "8080").trim();
  const parsedPort = Number.parseInt(devPortRaw, 10);
  const devPort = Number.isFinite(parsedPort) ? parsedPort : 8080;
  const dockerUrl = (env.VITE_DOCKER_URL || process.env.VITE_DOCKER_URL || `http://localhost:${devPort}`).trim();
  const cloudUrl = (env.VITE_CLOUD_URL || process.env.VITE_CLOUD_URL || "not configured").trim();

  return {
    server: {
      host: devHost,
      port: devPort,
      strictPort: true,
    },
    plugins: [
      react(),
      {
        name: "dogyard-dev-endpoints-banner",
        configureServer(server) {
          server.httpServer?.once("listening", () => {
            const localUrl = server.resolvedUrls?.local?.[0] ?? `http://localhost:${devPort}`;
            const networkUrl = server.resolvedUrls?.network?.[0] ?? "not available";

            console.log("\n=== DogYard Dev Endpoints ===");
            console.log(`LOCAL:   ${localUrl}`);
            console.log(`NETWORK: ${networkUrl}`);
            console.log(`DOCKER:  ${dockerUrl}`);
            console.log(`CLOUD (ענן):   ${cloudUrl}`);
            console.log("============================\n");
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
