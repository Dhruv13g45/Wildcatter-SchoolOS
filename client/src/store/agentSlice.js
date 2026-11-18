import { createSlice } from '@reduxjs/toolkit';

export const agentSlice = createSlice({
  name: 'agents',
  initialState: {
    lastTriggeredAgent: null,
    recentLogs: [],
    agentExecutionAlert: null,
  },
  reducers: {
    recordAgentAction: (state, action) => {
      state.lastTriggeredAgent = action.payload.agent_name;
      state.recentLogs.unshift(action.payload);
      state.agentExecutionAlert = {
        agent: action.payload.agent_name,
        message: action.payload.action_taken,
        latency_ms: action.payload.execution_latency_ms,
        timestamp: new Date().toLocaleTimeString(),
      };
    },
    clearAlert: (state) => {
      state.agentExecutionAlert = null;
    },
    setRecentLogs: (state, action) => {
      state.recentLogs = action.payload;
    },
  },
});

export const { recordAgentAction, clearAlert, setRecentLogs } = agentSlice.actions;
export default agentSlice.reducer;

