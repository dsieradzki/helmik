use std::fmt::{Display, Formatter};

use crate::executor;
use crate::helm;

#[derive(Debug)]
pub enum Error {
    SomethingWentWrong(String)
}

impl From<helm::cmd::Error> for Error {
    fn from(value: helm::cmd::Error) -> Self {
        match value {
            helm::cmd::Error::SomethingWentWrong(v) => Error::SomethingWentWrong(v)
        }
    }
}

impl Display for Error {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Error::SomethingWentWrong(v) => write!(f, "{}", v)
        }
    }
}

pub type Result<T> = std::result::Result<T, Error>;

pub struct Api<'a> {
    executor: &'a mut dyn executor::Executor,
}


impl<'a> Api<'a> {
    pub fn new(executor: &'a mut dyn executor::Executor) -> Self {
        Api {
            executor
        }
    }

    pub fn add_repository(&mut self, name: String, url: String) -> Result<()> {
        helm::Cmd::new(self.executor).add_repo(name, url)?;
        Ok(())
    }
    pub fn update_repository(&mut self, old_name: String, name: String, url: String) -> Result<()> {
        helm::Cmd::new(self.executor).update_repo(old_name, name, url)?;
        Ok(())
    }
    pub fn refresh_repositories(&mut self) -> Result<()> {
        helm::Cmd::new(self.executor).refresh_repos()?;
        Ok(())
    }
    pub fn delete_repository(&mut self, name: String) -> Result<()> {
        let result = helm::Cmd::new(self.executor).delete_repository(name)?;
        Ok(result)
    }
    pub fn repos(&mut self) -> Result<Vec<helm::cmd::Repo>> {
        let result = helm::Cmd::new(self.executor).repos()?;
        Ok(result)
    }
    pub fn list(&mut self) -> Result<Vec<helm::cmd::Release>> {
        let result = helm::Cmd::new(self.executor).list()?;
        Ok(result)
    }
    pub fn version(&mut self) -> Result<String> {
        let version = helm::Cmd::new(self.executor).version()?;
        Ok(version)
    }
    pub fn find_charts_in_repo(&mut self, filter: String) -> Result<Vec<helm::cmd::ChartListItem>> {
        let result = helm::Cmd::new(self.executor).find_charts_in_repo(filter)?;
        Ok(result)
    }

    pub fn get_chart_details(&mut self, name: String) -> Result<helm::cmd::ChartDetails> {
        let result = helm::Cmd::new(self.executor).get_chart_details(name)?;
        Ok(result)
    }

    pub fn install_chart(&mut self, request: helm::cmd::InstallChartRequest) -> Result<()> {
        let result = helm::Cmd::new(self.executor).install_chart(request)?;
        Ok(result)
    }
    pub fn uninstall_chart(&mut self, release_name: String, namespace: String) -> Result<()> {
        let result = helm::Cmd::new(self.executor).uninstall_chart(release_name, namespace)?;
        Ok(result)
    }
    pub fn get_values(&mut self, release_name: String, namespace: String) -> Result<String> {
        let result = helm::Cmd::new(self.executor).get_values(release_name, namespace)?;
        Ok(result)
    }
}

#[cfg(test)]
mod test {
    use crate::executor::DefaultExecutor;
    use crate::helm;
    use crate::helm::api::Dupa;

    #[test]
    fn should_return_helm_version() {
        let mut executor = Box::new(DefaultExecutor::new());
        let version = helm::Api::new(executor.as_mut()).version().unwrap();
        assert_eq!(version, "v3.10.3")
    }


    #[test]
    fn should_return_helm_list() {
        let mut executor = Box::new(DefaultExecutor::new());
        let version = helm::Api::new(executor.as_mut()).list().unwrap();
        println!("{:?}", version)
    }
}