import SignOutButton from "@/components/SignOutButton";
import { auth } from "@/lib/auth";
export default async function Home() {
  const session = await auth();

  return (
    <div>
      <div>{session ? session?.user.id : "Not Logged In"}</div>
      <div>
        <SignOutButton />{" "}
      </div>
    </div>
  );
}
