import { configureStore } from "@reduxjs/toolkit"
import authFeature from "./features/authFeature"
import settingFeature from "./features/settingFeature"
import ajaxFeature from "./features/ajaxFeature"

const store = configureStore({
    reducer: {
        auth: authFeature,
        ajax: ajaxFeature,
        setting: settingFeature,
    }
})

export default store