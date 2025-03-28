import { redirect } from "next/navigation";

const page = async () => {
  redirect("/manager/dashboard");
};

export default page;
