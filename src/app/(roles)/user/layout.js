import Navbar from "@/app/(roles)/user/_components/Navbar";

const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default layout;
