use std::{env, fs};
use std::collections::HashMap;
use std::fs::File;
use std::io::Write;

use comrak;
use serde::{Deserialize, Serialize};

use crate::executor;

#[derive(Debug)]
pub enum Error {
    SomethingWentWrong(String)
}

impl From<executor::Error> for Error {
    fn from(value: executor::Error) -> Self {
        match value {
            executor::Error::NoCommand => Error::SomethingWentWrong("no command".to_owned()),
            executor::Error::CannotExecuteCommand(v) => Error::SomethingWentWrong(v)
        }
    }
}

impl From<serde_json::Error> for Error {
    fn from(value: serde_json::Error) -> Self {
        Error::SomethingWentWrong(value.to_string())
    }
}

impl From<serde_yaml::Error> for Error {
    fn from(value: serde_yaml::Error) -> Self {
        Error::SomethingWentWrong(value.to_string())
    }
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        Error::SomethingWentWrong(value.to_string())
    }
}

type Result<T> = std::result::Result<T, Error>;


mod helm_date_format {
    use chrono::{DateTime, FixedOffset};
    use serde::{self, Deserialize, Deserializer, Serializer};

    const FORMAT_FROM_HELM: &'static str = "%Y-%m-%d %H:%M:%S.%f %z %Z";
    const FORMAT_ISO_8601: &'static str = "%Y-%m-%dT%H:%M:%S%:z";

    // The signature of a serialize_with function must follow the pattern:
    //
    //    fn serialize<S>(&T, S) -> Result<S::Ok, S::Error>
    //    where
    //        S: Serializer
    //
    // although it may also be generic over the input types T.
    pub fn serialize<S>(date: &DateTime<FixedOffset>, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        let s = format!("{}", date.format(FORMAT_ISO_8601));
        serializer.serialize_str(&s)
    }

