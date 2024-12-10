export function stringifyObject<T>(obj: T): string {
    let resultString = '';

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = (obj as any)[key];
            if (typeof value !== 'undefined') {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    resultString += `${key}:`;
                    resultString += stringifyObject(value);
                } else if (Array.isArray(value)) {
                    resultString += `${key}:`;
                    value.forEach((item: any) => {
                        resultString += stringifyObject(item).replace(/^/gm, '\t');
                    });
                } else {
                    resultString += `${key}: ${value}`;
                }
            }
        }
    }

    return resultString;
}