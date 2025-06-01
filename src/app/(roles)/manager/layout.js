import Navbar from "@/app/(roles)/manager/_components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Toaster />
      <main>{children}</main>
    </>
  );
};

export default layout;
