import { defineConfig } from "@umijs/max";
import routes from "./routes";
export default defineConfig({
  antd: {},
  model: {},
  request: {},
  dva: {},
  hash: true,
  history: {
    type: "browser",
  },
  // 代理配置
  proxy: {
  '/api': {
    'target': 'http://localhost',
    'changeOrigin': true,
  },
  '/upload': {
    'target': 'http://localhost',
    'changeOrigin': true,
  }
  },
  routes,
  npmClient: "pnpm",
  tailwindcss: {}
});
