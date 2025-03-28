// app/(roles)/admin/inventory/layout.js
import { getInventoryItems, getSuppliers } from "./_actions/actions";

export default async function Layout({ children }) {
  const [inventoryItems, suppliers] = await Promise.all([
    getInventoryItems(),
    getSuppliers(),
  ]);

  return <div>{children}</div>;
}
