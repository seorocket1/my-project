// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html"),
        app: resolve(__vite_injected_original_dirname, "app.html"),
        "privacy-policy": resolve(__vite_injected_original_dirname, "privacy-policy.html"),
        "terms-and-conditions": resolve(__vite_injected_original_dirname, "terms-and-conditions.html"),
        "refund-policy": resolve(__vite_injected_original_dirname, "refund-policy.html"),
        "about-us": resolve(__vite_injected_original_dirname, "about-us.html"),
        "contact-us": resolve(__vite_injected_original_dirname, "contact-us.html")
      }
    }
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."]
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:54321/functions/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    },
    hmr: {
      overlay: false
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXG4gICAgICAgIGFwcDogcmVzb2x2ZShfX2Rpcm5hbWUsICdhcHAuaHRtbCcpLFxuICAgICAgICAncHJpdmFjeS1wb2xpY3knOiByZXNvbHZlKF9fZGlybmFtZSwgJ3ByaXZhY3ktcG9saWN5Lmh0bWwnKSxcbiAgICAgICAgJ3Rlcm1zLWFuZC1jb25kaXRpb25zJzogcmVzb2x2ZShfX2Rpcm5hbWUsICd0ZXJtcy1hbmQtY29uZGl0aW9ucy5odG1sJyksXG4gICAgICAgICdyZWZ1bmQtcG9saWN5JzogcmVzb2x2ZShfX2Rpcm5hbWUsICdyZWZ1bmQtcG9saWN5Lmh0bWwnKSxcbiAgICAgICAgJ2Fib3V0LXVzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdhYm91dC11cy5odG1sJyksXG4gICAgICAgICdjb250YWN0LXVzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdjb250YWN0LXVzLmh0bWwnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgZnM6IHtcbiAgICAgIC8vIEFsbG93IHNlcnZpbmcgZmlsZXMgZnJvbSBvbmUgbGV2ZWwgdXAgdG8gdGhlIHByb2plY3Qgcm9vdFxuICAgICAgYWxsb3c6IFsnLi4nXSxcbiAgICB9LFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTo1NDMyMS9mdW5jdGlvbnMvdjEnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiBmYWxzZSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFGeEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE1BQU0sUUFBUSxrQ0FBVyxZQUFZO0FBQUEsUUFDckMsS0FBSyxRQUFRLGtDQUFXLFVBQVU7QUFBQSxRQUNsQyxrQkFBa0IsUUFBUSxrQ0FBVyxxQkFBcUI7QUFBQSxRQUMxRCx3QkFBd0IsUUFBUSxrQ0FBVywyQkFBMkI7QUFBQSxRQUN0RSxpQkFBaUIsUUFBUSxrQ0FBVyxvQkFBb0I7QUFBQSxRQUN4RCxZQUFZLFFBQVEsa0NBQVcsZUFBZTtBQUFBLFFBQzlDLGNBQWMsUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQSxNQUNwRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixJQUFJO0FBQUE7QUFBQSxNQUVGLE9BQU8sQ0FBQyxJQUFJO0FBQUEsSUFDZDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
