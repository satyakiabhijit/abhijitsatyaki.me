import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";

function apiDevPlugin(): Plugin {
  return {
    name: "api-dev-server",
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        const urlObj = new URL(req.url, "http://localhost");
        const pathname = urlObj.pathname;

        try {
          let handler: any = null;
          if (pathname === "/api/auth") {
            const mod = await server.ssrLoadModule("/api/auth.js");
            handler = mod.default;
          } else if (pathname === "/api/resumes") {
            const mod = await server.ssrLoadModule("/api/resumes.js");
            handler = mod.default;
          } else if (pathname === "/api/chat") {
            const mod = await server.ssrLoadModule("/api/chat.js");
            handler = mod.default;
          }

          if (handler) {
            let body: any = undefined;
            if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
              const buffers: Buffer[] = [];
              for await (const chunk of req) {
                buffers.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
              }
              const raw = Buffer.concat(buffers).toString();
              if (raw) {
                try {
                  body = JSON.parse(raw);
                } catch {
                  body = raw;
                }
              }
            }
            req.body = body;

            res.status = (statusCode: number) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (data: any) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
              return res;
            };
            res.send = (data: any) => {
              res.end(data);
              return res;
            };

            return await handler(req, res);
          }
        } catch (err: any) {
          console.error("API Dev error:", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: err.message }));
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "three-stdlib"],
          "react-three": ["@react-three/fiber", "@react-three/drei"],
          gsap: ["gsap"],
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ["three", "gsap", "lenis"],
  },
});
