import {Route, Routes} from "react-router"
import HomePage from "./pages/HomePage/HomePage"
import CreateGroupPage from "./pages/CreateGroupPage/CreateGroupPage"
import GroupPage from "@/pages/GroupPage/GroupPage.tsx";
import SettlePage from "@/pages/SettlePage/SettlePage.tsx";

function App() {

    return (
        <Routes>
            <Route index element={<HomePage/>}/>
            <Route path="/group/new" element={<CreateGroupPage/>}/>
            <Route path="/group/:id"  element={<GroupPage />} />
            <Route path="/group/:id/settle" element={<SettlePage />} />
        </Routes>
    )
}

export default App
