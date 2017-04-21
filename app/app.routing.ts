import {Page1} from "./components/page1/page1.component";
import {Page2} from "./components/page2/page2.component";
import {Page3} from "./components/page3/page3.component";
import {Page4} from "./components/page4/page4.component";


export const AppRoutes = [
    { path: "", component: Page1 },
    { path: "page2", component: Page2 },
    { path: "page3", component: Page3 },
    { path: "page4", component: Page4 }
];

export const AppComponents = [
    Page1,
    Page2,
    Page3,
    Page4
];