import {AppRootStateType} from "app/store";
import {dataType} from "shared/api/getKlines";

export const selectData = (state: AppRootStateType): dataType[] => state.data.data
