import path from 'node:path';

export function resolve(
    request: string,
    context: string
): string {
    return path.resolve(context, request);
}
