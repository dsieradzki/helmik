import { invoke } from "@tauri-apps/api/tauri";
import { ChartDetails, ChartListItem, InstallChartRequest, Release, Repo } from "./model";

export namespace api {
    export async function list_releases(): Promise<Release[]> {
        return invoke("list_releases", {});
    }

    export async function repos(): Promise<Repo[]> {
        return invoke("repos", {});
    }

    export async function version(): Promise<string> {
        return invoke("version", {});
    }

    export async function deleteRepository(name: string): Promise<void> {
        return invoke("delete_repository", {name: name});
    }

    export async function addRepository(name: string, url: string): Promise<void> {
        return invoke("add_repository", {name: name, url: url});
    }

    export async function updateRepository(oldName: string, name: string, url: string): Promise<void> {
        return invoke("update_repository", {oldName: oldName, name: name, url: url});
    }

    export async function refreshRepositories(): Promise<void> {
        return invoke("refresh_repositories", {});
    }

    export async function findChartsInRepo(filter: string): Promise<ChartListItem[]> {
        return invoke("find_charts_in_repo", {filter: filter});
    }

    export async function getChartDetails(name: string): Promise<ChartDetails> {
        return invoke("get_chart_details", {name: name});
    }

    export async function installChart(req: InstallChartRequest): Promise<void> {
        return invoke("install_chart", {request: req})
    }

    export async function uninstallChart(releaseName: string, namespace: string): Promise<void> {
        return invoke("uninstall_chart", {releaseName: releaseName, namespace: namespace});
    }

    export async function getValues(releaseName: string, namespace: string): Promise<string> {
        return invoke("get_values", {releaseName: releaseName, namespace: namespace});
    }
}