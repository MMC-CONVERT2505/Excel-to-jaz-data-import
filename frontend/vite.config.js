// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig(({ mode }) => ({
//   plugins: [react()], 

//   define: {
//     __BASE_URL__: JSON.stringify(
//       mode === "production"
//         ? "http://localhost:9001"
//         : "http://localhost:5000"
//     ),
//   },

// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  console.log("Mode:", mode);

  return {
    plugins: [react()],

    define: {
      __BASE_URL__: JSON.stringify("http://localhost:9001"),
    },
  };
}); 
