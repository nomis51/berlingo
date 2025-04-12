import {LoggerService} from "../content/services/loggerService";
import {ReactService} from "./reactService";

class DuolingoServiceImpl {
    /**
     *  Public functions
     */
    public getProfile(): any {
        LoggerService.debug("Getting profile data");

        const props = ReactService.findReactFiberWithPropName<ProfileData>("username");
    }
}

export const DuolingoService = new DuolingoServiceImpl();