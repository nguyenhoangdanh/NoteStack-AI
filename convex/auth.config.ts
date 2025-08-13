import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export default convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
});
