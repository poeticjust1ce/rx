import { z } from "zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Invalid password"),
});

export { schema };
