import { getMenuList } from "@/get-api-data/navbar";
import Navbar from "./navbar";

export default async function NavbarContainer() {
  const menuData = await getMenuList();

  return <Navbar menuData={menuData} />;
}
