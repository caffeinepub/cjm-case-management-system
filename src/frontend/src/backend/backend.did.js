export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const CaseRecord = IDL.Record({
    'caseNumber' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : Time,
    'forwardDate' : IDL.Opt(IDL.Text),
    'manualNote' : IDL.Text,
    'crimeNumber' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'addRecord' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Text],
        [],
        [],
      ),
    'getAllRecords' : IDL.Func([], [IDL.Vec(CaseRecord)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
