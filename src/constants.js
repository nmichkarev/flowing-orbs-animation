const { PI } = Math;
import RGB from './classes/RGB';

export const PI2 =  2 * PI;
export const PId2 = PI / 2;
export const PI3d2 = 3 * PI / 2;

export const TBIT = 0b1000;
export const BBIT = 0b0100;
export const LBIT = 0b0010;
export const RBIT = 0b0001;

export const PRESET_COLORS = {
    'RED': new RGB(192, 0, 0),
    'BLUE': new RGB(0, 173, 255),
    'GREEN': new RGB(0, 128, 0),
    'DEFAULT': new RGB(0, 0, 0)
}

export const MOVE_MODES = {
    'DEFAULT_MODE': 'DEFAULT_MODE',
    'SLOWING_MODE': 'SLOWING_MODE',
    'GAS_MODE': 'GAS_MODE'
}

export const USER_INPUT_MODE = {
    'default': MOVE_MODES.DEFAULT_MODE,
    'slowing': MOVE_MODES.SLOWING_MODE,
    'gas': MOVE_MODES.GAS_MODE
}
