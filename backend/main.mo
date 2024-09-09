import Text "mo:base/Text";

import Float "mo:base/Float";
import Int "mo:base/Int";
import Error "mo:base/Error";

actor Calculator {
  public func calculate(x : Float, y : Float, op : Text) : async ?Float {
    switch (op) {
      case ("+") { ?Float.add(x, y) };
      case ("-") { ?Float.sub(x, y) };
      case ("*") { ?Float.mul(x, y) };
      case ("/") {
        if (y == 0) {
          null // Division by zero
        } else {
          ?Float.div(x, y)
        }
      };
      case (_) { null } // Invalid operation
    }
  };
}
