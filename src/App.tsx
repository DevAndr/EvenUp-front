import {Route, Routes} from "react-router"
import HomePage from "./pages/HomePage/HomePage"
import CreateGroupPage from "./pages/CreateGroupPage/CreateGroupPage"
import GroupPage from "@/pages/GroupPage/GroupPage.tsx";
import SettlePage from "@/pages/SettlePage/SettlePage.tsx";
import {SplashScreen} from "@/pages/SplashScreen/SplashScreen.tsx";
import JoinGroupPage from "@/pages/JoinGroupPage/JoinGroupPage.tsx";

function App() {

    return (
        <Routes>
            <Route index element={<SplashScreen/>} path="/"/>
            <Route path='app'>
                <Route path="home" element={<HomePage/>}/>
                <Route path="group/new" element={<CreateGroupPage/>}/>
                <Route path="group/:id"  element={<GroupPage />} />
                <Route path="group/:id/settle" element={<SettlePage />} />
                <Route path="group/:id/join" element={<JoinGroupPage />} />
            </Route>
        </Routes>
    )
}

export default App
