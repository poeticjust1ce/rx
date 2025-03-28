import { redirect } from "next/navigation";

const page = async () => {
  redirect("/admin/dashboard");
};

export default page;
