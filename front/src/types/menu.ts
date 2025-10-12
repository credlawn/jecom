export interface MenuItem {
  menuName: string;
  parentId?: number;
  childId?: number;
  parentName?: string;
  menuType: "Parent" | "Child";
  slug: string;
}

export interface MenuResponse {
  parent: MenuItem;
  children: MenuItem[];
}