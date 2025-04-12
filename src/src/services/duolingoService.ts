import {LoggerService} from "../content/services/loggerService";
import {ReactService} from "./reactService";
import {Course, ProfileData} from "../types/duolingo/ProfileData";
import {DuolingoSolver} from "../duolingo/duolingoSolver";

class DuolingoServiceImpl {
    /**
     * Members
     */
    private _profileData: ProfileData | undefined;
    private readonly _solver: DuolingoSolver = new DuolingoSolver();
    private _isSolving: boolean = false;

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

    public async solveChallenge(): Promise<void> {
        if (this._isSolving) return;

        LoggerService.info("Solving challenge");
        this._isSolving = true;
        await this._solver.solve();
        this._isSolving = false;
    }

    public getChallengeAnswer(): string {
        const answer = this._solver.getAnswer();
        LoggerService.info("Answer: ", answer);
        return answer;
    }
}

export const DuolingoService = new DuolingoServiceImpl();