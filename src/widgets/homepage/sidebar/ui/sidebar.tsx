import { navItems } from "../model/nav-items";
import { ClaimCard } from "./claim-card";
import { NavDropdown } from "./nav-dropdown";
import { NavLink } from "./nav-link";

export function Sidebar() {
  return (
    <aside className="hidden border-r border-(--color-border-sidebar) bg-(--color-surface)/95 px-4 backdrop-blur lg:sticky lg:top-16 lg:z-20 lg:flex lg:h-[calc(100vh-4rem)] lg:w-[227px]">
      <div className="flex h-full w-full flex-col items-center justify-start gap-3 pt-3">
        <ClaimCard />
        <nav className="flex w-full flex-col gap-1">
          {navItems.map((item) =>
            item.type === "dropdown" ? (
              <NavDropdown item={item} key={item.title} />
            ) : (
              <NavLink iconSize={20} item={item} key={item.title} />
            ),
          )}
        </nav>
      </div>
    </aside>
  );
}
