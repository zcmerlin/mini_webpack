export interface Module {
    id: number;
    path: string;
    source: string;
    dependencies: Dependency[];
}

export interface Dependency {
    request: string;
    resolvePath: string;
}