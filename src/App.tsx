import "./App.css";
import Router from "./router";
import Sidebar from "./components/Sidebar";
import MainContainer from "./layout/MainContainer";
import ErrorPanel from "./components/ErrorPanel";
import { ApplicationStore, ApplicationStoreContext } from "./store/applicationStore";


function App() {
    return (
        <ApplicationStoreContext.Provider value={new ApplicationStore()}>
            <ErrorPanel/>
            <MainContainer sidebar={<Sidebar className="h-full"/>}>
                <Router/>
            </MainContainer>
        </ApplicationStoreContext.Provider>
    );
}

export default App;
