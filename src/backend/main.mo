import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";

actor {
  type CaseRecord = {
    name : Text;
    caseNumber : Text;
    crimeNumber : ?Text;
    forwardDate : ?Text;
    manualNote : Text;
    createdAt : Time.Time;
  };

  let records = Map.empty<Text, CaseRecord>();

  public shared ({ caller }) func addRecord(name : Text, caseNumber : Text, crimeNumber : ?Text, forwardDate : ?Text, manualNote : Text) : async () {
    assert (name != "" and caseNumber != "");

    let timestamp = Time.now();
    let key = caseNumber.concat(timestamp.toText());

    let newRecord : CaseRecord = {
      name;
      caseNumber;
      crimeNumber;
      forwardDate;
      manualNote;
      createdAt = timestamp;
    };

    records.add(key, newRecord);
  };

  public query ({ caller }) func getAllRecords() : async [CaseRecord] {
    records.values().toArray();
  };
};
