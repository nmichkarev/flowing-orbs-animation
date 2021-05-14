import { PI2, PId2, PI3d2 } from './constants';
export const radToDeg = rad => rad * 180 / Math.PI;

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns integer x, where min <= x < max 
 */
export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns x, where min <= x < max
 */
export const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
  }

/**
 * 
 * @param {number} angle presented in radians 
 */
export const getAngleQuarter = (angle) => {
    const { PI } = Math;

    if (angle >= 0 && angle < PId2) {
        return 'I';
    }
    if (angle >= PId2 && angle < PI) {
        return 'II';
    }

    if (angle >= PI && angle < PI3d2) {
        return 'III';
    }

    if (angle >= PI3d2 && angle < PI2) {
        return 'IV';
    }

    /* Minuses */
    if (angle < 0 && angle >= (-1 * PId2)) {
        return '-IV';
    }
    if (angle < (-1 * PId2) && angle >= (-1 * PI)) {
        return '-III';
    }

    if (angle < (-1 * PI) && angle >= (-1 * PI3d2)) {
        return '-II';
    }

    if (angle < (-1 * PI3d2) && angle >= (-1 * PI2)) {
        return '-I';
    }
}