use std::fmt::{Debug};
use std::process::Command;
use std::str::Utf8Error;

#[derive(Debug)]
pub enum Error {
    NoCommand,
    CannotExecuteCommand(String),
}


impl From<Utf8Error> for Error {
    fn from(value: Utf8Error) -> Self {
        Error::CannotExecuteCommand(value.to_string())
    }
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        Error::CannotExecuteCommand(value.to_string())
    }
}


pub type Result<T> = std::result::Result<T, Error>;


pub trait Executor {
    fn command(&mut self, cmd: String) -> &mut dyn Executor;
    fn arg(&mut self, name: String) -> &mut dyn Executor;
    fn execute(&mut self) -> Result<String>;
}

pub struct DefaultExecutor {
    command: String,
    args: Vec<String>,
}

impl DefaultExecutor {
    pub fn new() -> Self {
        DefaultExecutor {
            command: "".to_owned(),
            args: vec![],
        }
    }
}

impl Executor for DefaultExecutor {
    fn command(&mut self, cmd: String) -> &mut dyn Executor {
        self.command = cmd;
        self
    }
    fn arg(&mut self, name: String) -> &mut dyn Executor {
        self.args.push(name);
        self
    }

    fn execute(&mut self) -> Result<String> {
        if self.command.is_empty() {
            return Err(Error::NoCommand);
        }
        // TODO: make it in debug
        print!("Executed command: {}", self.command.clone());
        for arg in self.args.iter() {
            print!(" {}", arg)
        }
        println!();

        let mut cmd = Command::new(self.command.clone());
        for arg in self.args.iter() {
            cmd.arg(arg.clone());
        }

        self.args.clear();

        let to_result = |x: Vec<u8>| -> String {
            std::str::from_utf8(&x)
                .unwrap_or("cannot convert result to string")
                .to_string()
        };

        let output = cmd.output()?;
        match output.status.success() {
            true => Ok(to_result(output.stdout)),
            false => Err(Error::CannotExecuteCommand(to_result(output.stderr))),
        }
    }
}