export type Release = {
    name: string,
    namespace: string,
    revision: string,
    updated: string,
    status: string,
    chart: string,
    appVersion: string,
}

export type Repo = {
    name: string,
    url: string
}

export type ChartListItem = {
    name: string,
    version: string,
    appVersion: string,
    description: string,
}

export type ChartDetails = {
    info: ChartInfo
    readme: string;
    values: string;
}

export type ChartInfo = {
    name: string;
    version: string;
    appVersion?: string;
    description?: string;
    chartType?: string;
    dependencies?: ChartDependency[]
    home?: string;
    icon?: string;
    keywords?: string[];
    maintainers?: ChartMaintainer[];
    apiVersion?: string;
    annotations?: Map<string, string>;
    sources?: string[];
    condition?: string;
    tags?: string[];
    deprecated?: boolean;
    kubeVersion?: string;
}
export type ChartDependency = {
    name: string;
    repository: string;
    version: string;
    condition?: string;
    tags?: string[];
    enabled?: boolean;
    alis?: string;
}
export type ChartMaintainer = {
    name: string;
    url?: string;
    email?: string;
}

export type InstallChartRequest = {
    name: string;
    chartName: string;
    namespace: string;
    values: string;
}