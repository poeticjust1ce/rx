import Navbar from "@/app/(roles)/manager/_components/Navbar";

const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default layout;
