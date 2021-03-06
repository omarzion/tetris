export class Actions {
  public static START = 'EVENT_LOOP_START';
  public static STOP = 'EVENT_LOOP_STOP';
  public static PAUSE = 'EVENT_LOOP_PAUSE';
  public static RESUME = 'EVENT_LOOP_RESUME';
  public static UPDATE = 'EVENT_LOOP_UPDATE';

  public static start(draw) {
    return (dispatch, getState) => {
      dispatch({ type: Actions.START, draw, initialTick: Date.now() });
      loop(dispatch, getState);
    };
  }

  public static pause() {
    return { type: Actions.PAUSE };
  }

  public static update(delta, now) {
    return {
      type: Actions.UPDATE,
      delta,
      now
    };
  }

  public static stop() {
    return { type: Actions.STOP };
  }
}

const loop = (dispatch, getState) => {
  const { lastTick, paused, active, tickRate, draw } = getState().EventLoop;
  if (paused || !active) return;
  let now = Date.now();
  let delta = now - lastTick;
  if (delta > 10) {
    dispatch(Actions.update(delta, now));
  }
  window.requestAnimationFrame(() => loop(dispatch, getState));
  draw();
};

const initialTick = Date.now();

const initialState = {
  initialTick,
  lastTick: initialTick,
  paused: true,
  active: false,
  draw: _ => _, // draw function tree
  timerHandle: null
};

export default (state = initialState, { type, ...actions }) => {
  switch (type) {
    case Actions.START:
      return {
        ...state,
        ...actions,
        paused: false,
        active: true
      };
    case Actions.UPDATE:
      return {
        ...state,
        lastTick: actions.now
      };
    case Actions.STOP:
      return {
        ...state,
        paused: false,
        active: false
      };
    case Actions.PAUSE:
      return {
        ...state,
        paused: true
      };
  }
  return state;
};
