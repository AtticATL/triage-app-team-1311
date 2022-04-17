import * as React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Button } from 'native-base';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Profile } from '../lib/profile';
import { NavSubProps as RootNavSubProps } from "../App";
import { QUESTIONS } from "../lib/triageQuestions";
import { REGIONAREAS } from "../lib/injuryRegions";
import { useMedia } from "../hooks/useMedia";

export default function PrintScreen({
  route,
  navigation,
}: RootNavSubProps<"PrintScreen">) {
  const profile: Profile = route.params.profile;

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
    });
  };
  var age = new Date().getFullYear() - profile.identity.birthYear;

  var triageChecklistString: String = "";
  Object.keys(profile.triageChecklist).forEach((entry) => {
    triageChecklistString +=
      '<tr style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;"> <td>' +
      QUESTIONS[entry as keyof typeof QUESTIONS].text +
      "</td>";
    if (profile.triageChecklist[entry]) {
      triageChecklistString += "<td>[x]</td>\n";
    } else {
      triageChecklistString += "<td>[_]</td>\n";
    }
  });
  var infectionRegionsString: String = "";
  Object.keys(profile.infectionRegions).forEach((entry) => {
    infectionRegionsString +=
      '<tr style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;"> <td>' +
      REGIONAREAS[entry as keyof typeof REGIONAREAS].text +
      "</td>";
    if (profile.infectionRegions[entry]) {
      infectionRegionsString += "<td>[x]</td>\n";
    } else {
      infectionRegionsString += "<td>[_]</td>\n";
    }
  });

  var imgHTMLString: String = "";

  profile.attachments.forEach((image) => {
    imgHTMLString +=
      '<img width="250" style="margin-left: 15;" src="' +
      useMedia(image.blob) +
      '">';
  });

  const html =
    `
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="text-align: left;">
            <div class="row">
                <div class="column border-right">
                    <h1 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">
                        Patient Profile 
                    </h1>
                    <h2 style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal;">
                        ` +
    profile.identity.name +
    `
                    </h2>
                    <h3 style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;">
                        AGE: ` +
    age +
    `
                    </h3>
                    <h3 style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;">
                        SEX: ` +
    profile.identity.sex +
    `
                    </h3>
                    <hr>
                    <h2 style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal;">
                        <u>History</u>
                    </h2>
                    <h3 style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;">
                        <b>Medical History:</b>
                        ` +
    profile.patientHistory.pastHistory +
    `
                    </h3>
                    <h3 style="font-size: 10px; font-family: Helvetica Neue; font-weight: normal;">
                        <b>History of Current Infection:</b>
                        ` +
    profile.patientHistory.currentInfectionHistory +
    `
                    </h3>
                    <h2 style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal;">
                        <u>Triage Checklist</u>
                    </h2>

                    <table style="width=100%;">
                        ` +
    triageChecklistString +
    `
                    </table>
                    <h2 style="font-size: 20px; font-family: Helvetica Neue; font-weight: normal;">
                        <u>Infection Regions</u>
                    </h2>

                    <table style="width=100%;">
                        ` +
    infectionRegionsString +
    `
                    </table>
                    
                </div>
                ` +
    imgHTMLString +
    `
            </div>
            
        </body>
        <style>
        .column {
            float: left;
            width: 50%;
        }
        .row:after {
            content: "";
            display: table;
            clear: both;
        }    
        .border-right {
            border-right: 0.5px solid black;
        }

        body {
          padding: 5%;
        }
        </style>

    </html>
`;

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html,
    });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  return (
    <View style={styles.container}>
       <Button size="lg" py={8}
        colorScheme="primary" onPress={print}
      >Print PDF</Button>
      <View style={styles.spacer} />
      <Button size="lg" py={8}
        colorScheme="primary" onPress={printToFile}>Share PDF</Button>
      {Platform.OS === 'ios' && (
        <>
          <View style={styles.spacer} />
          <View style={styles.spacer} />
        </>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    flexDirection: "column",
    padding: 8,
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: "center",
  },
});
