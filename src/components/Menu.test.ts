import MenuList from "./Menu";

describe("Menu Component", () => {
    it("should render with correct styles and position", async () => {
        window.customElements.define("menu-list", MenuList);
        const menu = document.createElement("menu-list") as MenuList;
        menu.placement = "bottom-end";
        document.body.appendChild(menu);
    });
});
