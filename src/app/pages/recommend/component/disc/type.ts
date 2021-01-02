import {IDisc} from 'store/stateTypes';
export interface DiscPropType {
    disc: IDisc | null;
    back: () => void;
}
