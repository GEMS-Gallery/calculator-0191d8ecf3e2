export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'calculate' : IDL.Func(
        [IDL.Float64, IDL.Float64, IDL.Text],
        [IDL.Opt(IDL.Float64)],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
