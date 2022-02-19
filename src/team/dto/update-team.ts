import { Status } from '../../__shared/enums/enums';

export class UpdateTeamDto {
    readonly name: string;
    readonly score: number;
    readonly progress: number;
    readonly status: Status;
}