    // The signature of a deserialize_with function must follow the pattern:
    //
    //    fn deserialize<'de, D>(D) -> Result<T, D::Error>
    //    where
    //        D: Deserializer<'de>
    //
    // although it may also be generic over the output types T.
    pub fn deserialize<'de, D>(deserializer: D) -> Result<DateTime<FixedOffset>, D::Error>
        where
            D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        DateTime::parse_from_str(&s, FORMAT_FROM_HELM).map_err(serde::de::Error::custom)
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Release {
    pub name: String,
    pub namespace: String,
    pub revision: String,

    #[serde(with = "helm_date_format")]
    pub updated: chrono::DateTime<chrono::FixedOffset>,
    pub status: String,
    pub chart: String,

    #[serde(rename(serialize = "appVersion", deserialize = "app_version"))]
    pub app_version: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChartListItem {
    pub name: String,
    pub version: String,

    #[serde(rename(serialize = "appVersion", deserialize = "app_version"))]
    pub app_version: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChartDetails {
    pub info: ChartInfo,
    pub readme: String,
    pub values: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChartDependency {
    pub name: String,
    pub repository: String,
    pub version: String,
    pub condition: Option<String>,
    pub tags: Option<Vec<String>>,
    pub enabled: Option<bool>,
    pub alias: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChartMaintainer {
    pub name: String,
    pub url: Option<String>,
    pub email: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChartInfo {
    pub icon: Option<String>,
    pub name: String,
    pub description: Option<String>,
    #[serde(rename(serialize = "chartType", deserialize = "type"))]
    pub chart_type: Option<String>,
    pub version: String,
    #[serde(rename = "kubeVersion")]
    pub kube_version: Option<String>,
    #[serde(rename = "apiVersion")]
    pub api_version: Option<String>,
    #[serde(rename = "appVersion")]
    pub app_version: Option<String>,
    pub home: Option<String>,
    pub sources: Option<Vec<String>>,
    pub keywords: Option<Vec<String>>,
    pub maintainers: Option<Vec<ChartMaintainer>>,
    pub annotations: Option<HashMap<String, String>>,
    pub dependencies: Option<Vec<ChartDependency>>,
    pub condition: Option<String>,
    pub tags: Option<Vec<String>>,
    pub deprecated: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Repo {
    pub name: String,
    pub url: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct InstallChartRequest {
    pub name: String,
    #[serde(rename = "chartName")]
    pub chart_name: String,
    pub namespace: String,
    pub values: Option<String>,
}

pub struct Cmd<'a> {
    executor: &'a mut dyn executor::Executor,
}

impl<'a> Cmd<'a> {
    pub fn new(executor: &'a mut dyn executor::Executor) -> Self {
        Cmd {
            executor: executor.command("helm".to_owned())
        }
    }

    pub fn delete_repository(&mut self, name: String) -> Result<()> {
        self.executor
            .arg("repo".to_owned())
            .arg("remove".to_owned())
            .arg(name)
            .execute()?;
        Ok(())
    }

    pub fn repos(&mut self) -> Result<Vec<Repo>> {
        let result = self.executor
            .arg("repo".to_owned())
            .arg("ls".to_owned())
            .arg("-o".to_owned())
            .arg("json".to_owned())
            .execute()?;

        let result = serde_json::from_str(result.as_str())?;
        Ok(result)
    }
    pub fn add_repo(&mut self, name: String, url: String) -> Result<()> {
        self.executor
            .arg("repo".to_owned())
            .arg("add".to_owned())
            .arg(name)
            .arg(url)
            .execute()?;
        Ok(())
    }
    pub fn update_repo(&mut self, old_name: String, name: String, url: String) -> Result<()> {
        let temporary_name = uuid::Uuid::new_v4().to_string();
        self.add_repo(temporary_name.clone(), url.clone())?;
        self.delete_repository(temporary_name)?;
        self.delete_repository(old_name)?;
        self.add_repo(name, url)?;
        Ok(())
    }
    pub fn refresh_repos(&mut self) -> Result<()> {
        self.executor
            .arg("repo".to_owned())
            .arg("update".to_owned())
            .execute()?;
        Ok(())
    }
    pub fn list(&mut self) -> Result<Vec<Release>> {
        let result = self.executor
            .arg("list".to_owned())
            .arg("-A".to_owned())
            .arg("-o".to_owned())
            .arg("json".to_owned())
            .execute()?;
        let result = serde_json::from_str(result.as_str())?;
        Ok(result)
    }

    pub fn version(&mut self) -> Result<String> {
        let version = self.executor
            .arg("version".to_owned())
            .arg("--template".to_owned())
            .arg("{{.Version}}".to_owned())
            .execute()?;

        Ok(version)
    }

    pub fn find_charts_in_repo(&mut self, filter: String) -> Result<Vec<ChartListItem>> {
        let result = self.executor
            .arg("-o".to_owned())
            .arg("json".to_owned())
            .arg("search".to_owned())
            .arg("repo".to_owned())
            .arg(filter)
            .execute()?;
        let result = serde_json::from_str(result.as_str())?;
        Ok(result)
    }

    pub fn get_chart_details(&mut self, name: String) -> Result<ChartDetails> {
        let info = self.executor
            .arg("show".to_owned())
            .arg("chart".to_owned())
            .arg(name.clone())
            .execute()?;
        let info: ChartInfo = serde_yaml::from_str(info.as_str())?;

        let readme = self.executor
            .arg("show".to_owned())
            .arg("readme".to_owned())
            .arg(name.clone())
            .execute()?;

        let values = self.executor
            .arg("show".to_owned())
            .arg("values".to_owned())
            .arg(name.clone())
            .execute()?;

        let mut comrak_options = comrak::ComrakOptions::default();
        comrak_options.extension.autolink = false;
        comrak_options.extension.table = true;
        let readme = comrak::markdown_to_html(readme.as_str(), &comrak_options);

        Ok(ChartDetails {
            info,
            readme,
            values,
        })
    }
    pub fn install_chart(&mut self, request: InstallChartRequest) -> Result<()> {
        let command = self.executor
            .arg("install".to_owned())
            .arg(request.name.clone())
            .arg(request.chart_name.clone())
            .arg("--namespace".to_owned())
            .arg(request.namespace.clone())
            .arg("--create-namespace".to_owned());

        if request.values.is_some() {
            let prepared_chart_name_prefix = request.chart_name.replace("/", "_").replace("\\", "_");
            let values_file_name = prepared_chart_name_prefix + "_" + request.name.as_str() + ".yaml";
            let values_file_name = env::temp_dir().join(values_file_name);
            let mut values_file = File::create(values_file_name.clone())?;
            values_file.write_all(request.values.unwrap().as_bytes())?;
            values_file.flush()?;

            command
                .arg("-f".to_owned())
                .arg(values_file_name.to_str().expect("Cannot happen").to_string());


            command.execute()?;
            fs::remove_file(values_file_name)?;
            return Ok(());
        }
        command.execute()?;
        Ok(())
    }
    pub fn uninstall_chart(&mut self, release_name: String, namespace: String) -> Result<()> {
        self.executor
            .arg("uninstall".to_owned())
            .arg(release_name)
            .arg("-n".to_owned())
            .arg(namespace)
            .execute()?;
        Ok(())
    }

    pub fn get_values(&mut self, release_name: String, namespace: String) -> Result<String> {
        let result = self.executor
            .arg("get".to_owned())
            .arg("values".to_owned())
            .arg(release_name)
            .arg("-n".to_owned())
            .arg(namespace)
            .arg("-o".to_owned())
            .arg("yaml".to_owned())
            .execute()?;
        Ok(result)
    }
}

#[cfg(test)]
mod test {
    use crate::helm::Cmd;

    #[test]
    fn should_get_helm_version() {
        let mut executor = Box::new(MockExecutor::default());
        Cmd::new(executor.as_mut()).version().expect("Cannot get version");
        assert_eq!(executor.get_execute(), "helm version --template {{.Version}}")
    }


    struct MockExecutor {
        cmds: Vec<String>,
    }

    impl Default for MockExecutor {
        fn default() -> Self {
            MockExecutor {
                cmds: vec![]
            }
        }
    }

    impl MockExecutor {
        fn get_execute(&self) -> String {
            self.cmds.join(" ")
        }
    }

    impl crate::executor::Executor for MockExecutor {
        fn command(&mut self, cmd: String) -> &mut dyn crate::executor::Executor {
            self.cmds.push(cmd);
            self
        }

        fn arg(&mut self, name: String) -> &mut dyn crate::executor::Executor {
            self.cmds.push(name);
            self
        }

        fn execute(&mut self) -> crate::executor::Result<String> {
            Ok("".to_owned())
        }
    }
}