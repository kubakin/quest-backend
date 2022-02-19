import { Request as iReq} from 'express';
import { User } from '../../user/user.entity';


export interface iRequestData extends iReq {
    user: User;
};
