import { Route, Routes } from "react-router-dom";
import ListInstalledView from "./views/ListInstalled/ListInstalledView";
import RepositoriesView from "./views/Repositories/RepositoriesView";
import CatalogView from "./views/Catalog/CatalogView";
import ChartDetailsView from "./views/ChartDetails/ChartDetailsView";


const Router = () => {
    return <Routes>
        <Route path={"/"} element={<ListInstalledView/>}/>
        <Route path={"/catalog"} element={<CatalogView/>}/>
        <Route path={"/chart/:name"} element={<ChartDetailsView/>}/>
        <Route path={"/repos"} element={<RepositoriesView/>}/>
    </Routes>
}

export default Router;