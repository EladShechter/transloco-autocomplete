import { InjectionToken } from '@angular/core';
import { Translation } from '@ngneat/transloco';

export function GenericClass<T extends Translation>(): new () => T {
    return class {} as any;
}

export const TRANSLOCO_KEYS: InjectionToken<Translation> = new InjectionToken('TRANSLOCO_KEYS');

export class TranslocoKeysService<T extends Translation> extends GenericClass() {
    constructor(prefix: string, englishTranslations: T) {
        super();
        Object.assign(this, transformObjectToPath('', englishTranslations, prefix));
    }
}

function concatIfExistPath(path: string, suffix: string): string {
    const divider = path && suffix ? '.' : '';
    return `${path}${divider}${suffix}`;
}

function transformObjectToPath<T extends object | string>(suffix: string,
                                                          objectToTransformOrEndOfPath: T,
                                                          path = ''): T {
    return typeof  objectToTransformOrEndOfPath === 'object' ?
        Object.entries(objectToTransformOrEndOfPath).reduce(
            (objectToTransform, [key, value]) => {
                objectToTransform[key] = transformObjectToPath(key, value, concatIfExistPath(path, suffix));

                return objectToTransform;
            },
            {} as T
        )
        : (concatIfExistPath(path, suffix) as T);
}
