import {AppRootStateType} from "app/store";
import {DataType} from "shared/api/getKlines";

export const selectData = (state: AppRootStateType): DataType[] => state.data.data
