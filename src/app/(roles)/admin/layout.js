import AdminNavbar from "./_components/Navbar";

const layout = ({ children }) => {
  return (
    <>
      <AdminNavbar />
      <main>{children}</main>
    </>
  );
};

export default layout;
