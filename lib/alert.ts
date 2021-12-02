import { Alert, Platform } from "react-native";

export interface ConfirmParams {
  title: string;
  body: string;

  accept?: ButtonParams;
  reject?: ButtonParams;
}

export interface ButtonParams {
  text: string;
  style: "default" | "cancel" | "destructive";
}

export function confirm(params: ConfirmParams): Promise<boolean> {
  if (Platform.OS === "web") {
    return confirmWeb(params);
  } else {
    return confirmNative(params);
  }
}

async function confirmWeb({ title, body }: ConfirmParams): Promise<boolean> {
  return window.confirm(`${title}\n${body}`);
}

function confirmNative(params: ConfirmParams): Promise<boolean> {
  return new Promise((onConfirm) => {
    const accept = params.accept || {
      text: "OK",
      style: "default",
    };

    const reject = params.reject || {
      text: "Cancel",
      style: "cancel",
    };

    Alert.alert(params.title, params.body, [
      { ...reject, onPress: () => onConfirm(false) },
      { ...accept, onPress: () => onConfirm(true) },
    ]);
  });
}
