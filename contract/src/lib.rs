use cosmwasm_std::{entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Note {
    pub id: String,
    pub title: String,
    pub content: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct State {
    pub notes: Vec<Note>,
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    let state = State { notes: vec![] };
    deps.storage.set(b"state", &to_binary(&state)?);
    Ok(Response::default())
}

#[entry_point]
pub fn execute(deps: DepsMut, env: Env, _info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::AddNote { title, content } => add_note(deps, env, title, content),
    }
}

fn add_note(deps: DepsMut, env: Env, title: String, content: String) -> StdResult<Response> {
    let mut state: State = deps.storage.get(b"state").and_then(|data| from_binary(&data)).unwrap_or_default();
    let id = env.block.height.to_string(); // Using block height as a simple id
    state.notes.push(Note { id, title, content });
    deps.storage.set(b"state", &to_binary(&state)?);
    Ok(Response::default())
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetNotes {} => to_binary(&query_notes(deps)?),
    }
}

fn query_notes(deps: Deps) -> StdResult<State> {
    let state: State = deps.storage.get(b"state").and_then(|data| from_binary(&data)).unwrap_or_default();
    Ok(state)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ExecuteMsg {
    AddNote { title: String, content: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum QueryMsg {
    GetNotes {},
}
