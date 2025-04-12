import {LoggerService} from "../content/services/loggerService";
import {ReactService} from "./reactService";
import {Course, ProfileData} from "../types/duolingo/ProfileData";

class DuolingoServiceImpl {
    /**
     * Members
     */
    private _profileData: ProfileData | undefined;

    /**
     * Props
     */
    public get hasProfileData(): boolean {
        return !!this._profileData;
    }

    public get username(): string {
        return this._profileData?.username ?? "";
    }

    public get courses(): Course[] {
        return this._profileData?.courses ?? [];
    }

    public get currentCourse(): Course | undefined {
        return this.courses.find(c => c.isCurrent);
    }


    /**
     *  Public functions
     */
    public loadProfileData(): boolean {
        LoggerService.debug("Getting profile data");

        this._profileData = ReactService.findReactFiberWithPropName<ProfileData>("username");
        return this.hasProfileData;
    }
}

export const DuolingoService = new DuolingoServiceImpl();