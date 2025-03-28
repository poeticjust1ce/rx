import { redirect } from "next/navigation";

const page = async () => {
  redirect("/user/dashboard");
};

export default page;
